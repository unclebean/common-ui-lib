/**
 * Figma -> shadcn Token & Component Inspector & Synchronizer
 *
 * Compatible with ALL Figma plans (Free, Starter, Pro, Enterprise).
 * Uses standard file_content:read scope to parse Component Sets,
 * Auto-layout metrics (padding, radius), and solid color fills.
 */

import * as fs from "fs";
import * as path from "path";

export function figmaRgbaToHsl(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360 * 10) / 10;
  const sPct = Math.round(s * 100 * 10) / 10;
  const lPct = Math.round(l * 100 * 10) / 10;

  return `${hDeg} ${sPct}% ${lPct}%`;
}

export async function syncFigmaFile() {
  if (typeof (process as any).loadEnvFile === "function") {
    if (fs.existsSync(".env.local")) (process as any).loadEnvFile(".env.local");
    else if (fs.existsSync(".env")) (process as any).loadEnvFile(".env");
  }

  const configPath = path.resolve(process.cwd(), ".figma/config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("Missing .figma/config.json configuration file.");
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const token = process.env.FIGMA_PERSONAL_ACCESS_TOKEN || config.personalAccessToken;
  const fileKey = process.env.FIGMA_FILE_KEY || config.figmaFileKey;

  if (!token) {
    throw new Error(
      "Missing Figma Access Token. Please set FIGMA_PERSONAL_ACCESS_TOKEN in your .env file."
    );
  }

  const headers = { "X-Figma-Token": token };

  console.log(`Connecting to Figma File: ${fileKey}...`);
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}`, { headers });
  if (!res.ok) {
    throw new Error(`Figma API returned ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  console.log(`✓ Successfully fetched: "${data.name}"`);

  // Traverse document to extract components and color styles
  const components: Record<string, any> = {};
  const extractedColors: Record<string, string> = {};
  let detectedRadius = "0.5rem";

  function walk(node: any) {
    // Detect component sets (e.g. button, card, tabs)
    if (node.type === "COMPONENT_SET" || node.type === "COMPONENT") {
      components[node.name.toLowerCase()] = {
        id: node.id,
        name: node.name,
        type: node.type,
        variantCount: node.children?.length || 1,
      };
    }

    // Detect solid fills
    if (node.fills && Array.isArray(node.fills)) {
      for (const fill of node.fills) {
        if (fill.type === "SOLID" && fill.color) {
          const hsl = figmaRgbaToHsl(fill.color.r, fill.color.g, fill.color.b);
          const cleanName = node.name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
          if (cleanName && !extractedColors[cleanName]) {
            extractedColors[cleanName] = hsl;
          }
        }
      }
    }

    // Detect corner radius
    if (typeof node.cornerRadius === "number" && node.cornerRadius > 0 && node.cornerRadius <= 16) {
      detectedRadius = `${node.cornerRadius / 16}rem`;
    }

    if (node.children) {
      for (const child of node.children) {
        walk(child);
      }
    }
  }

  walk(data.document);

  console.log(`✓ Detected ${Object.keys(components).length} components in Figma file.`);
  console.log(`✓ Detected corner radius standard: ${detectedRadius}`);

  // Save mirror cache
  fs.writeFileSync(
    path.resolve(process.cwd(), ".figma/tokens.raw.json"),
    JSON.stringify({ components, extractedColors, detectedRadius, lastSync: new Date().toISOString() }, null, 2)
  );
  console.log(`✓ Saved mirror to .figma/tokens.raw.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncFigmaFile().catch((err) => console.error(err));
}
