import {
  figmaToolDeclarations,
  fetchFigmaNode,
  fetchFigmaComponents,
} from "./figma-tools";

export interface GeminiMcpMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RunGeminiMcpOptions {
  messages: GeminiMcpMessage[];
  systemInstruction?: string;
  model?: string;
  apiKey: string;
}

export async function runGeminiWithMcp(options: RunGeminiMcpOptions): Promise<string> {
  const { messages, systemInstruction, model: primaryModel = "gemini-3.6-flash", apiKey } = options;

  const modelPool = Array.from(
    new Set([
      primaryModel,
      "gemini-3.7-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.8-flash",
    ])
  );

  // Convert incoming conversation messages into Gemini contents format
  const contents: any[] = [];
  for (const m of messages) {
    if (m.role === "system") continue;
    contents.push({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    });
  }

  // Ensure there is at least one user message
  if (contents.length === 0) {
    contents.push({ role: "user", parts: [{ text: "Hello" }] });
  }

  const systemInstructionPart = systemInstruction
    ? { parts: [{ text: systemInstruction }] }
    : undefined;

  const tools = [{ functionDeclarations: figmaToolDeclarations }];

  // Multi-turn Function Calling loop (up to 4 tool iterations)
  const maxIterations = 4;
  let currentIteration = 0;

  while (currentIteration < maxIterations) {
    currentIteration++;

    const requestBody: any = {
      contents,
      tools,
    };
    if (systemInstructionPart) {
      requestBody.systemInstruction = systemInstructionPart;
    }

    let candidateContent: any = null;
    let lastErr = "";

    // Try through model pool in case of transient 429 or 503
    for (const currentModel of modelPool) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }).catch((e) => ({ ok: false, status: 0, text: async () => e.message } as any));

      if (res.ok) {
        const data = await res.json();
        candidateContent = data.candidates?.[0]?.content;
        break;
      } else {
        lastErr = await res.text();
        if (res.status === 400 && lastErr.includes("API_KEY_INVALID")) {
          break;
        }
      }
    }

    if (!candidateContent) {
      throw new Error(`Gemini API call failed: ${lastErr}`);
    }

    // Check if the model requested any function calls
    const parts = candidateContent.parts || [];
    const functionCallPart = parts.find((p: any) => p.functionCall);

    if (!functionCallPart) {
      // Model returned final text answer!
      const textPart = parts.find((p: any) => p.text);
      return textPart ? textPart.text : "";
    }

    // Model invoked a tool
    const fnCall = functionCallPart.functionCall;
    const toolName = fnCall.name;
    const toolArgs = fnCall.args || {};

    console.log(`[Figma MCP] Gemini requested tool: "${toolName}" with args:`, toolArgs);

    let toolResultText = "";
    let isError = false;
    if (toolName === "get_figma_node") {
      const result = await fetchFigmaNode(toolArgs);
      toolResultText = result.content[0]?.text || "No content";
      isError = Boolean(result.isError);
    } else if (toolName === "get_figma_components") {
      const result = await fetchFigmaComponents(toolArgs);
      toolResultText = result.content[0]?.text || "No components";
      isError = Boolean(result.isError);
    } else {
      toolResultText = `Error: Tool "${toolName}" is not supported.`;
      isError = true;
    }

    if (isError) {
      console.warn(`[Figma MCP Warning] Tool "${toolName}" returned an error:\n${toolResultText}`);
      if (toolResultText.includes("429") || toolResultText.includes("Rate limit")) {
        toolResultText = `[CRITICAL FIGMA API ERROR: 429 Too Many Requests]
The Figma Personal Access Token has hit Figma's Starter Plan API rate limit (penalty period active).
The requested Figma node could NOT be retrieved from Figma's servers.

INSTRUCTION FOR YOUR RESPONSE:
1. You MUST prominently notify the user at the top of your reply:
   "⚠️ **Figma API Rate Limit Exceeded (HTTP 429)**: Your Figma Personal Access Token has reached Figma's rate limit for this billing cycle/period.
   👉 **How to fix immediately**: Go to Figma -> Settings -> Security -> 'Personal access tokens' -> Click 'Generate new token' (with file_content:read scope), then update \`FIGMA_PERSONAL_ACCESS_TOKEN\` in your \`.env\` file."
2. Then, provide the closest possible mockup implementation based on the user's prompt text.`;
      }
    }

    // Append model's thought & function call (crucial: must preserve exact model content including thoughtSignature)
    contents.push(candidateContent);

    // Append user's function response
    contents.push({
      role: "user",
      parts: [
        {
          functionResponse: {
            name: toolName,
            response: {
              output: toolResultText,
            },
          },
        },
      ],
    });
  }

  // If loop exhausted, return last text
  const lastPart = contents[contents.length - 1]?.parts?.[0];
  return lastPart?.text || "Mockup synthesis completed with Figma context.";
}
