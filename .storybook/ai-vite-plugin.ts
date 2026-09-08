import type { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import * as lucide from "lucide-react";

const lucideSet = new Set(Object.keys(lucide));

export function sanitizeMockupCode(rawCode: string): string {
  let code = rawCode.trim();

  // 1. Remove leading language identifier token on line 1 if present (e.g. ```tsx\ntsx\n...)
  code = code.replace(/^(?:tsx|jsx|typescript|javascript)\s*\n/i, "");

  // 2. Fix React import
  if (!code.includes("import React") && !code.includes("import * as React")) {
    code = `import React from "react";\n` + code;
  }

  // 3. Fix lucide-react imports: filter out invalid third-party icon prefixes (IoMd, Fa, Md, Ai, etc.)
  code = code.replace(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["'];?/g, (match, p1) => {
    const validIcons = p1
      .split(",")
      .map((s) => s.trim())
      .filter((s) => {
        if (!s) return false;
        if (/^(Io|Fa|Md|Ai|Bi|Bs|Fi|Ri|Ti|Go|Gi|Tb|Hi|Si)[A-Z]/.test(s)) return false;
        return true;
      });
    if (validIcons.length === 0) {
      return `import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Activity } from "lucide-react";`;
    }
    return `import { ${validIcons.join(", ")} } from "lucide-react";`;
  });

  // 4. Convert default imports of UI / layout / finance components to named imports
  code = code.replace(/import\s+Button\s+from\s*["']@\/components\/ui\/button["'];?/g, 'import { Button } from "@/components/ui/button";');
  code = code.replace(/import\s+Card\s+from\s*["']@\/components\/ui\/card["'];?/g, 'import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";');
  code = code.replace(/import\s+Badge\s+from\s*["']@\/components\/ui\/badge["'];?/g, 'import { Badge } from "@/components/ui/badge";');
  code = code.replace(/import\s+Avatar\s+from\s*["']@\/components\/ui\/avatar["'];?/g, 'import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";');
  code = code.replace(/import\s+Separator\s+from\s*["']@\/components\/ui\/separator["'];?/g, 'import { Separator } from "@/components/ui/separator";');
  code = code.replace(/import\s+Grid\s+from\s*["']@\/components\/layout\/grid["'];?/g, 'import { Grid, GridItem } from "@/components/layout/grid";');
  code = code.replace(/import\s+Stack\s+from\s*["']@\/components\/layout\/stack["'];?/g, 'import { Stack, VStack, HStack } from "@/components/layout/stack";');
  code = code.replace(/import\s+PageHeader\s+from\s*["']@\/components\/layout\/page-header["'];?/g, 'import { PageHeader } from "@/components/layout/page-header";');
  code = code.replace(/import\s+PortfolioChart\s+from\s*["']@\/finance\/portfolio-chart["'];?/g, 'import { PortfolioPerformanceChart } from "@/finance/portfolio-chart";');
  code = code.replace(/import\s+AssetTable\s+from\s*["']@\/finance\/asset-table["'];?/g, 'import { AssetHoldingsTable, sampleHoldings } from "@/finance/asset-table";');
  code = code.replace(/import\s+CandlestickChart\s+from\s*["']@\/finance\/candlestick-chart["'];?/g, 'import { CandlestickChart, sampleCandleData } from "@/finance/candlestick-chart";');

  // Replace invalid component names
  code = code.replace(/\bPortfolioChart\b/g, "PortfolioPerformanceChart");
  code = code.replace(/\bAssetTable\b/g, "AssetHoldingsTable");
  code = code.replace(/\bCandleChart\b/g, "CandlestickChart");
  code = code.replace(/\bTradingViewChart\b/g, "CandlestickChart");

  // Fix AssetHoldingsTable props
  code = code.replace(/<AssetHoldingsTable(?!\s+data=)[^>]*\/>/g, "<AssetHoldingsTable data={sampleHoldings} />");
  code = code.replace(/<AssetHoldingsTable\s+(?:holdings|items|assets)=/g, "<AssetHoldingsTable data=");

  // 5. Fix Stack and Grid subcomponents
  code = code.replace(/<Grid\.Row[^>]*>/g, '<div className="grid grid-cols-1 md:grid-cols-2 gap-6">').replace(/<\/Grid\.Row>/g, "</div>");
  code = code.replace(/<Grid\.Col[^>]*>/g, "<div>").replace(/<\/Grid\.Col>/g, "</div>");
  code = code.replace(/<Stack\.Item[^>]*>/g, "<div>").replace(/<\/Stack\.Item>/g, "</div>");
  code = code.replace(/templateColumns="[^"]*"/g, "");
  code = code.replace(/gap=\{([0-9]+)\}/g, 'gap="lg"');
  code = code.replace(/gap="([0-9]+)"/g, 'gap="lg"');

  // 6. Fix Avatar self-closing tag or missing fallback
  code = code.replace(/<Avatar\s+src="([^"]*)"\s+alt="([^"]*)"\s*\/>/g, '<Avatar><AvatarFallback>$2</AvatarFallback></Avatar>');
  code = code.replace(/<Avatar\s+alt="([^"]*)"\s+src="([^"]*)"\s*\/>/g, '<Avatar><AvatarFallback>$1</AvatarFallback></Avatar>');
  code = code.replace(/<Avatar\s*\/>/g, '<Avatar><AvatarFallback>UI</AvatarFallback></Avatar>');

  if (code.includes("<AvatarFallback") && !code.includes("<Avatar>")) {
    code = code.replace(/(<AvatarFallback[^>]*>[\s\S]*?<\/AvatarFallback>)/g, `<Avatar>$1</Avatar>`);
  }

  // Ensure Avatar import has Avatar and AvatarFallback if used
  if (code.includes("<Avatar") && code.includes("@/components/ui/avatar")) {
    code = code.replace(
      /import\s*\{([^}]+)\}\s*from\s*["']@\/components\/ui\/avatar["']/,
      'import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"'
    );
  }

  // 7. Fix Button props (remove unsupported type="primary", shape="round", map variant="primary" to default)
  code = code.replace(/\btype="primary"/g, "");
  code = code.replace(/\bshape="round"/g, "");
  code = code.replace(/variant="primary"/g, 'variant="default"');

  // 8. Ensure default export exists
  if (!code.includes("export default")) {
    const fnMatch = code.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
    if (fnMatch) {
      code += `\nexport default ${fnMatch[1]};\n`;
    } else {
      const constMatch = code.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
      if (constMatch) {
        code += `\nexport default ${constMatch[1]};\n`;
      }
    }
  }

  // 9. Check and auto-stub non-existent @/ imports to prevent Rollup/Vite build crashes
  const srcDir = path.resolve(process.cwd(), "src");
  const importRegex = /import\s+(?:\{([^}]+)\}|([A-Za-z0-9_]+))\s+from\s+["'](@\/[^"']+)["'];?/g;
  const stubs: string[] = [];

  code = code.replace(importRegex, (match, namedImports, defaultImport, importPath) => {
    const relativePath = importPath.replace(/^@\//, "");
    const possiblePaths = [
      path.join(srcDir, relativePath + ".tsx"),
      path.join(srcDir, relativePath + ".ts"),
      path.join(srcDir, relativePath, "index.tsx"),
      path.join(srcDir, relativePath, "index.ts"),
    ];

    const exists = possiblePaths.some((p) => fs.existsSync(p));
    if (!exists) {
      const symbols: string[] = [];
      if (defaultImport) symbols.push(defaultImport.trim());
      if (namedImports) {
        namedImports.split(",").forEach((s) => {
          const sym = s.trim().split(/\s+as\s+/)[0].trim();
          if (sym) symbols.push(sym);
        });
      }
      symbols.forEach((sym) => {
        stubs.push(`const ${sym}: any = ({ children, ...props }: any) => <div {...props}>{children}</div>;`);
      });
      return `// [Auto-Stub] Removed non-existent import "${importPath}"`;
    }
    return match;
  });

  if (stubs.length > 0) {
    code = stubs.join("\n") + "\n\n" + code;
  }

  // 10. Fix icon typos (e.g. TrendingsUp -> TrendingUp) and auto-import any used Lucide icons
  code = code.replace(/\bTrendingsUp\b/g, "TrendingUp");
  code = code.replace(/\bTrendingsDown\b/g, "TrendingDown");
  code = code.replace(/\bArrowsUpRight\b/g, "ArrowUpRight");
  code = code.replace(/\bArrowsDownRight\b/g, "ArrowDownRight");
  code = code.replace(/\bWallets\b/g, "Wallet");
  code = code.replace(/\bShields\b/g, "Shield");

  // Reserved UI component names that must NEVER be imported from lucide-react
  const uiReserved = new Set([
    "Badge", "Button", "Card", "Avatar", "Separator", "Input", "Label",
    "Select", "Switch", "Slider", "Progress", "Tabs", "Dialog", "Popover",
    "Tooltip", "Accordion", "Alert", "ScrollArea", "Grid", "GridItem",
    "Stack", "VStack", "HStack", "PageHeader", "PortfolioPerformanceChart",
    "AssetHoldingsTable", "CandlestickChart", "Container"
  ]);

  // Collect all imported symbols from non-lucide imports to prevent duplicate identifiers
  const otherImportedSymbols = new Set<string>();
  const nonLucideImports =
    code.match(/import\s+(?:\{([^}]+)\}|([A-Za-z0-9_]+))\s+from\s+["'](?!lucide-react)[^"']+["'];?/g) || [];
  for (const imp of nonLucideImports) {
    const namedMatch = imp.match(/\{([^}]+)\}/);
    if (namedMatch) {
      namedMatch[1].split(",").forEach((s) => {
        const sym = s.trim().split(/\s+as\s+/)[0].trim();
        if (sym) otherImportedSymbols.add(sym);
      });
    }
    const defMatch = imp.match(/import\s+([A-Za-z0-9_]+)\s+from/);
    if (defMatch && defMatch[1] && defMatch[1] !== "type") {
      otherImportedSymbols.add(defMatch[1].trim());
    }
  }

  // Find all JSX tags in the code: <Tag or <Tag>
  const jsxTagMatches = code.match(/<([A-Z][A-Za-z0-9_]*)/g) || [];
  const usedTags = new Set(jsxTagMatches.map((t) => t.slice(1)));

  // Identify used Lucide icons
  const iconsToImport = new Set<string>();
  for (const tag of usedTags) {
    if (uiReserved.has(tag) || otherImportedSymbols.has(tag)) continue;
    if (lucideSet.has(tag)) {
      iconsToImport.add(tag);
    } else {
      const singular = tag.replace(/s([A-Z])/, "$1");
      if (lucideSet.has(singular) && !uiReserved.has(singular) && !otherImportedSymbols.has(singular)) {
        const reg = new RegExp(`\\b${tag}\\b`, "g");
        code = code.replace(reg, singular);
        iconsToImport.add(singular);
      }
    }
  }

  // Clean existing lucide-react import and add any missing icons
  if (code.includes('from "lucide-react"') || code.includes("from 'lucide-react'")) {
    code = code.replace(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["'];?/, (match, p1) => {
      const existing = p1
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && !otherImportedSymbols.has(s) && !uiReserved.has(s));
      iconsToImport.forEach((ic) => {
        if (!existing.includes(ic)) existing.push(ic);
      });
      return existing.length > 0 ? `import { ${existing.join(", ")} } from "lucide-react";` : "";
    });
  } else if (iconsToImport.size > 0) {
    code = `import { ${Array.from(iconsToImport).join(", ")} } from "lucide-react";\n` + code;
  }

  // 11. Auto-stub any remaining undefined JSX tags that are neither imported nor declared
  const undefinedStubs: string[] = [];
  for (const tag of usedTags) {
    if (iconsToImport.has(tag)) continue;
    if (tag === "React" || tag === "Fragment") continue;

    const isImported =
      new RegExp(`\\b${tag}\\b.*from`).test(code) ||
      new RegExp(`import\\s*\\{[^}]*\\b${tag}\\b[^}]*\\}`).test(code) ||
      new RegExp(`const\\s+${tag}\\b`).test(code);
    const isDeclared = new RegExp(`(?:function|let|var|class)\\s+${tag}\\b`).test(code);

    if (!isImported && !isDeclared) {
      undefinedStubs.push(
        `const ${tag}: any = ({ children, ...props }: any) => <div {...props}>{children}</div>;`
      );
    }
  }

  if (undefinedStubs.length > 0) {
    code = undefinedStubs.join("\n") + "\n\n" + code;
  }

  // 12. Global import deduplication: ensure no identifier is imported twice across different import statements
  const seenIdentifiers = new Set<string>();
  code = code.replace(/import\s*\{([^}]+)\}\s*from\s*(["'][^"']+["']);?/g, (match, namedList, fromPath) => {
    const symbols = namedList.split(",").map((s: string) => s.trim()).filter(Boolean);
    const uniqueSymbols = symbols.filter((sym: string) => {
      const baseName = sym.split(/\s+as\s+/)[0].trim();
      if (seenIdentifiers.has(baseName)) return false;
      seenIdentifiers.add(baseName);
      return true;
    });
    if (uniqueSymbols.length === 0) return "";
    return `import { ${uniqueSymbols.join(", ")} } from ${fromPath};`;
  });

  if (!code.includes("import.meta.hot")) {
    code += `\n\nif (import.meta.hot) {\n  import.meta.hot.accept();\n}\n`;
  }

  return code;
}


export function aiMockupVitePlugin(): Plugin {
  return {
    name: "vite-plugin-storybook-ai-mockup",
    configureServer(server) {
      // Load environment variables (.env and .env.local)
      const loadEnvFileSafely = (file: string) => {
        const fullPath = path.resolve(process.cwd(), file);
        if (!fs.existsSync(fullPath)) return;
        try {
          if (typeof (process as any).loadEnvFile === "function") {
            (process as any).loadEnvFile(fullPath);
          }
        } catch {}
        try {
          const raw = fs.readFileSync(fullPath, "utf8");
          for (const line of raw.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx > 0) {
              const k = trimmed.slice(0, eqIdx).trim();
              let v = trimmed.slice(eqIdx + 1).trim();
              if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                v = v.slice(1, -1);
              }
              process.env[k] = v;
            }
          }
        } catch {}
      };

      loadEnvFileSafely(".env");
      loadEnvFileSafely(".env.local");



      // Smart fallback resolver for pre-bundled dependency chunks if browser requested older hash
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        if (url.includes("/sb-vite/deps/")) {
          const cleanUrl = url.split("?")[0];
          const localPath = path.resolve(process.cwd(), cleanUrl.replace(/^\//, ""));
          if (!fs.existsSync(localPath)) {
            const depsDir = path.dirname(localPath);
            if (fs.existsSync(depsDir)) {
              const baseName = path.basename(cleanUrl);
              const prefix = baseName.replace(/-[A-Za-z0-9_]+\.js$/i, "");
              const allFiles = fs.readdirSync(depsDir);
              const match = allFiles.find(
                (f) => f.startsWith(prefix) && f.endsWith(".js")
              );
              if (match) {
                const targetFile = path.join(depsDir, match);
                const content = fs.readFileSync(targetFile, "utf8");
                res.writeHead(200, {
                  "Content-Type": "application/javascript; charset=utf-8",
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                });
                res.end(content);
                return;
              }
            }
          }
        }
        next();
      });

      server.middlewares.use(async (req, res, next) => {
        const url = req.url || "";

        // Endpoint 1: GET /api/ai/context
        if (url.startsWith("/api/ai/context") && req.method === "GET") {
          try {
            const contextPath = path.resolve(process.cwd(), "CONTEXT.md");
            const designPath = path.resolve(process.cwd(), "design.md");
            let designSpec = "";
            if (fs.existsSync(contextPath)) {
              designSpec = fs.readFileSync(contextPath, "utf8");
            } else if (fs.existsSync(designPath)) {
              designSpec = fs.readFileSync(designPath, "utf8");
            }

            const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
            const defaultProvider =
              process.env.STORYBOOK_AI_PROVIDER || (hasGeminiKey ? "gemini" : "ollama");

            const defaultGeminiModel =
              process.env.GEMINI_MODEL ||
              (process.env.STORYBOOK_AI_PROVIDER === "gemini" ? process.env.STORYBOOK_AI_MODEL : null) ||
              "gemini-3.6-flash";

            const defaultOllamaModel =
              process.env.OLLAMA_MODEL ||
              (process.env.STORYBOOK_AI_PROVIDER === "ollama" ? process.env.STORYBOOK_AI_MODEL : null) ||
              "llama3.2:latest";

            const ollamaBaseUrl =
              process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                hasGeminiKey,
                defaultProvider,
                defaultModel: defaultProvider === "gemini" ? defaultGeminiModel : defaultOllamaModel,
                geminiModel: defaultGeminiModel,
                ollamaModel: defaultOllamaModel,
                ollamaUrl: ollamaBaseUrl,
                designSpec,
              })
            );
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Endpoint: GET /api/ai/models (Fetch local/remote Ollama models)
        if (url.startsWith("/api/ai/models") && req.method === "GET") {
          try {
            const ollamaBaseUrl =
              process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
            const ollamaUrl = `${ollamaBaseUrl.replace(/\/$/, "")}/api/tags`;
            const ollamaRes = await fetch(ollamaUrl).catch(() => null);
            let models: string[] = [];
            if (ollamaRes && ollamaRes.ok) {
              const data: any = await ollamaRes.json();
              models = (data.models || []).map((m: any) => m.name);
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ models }));
          } catch {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ models: [] }));
          }
          return;
        }

        // Helper to parse JSON body
        const parseJsonBody = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                reject(e);
              }
            });
            req.on("error", reject);
          });
        };

        // Endpoint: POST /api/ai/reset (Resets ActiveMockup to clean blank slate)
        if (url.startsWith("/api/ai/reset") && req.method === "POST") {
          try {
            const blankTemplate = `import React from "react";
import { Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";

export default function MockupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 select-none">
      <div className="relative mb-6">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/30 to-indigo-500/20 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/10 via-background to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-lg">
          <LayoutTemplate className="w-8 h-8 opacity-90" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ready to Create</span>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Blank AI Canvas
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
        Use the <strong className="text-foreground">AI Mockup Studio</strong> panel on the right to describe any screen or interface. The AI will synthesize your design system components and render them live here.
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border px-4 py-2 rounded-xl">
        <span>Type a prompt in the assistant panel</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
        <span>Watch your mockup generate instantly</span>
      </div>
    </div>
  );
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
`;
            const activeFilePath = path.resolve(process.cwd(), "src/mockups/ActiveMockup.tsx");
            fs.writeFileSync(activeFilePath, blankTemplate, "utf8");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Endpoint: POST /api/ai/live-update (Instantly renders code in Live AI Canvas via Vite HMR)
        if (url.startsWith("/api/ai/live-update") && req.method === "POST") {
          try {
            const { code } = await parseJsonBody();
            if (!code) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "code is required." }));
              return;
            }

            const cleanCode = sanitizeMockupCode(code);
            const activeFilePath = path.resolve(process.cwd(), "src/mockups/ActiveMockup.tsx");
            fs.writeFileSync(activeFilePath, cleanCode, "utf8");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: true,
                storyId: "01-ai-mockups-live-ai-canvas--default",
              })
            );
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Endpoint 2: POST /api/ai/save-mockup
        if (url.startsWith("/api/ai/save-mockup") && req.method === "POST") {
          try {
            const { fileName, title, code } = await parseJsonBody();
            if (!fileName || !code) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "fileName and code are required." }));
              return;
            }

            // Sanitize file name
            const cleanName = fileName.replace(/[^a-zA-Z0-9_-]/g, "");
            const mockupsDir = path.resolve(process.cwd(), "src/mockups");
            const storiesDir = path.resolve(process.cwd(), "src/stories/mockups");

            if (!fs.existsSync(mockupsDir)) fs.mkdirSync(mockupsDir, { recursive: true });
            if (!fs.existsSync(storiesDir)) fs.mkdirSync(storiesDir, { recursive: true });

            // 1. Write the component file
            const cleanCode = sanitizeMockupCode(code);
            const componentFilePath = path.join(mockupsDir, `${cleanName}.tsx`);
            fs.writeFileSync(componentFilePath, cleanCode, "utf8");

            // 2. Write the companion Storybook Story
            const storyTitle = title || cleanName.replace(/([A-Z])/g, " $1").trim();
            const storyContent = `import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import ${cleanName} from "@/mockups/${cleanName}";

const meta: Meta = {
  title: "01. AI Mockups/${storyTitle}",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Preview: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground p-6">
      <${cleanName} />
    </div>
  ),
};
`;
            const storyFilePath = path.join(storiesDir, `${cleanName}.stories.tsx`);
            fs.writeFileSync(storyFilePath, storyContent, "utf8");

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: true,
                cleanName,
                componentPath: componentFilePath,
                storyPath: storyFilePath,
                storyTitle: `01. AI Mockups/${storyTitle}`,
              })
            );
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        // Endpoint 3: POST /api/ai/chat (Proxy for Ollama / Gemini to bypass CORS)
        if (url.startsWith("/api/ai/chat") && req.method === "POST") {
          try {
            const {
              provider,
              model,
              messages,
              apiKey,
              ollamaUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434",
            } = await parseJsonBody();

            if (provider === "ollama") {
              const targetModel =
                model ||
                process.env.OLLAMA_MODEL ||
                (process.env.STORYBOOK_AI_PROVIDER === "ollama" ? process.env.STORYBOOK_AI_MODEL : null) ||
                "llama3.2:latest";
              const targetUrl = `${(ollamaUrl || "http://127.0.0.1:11434").replace(/\/$/, "")}/api/chat`;

              const ollamaRes = await fetch(targetUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: targetModel,
                  messages,
                  stream: false,
                }),
              });

              if (!ollamaRes.ok) {
                const errText = await ollamaRes.text();
                throw new Error(`Ollama error [${ollamaRes.status}]: ${errText}`);
              }

              const data: any = await ollamaRes.json();
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  role: "assistant",
                  content: data.message?.content || "",
                })
              );
              return;
            }

            if (provider === "gemini") {
              const key = apiKey || process.env.GEMINI_API_KEY;
              if (!key) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    error:
                      "Missing Gemini API Key. Please provide it in the UI settings or set GEMINI_API_KEY in your server .env file.",
                  })
                );
                return;
              }

              const primaryModel =
                model ||
                process.env.GEMINI_MODEL ||
                (process.env.STORYBOOK_AI_PROVIDER === "gemini" ? process.env.STORYBOOK_AI_MODEL : null) ||
                "gemini-3.7-flash";

              // Transform messages to Gemini contents format
              const contents = messages
                .filter((m: any) => m.role !== "system")
                .map((m: any) => ({
                  role: m.role === "assistant" ? "model" : "user",
                  parts: [{ text: m.content }],
                }));

              // Extract system instruction if present
              const systemMsg = messages.find((m: any) => m.role === "system");

              const geminiBody: any = { contents };
              if (systemMsg) {
                geminiBody.systemInstruction = {
                  parts: [{ text: systemMsg.content }],
                };
              }

              // Pool of candidate models to try if primary model hits 429 quota or 503 capacity limit
              const modelPool = Array.from(
                new Set([
                  primaryModel,
                  "gemini-3.7-flash",
                  "gemini-3.5-flash",
                  "gemini-3.5-flash-lite",
                  "gemini-3.1-flash-lite",
                  "gemini-3.6-flash",
                  "gemini-3.8-flash",
                ])
              );

              let lastErr = "";
              let successfulData: any = null;

              for (const currentModel of modelPool) {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${key}`;
                const geminiRes = await fetch(geminiUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(geminiBody),
                }).catch((e) => ({ ok: false, status: 0, text: async () => e.message } as any));

                if (geminiRes.ok) {
                  successfulData = await geminiRes.json();
                  break;
                } else {
                  lastErr = await geminiRes.text();
                  if (geminiRes.status === 400 && lastErr.includes("API_KEY_INVALID")) {
                    break;
                  }
                }
              }

              if (!successfulData) {
                throw new Error(`Gemini API error: ${lastErr}`);
              }

              const text =
                successfulData.candidates?.[0]?.content?.parts?.[0]?.text || "";

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  role: "assistant",
                  content: text,
                })
              );
              return;
            }

            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: `Unknown provider: ${provider}` }));
          } catch (err: any) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err.message }));
          }
          return;
        }

        next();
      });
    },
  };
}
