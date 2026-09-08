import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  fetchFigmaNode,
  fetchFigmaComponents,
  figmaToolDeclarations,
} from "./figma-tools";

export function createFigmaMcpServer() {
  const server = new Server(
    {
      name: "figma-design-system-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: figmaToolDeclarations.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: {
          type: "object",
          properties: tool.parameters.properties,
          required: tool.parameters.required,
        },
      })),
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "get_figma_node") {
      const result = await fetchFigmaNode(args || {});
      return {
        content: result.content.map((c) => ({
          type: c.type as "text",
          text: c.text || "",
        })),
        isError: result.isError,
      };
    }

    if (name === "get_figma_components") {
      const result = await fetchFigmaComponents(args || {});
      return {
        content: result.content.map((c) => ({
          type: c.type as "text",
          text: c.text || "",
        })),
        isError: result.isError,
      };
    }

    throw new Error(`Tool not found: ${name}`);
  });

  return server;
}
