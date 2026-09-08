import * as fs from "fs";
import * as path from "path";
import type { FigmaToolDefinition, FigmaToolResult, SimplifiedFigmaNode } from "./types";

const nodeCache = new Map<string, { result: FigmaToolResult; timestamp: number }>();

function getFigmaCredentials() {
  let token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN || "";
  let fileKey = process.env.FIGMA_FILE_KEY || "";

  const configPath = path.resolve(process.cwd(), ".figma/config.json");
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      if (!token && config.personalAccessToken) token = config.personalAccessToken;
      if (!fileKey && config.figmaFileKey) fileKey = config.figmaFileKey;
    } catch {}
  }

  return { token, fileKey };
}

export function parseFigmaUrl(rawUrl: string): { fileKey?: string; nodeId?: string } {
  try {
    const url = new URL(rawUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    let fileKey: string | undefined;

    const fileIdx = parts.findIndex((p) => p === "file" || p === "design");
    if (fileIdx !== -1 && parts[fileIdx + 1]) {
      fileKey = parts[fileIdx + 1];
    }

    const rawNodeId = url.searchParams.get("node-id");
    let nodeId = rawNodeId || undefined;
    if (nodeId) {
      nodeId = nodeId.replace("-", ":");
    }

    return { fileKey, nodeId };
  } catch {
    return {};
  }
}

function rgbaToHex(color: { r: number; g: number; b: number; a?: number }): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
  const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
  const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
  if (typeof color.a === "number" && color.a < 1) {
    const a = Math.round(color.a * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}${a}`;
  }
  return `#${r}${g}${b}`;
}

function simplifyNode(node: any, depth = 0): SimplifiedFigmaNode | null {
  if (!node || depth > 8) return null;

  const res: SimplifiedFigmaNode = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  if (node.layoutMode || node.absoluteBoundingBox) {
    res.layout = {
      mode: node.layoutMode || "NONE",
      spacing: node.itemSpacing,
      padding: {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft,
      },
      align: node.primaryAxisAlignItems,
      justify: node.counterAxisAlignItems,
      width: node.absoluteBoundingBox ? Math.round(node.absoluteBoundingBox.width) : undefined,
      height: node.absoluteBoundingBox ? Math.round(node.absoluteBoundingBox.height) : undefined,
    };
  }

  const fills: string[] = [];
  if (Array.isArray(node.fills)) {
    for (const fill of node.fills) {
      if (fill.visible !== false && fill.type === "SOLID" && fill.color) {
        fills.push(rgbaToHex(fill.color));
      }
    }
  }
  if (fills.length > 0 || node.cornerRadius) {
    res.style = {
      fills: fills.length > 0 ? fills : undefined,
      cornerRadius: node.cornerRadius,
      opacity: node.opacity,
    };
  }

  if (node.type === "TEXT") {
    res.text = {
      characters: node.characters,
      fontSize: node.style?.fontSize,
      fontWeight: node.style?.fontWeight,
      textAlign: node.style?.textAlignHorizontal,
    };
  }

  if (Array.isArray(node.children)) {
    const children: SimplifiedFigmaNode[] = [];
    for (const child of node.children) {
      if (child.visible === false) continue;
      const simplified = simplifyNode(child, depth + 1);
      if (simplified) children.push(simplified);
    }
    if (children.length > 0) {
      res.children = children;
    }
  }

  return res;
}

export async function fetchFigmaNode(args: {
  nodeId?: string;
  fileKey?: string;
  figmaUrl?: string;
}): Promise<FigmaToolResult> {
  const { token: defaultToken, fileKey: defaultFileKey } = getFigmaCredentials();

  let targetFileKey = args.fileKey || defaultFileKey;
  let targetNodeId = args.nodeId;

  if (args.figmaUrl) {
    const parsed = parseFigmaUrl(args.figmaUrl);
    if (parsed.fileKey) targetFileKey = parsed.fileKey;
    if (parsed.nodeId) targetNodeId = parsed.nodeId;
  }

  if (!defaultToken) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: "Error: FIGMA_PERSONAL_ACCESS_TOKEN is missing. Please set FIGMA_PERSONAL_ACCESS_TOKEN in .env.",
        },
      ],
    };
  }

  if (!targetFileKey) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: "Error: Missing Figma File Key. Provide fileKey or a full Figma URL.",
        },
      ],
    };
  }

  if (!targetNodeId) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: "Error: Missing Figma Node ID. Provide nodeId or a Figma URL with ?node-id=...",
        },
      ],
    };
  }

  const normalizedNodeId = targetNodeId.replace("-", ":");
  const cacheKey = `${targetFileKey}:${normalizedNodeId}`;

  // Check in-memory cache (TTL: 10 minutes)
  const cached = nodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
    return cached.result;
  }


  try {
    const url = `https://api.figma.com/v1/files/${targetFileKey}/nodes?ids=${encodeURIComponent(
      normalizedNodeId
    )}`;
    const res = await fetch(url, {
      headers: { "X-Figma-Token": defaultToken },
    });

    if (!res.ok) {
      if (res.status === 429 && cached) {
        console.warn(`[Figma MCP] Rate limited (429), serving stale cached node for ${cacheKey}`);
        return cached.result;
      }
      const errText = await res.text();
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Figma API Error (${res.status} ${res.statusText}): ${errText}`,
          },
        ],
      };
    }

    const data: any = await res.json();
    const nodeWrapper = data.nodes?.[normalizedNodeId];
    if (!nodeWrapper || !nodeWrapper.document) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Node [${normalizedNodeId}] was not found in Figma file ${targetFileKey}.`,
          },
        ],
      };
    }

    const simplified = simplifyNode(nodeWrapper.document);
    const finalResult: FigmaToolResult = {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              fileKey: targetFileKey,
              nodeId: normalizedNodeId,
              name: nodeWrapper.document.name,
              tree: simplified,
            },
            null,
            2
          ),
        },
      ],
    };

    nodeCache.set(cacheKey, { result: finalResult, timestamp: Date.now() });
    return finalResult;
  } catch (err: any) {
    return {
      isError: true,
      content: [{ type: "text", text: `Failed to inspect Figma node: ${err.message}` }],
    };
  }
}

export async function fetchFigmaComponents(args: {
  fileKey?: string;
}): Promise<FigmaToolResult> {
  const { token, fileKey: defaultFileKey } = getFigmaCredentials();
  const targetFileKey = args.fileKey || defaultFileKey;

  if (!token || !targetFileKey) {
    return {
      isError: true,
      content: [{ type: "text", text: "Missing Figma credentials or file key." }],
    };
  }

  try {
    const res = await fetch(`https://api.figma.com/v1/files/${targetFileKey}?depth=2`, {
      headers: { "X-Figma-Token": token },
    });
    if (!res.ok) {
      return {
        isError: true,
        content: [{ type: "text", text: `Figma API returned ${res.status}: ${res.statusText}` }],
      };
    }
    const data: any = await res.json();
    const components = Object.values(data.components || {}).map((c: any) => ({
      key: c.key,
      name: c.name,
      description: c.description,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ fileName: data.name, components }, null, 2),
        },
      ],
    };
  } catch (err: any) {
    return {
      isError: true,
      content: [{ type: "text", text: err.message }],
    };
  }
}

export const figmaToolDeclarations: FigmaToolDefinition[] = [
  {
    name: "get_figma_node",
    description:
      "Fetches layout metrics, Auto-Layout, typography, colors, padding, and UI component hierarchy for a specific Figma Frame or Node. Use when the user references a Figma URL or Node ID.",
    parameters: {
      type: "OBJECT",
      properties: {
        figmaUrl: {
          type: "STRING",
          description: "Full Figma URL containing file key and node-id (e.g. https://www.figma.com/design/.../?node-id=1:85)",
        },
        nodeId: {
          type: "STRING",
          description: "Figma node ID, e.g. '1:85' or '12-34'",
        },
        fileKey: {
          type: "STRING",
          description: "Figma file key (optional if figmaUrl is provided)",
        },
      },
    },
  },
  {
    name: "get_figma_components",
    description:
      "Lists all published and local components inside the project's Figma file.",
    parameters: {
      type: "OBJECT",
      properties: {
        fileKey: {
          type: "STRING",
          description: "Figma file key (optional, defaults to project file)",
        },
      },
    },
  },
];
