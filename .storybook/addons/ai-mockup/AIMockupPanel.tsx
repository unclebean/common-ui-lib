import * as React from "react";
import {
  Sparkles,
  Bot,
  User,
  ArrowUp,
  Settings2,
  Trash2,
  Copy,
  Check,
  Code2,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Bookmark,
} from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIMockupPanelProps {
  active?: boolean;
  api?: any;
  channel?: any;
}

export const AIMockupPanel: React.FC<AIMockupPanelProps> = ({ active, api, channel }) => {
  if (!active) return null;

  // Configuration state
  const [model, setModel] = React.useState<string>(() => {
    return localStorage.getItem("storybook_ai_model") || "gemini-3.6-flash";
  });

  // System Context & Chat state
  const [designSpec, setDesignSpec] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [statusMessage, setStatusMessage] = React.useState<string>("");
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [savedStatus, setSavedStatus] = React.useState<{ [key: number]: string }>({});

  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Load design spec on mount
  React.useEffect(() => {
    fetch("/api/ai/context")
      .then((res) => res.json())
      .then((data) => {
        if (data.designSpec) {
          setDesignSpec(data.designSpec);
        }
      })
      .catch(() => {});
  }, []);

  const handleModelChange = (val: string) => {
    setModel(val);
    localStorage.setItem("storybook_ai_model", val);
  };

  // Scroll chat to bottom
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sanitize code on client to guarantee no duplicate imports or UI-icon collisions
  const sanitizeClientCode = (rawCode: string): string => {
    let code = rawCode.trim();
    code = code.replace(/^(?:tsx|jsx|typescript|javascript)\s*\n/i, "");

    const uiReserved = new Set([
      "Badge", "Button", "Card", "Avatar", "Separator", "Input", "Label",
      "Select", "Switch", "Slider", "Progress", "Tabs", "Dialog", "Popover",
      "Tooltip", "Accordion", "Alert", "ScrollArea", "Grid", "GridItem",
      "Stack", "VStack", "HStack", "PageHeader", "PortfolioPerformanceChart",
      "AssetHoldingsTable", "Container"
    ]);

    code = code.replace(/import\s*\{([^}]+)\}\s*from\s*["']lucide-react["'];?/g, (match, p1) => {
      const validIcons = p1
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s && !uiReserved.has(s) && !/^(Io|Fa|Md|Ai|Bi|Bs|Fi|Ri|Ti|Go|Gi|Tb|Hi|Si)[A-Z]/.test(s));
      return validIcons.length > 0 ? `import { ${validIcons.join(", ")} } from "lucide-react";` : "";
    });

    return code;
  };

  // Extract code blocks from markdown
  const extractCode = (content: string): string | null => {
    const codeMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\s*([\s\S]*?)```/);
    if (codeMatch) {
      return sanitizeClientCode(codeMatch[1]);
    }

    const openMatch = content.match(/```(?:tsx|jsx|typescript|javascript)?\s*([\s\S]+)$/);
    if (openMatch && openMatch[1].includes("import ")) {
      return sanitizeClientCode(openMatch[1]);
    }

    if (content.includes("import ") && (content.includes("export default") || content.includes("function") || content.includes("<"))) {
      return sanitizeClientCode(content);
    }

    return null;
  };

  // Send Prompt to AI
  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: promptToSend };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStatusMessage(`Synthesizing UI with ${model}...`);

    try {
      const systemInstruction = `You are an expert React Design System Engineer specialized in @common/ui-lib.
Your task is to generate complete, aesthetic, 100% production-ready, fully responsive mockup pages in TypeScript (.tsx).

CRITICAL IMPORT RULES:
- NEVER import "Badge", "Grid", "Button", "Card", "Avatar", or other UI components from "lucide-react"! "Badge" is from "@/components/ui/badge", "Grid" is from "@/components/layout/grid". Only import pure visual iconography from "lucide-react".
- ALWAYS use named imports for components:
  import React, { useState } from "react";
  import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Shield, Activity, BarChart2, Layers, Search, Bell, Settings } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { Separator } from "@/components/ui/separator";
  import { PageHeader } from "@/components/layout/page-header";
  import { Grid, GridItem } from "@/components/layout/grid";
  import { Stack, VStack, HStack } from "@/components/layout/stack";
  import { PortfolioPerformanceChart } from "@/finance/portfolio-chart";
  import { AssetHoldingsTable, sampleHoldings } from "@/finance/asset-table";

MANDATORY RESPONSIVE WEB DESIGN RULES (CRITICAL):
1. Mobile-First & Fluid Layouts:
   - Root Container: ALWAYS use fluid width with responsive padding:
     <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 min-w-0">
   - NEVER use fixed pixel widths on root containers or cards (e.g., NO "w-[1800px]", NO "w-[1200px]", NO "w-[500px]").
   - The Storybook Canvas is viewed alongside the 460px AI sidebar, so available canvas width varies from 600px to 1200px. All designs MUST look clean on narrow viewports!

2. Multi-Column Grids MUST Stack on Smaller Screens:
   - 2-Column: <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
   - 3-Column / Trading Terminal: Use responsive grid classes:
     <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
       <div className="col-span-1 lg:col-span-3 min-w-0">...Orderbook...</div>
       <div className="col-span-1 lg:col-span-6 min-w-0">...Main Chart & Orders...</div>
       <div className="col-span-1 lg:col-span-3 min-w-0">...Order Execution Form...</div>
     </div>
   - KPI / Stat Cards (4 cards): <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

3. Flexible Headers, Toolbars & Button Strips:
   - ALWAYS add "flex-wrap" to header bars, filter strips, and button groups:
     <div className="flex flex-wrap items-center justify-between gap-3">
   - Ticker stat strips: <div className="flex flex-wrap items-center gap-4 sm:gap-6 overflow-x-auto">

4. Data Tables & Scroll Protection:
   - ALWAYS wrap <table>, orderbook listings, and transaction histories in an overflow container:
     <div className="overflow-x-auto w-full">
       <table className="w-full text-xs ...">...</table>
     </div>
   - In tables, hide less important columns on mobile using "hidden sm:table-cell" or "hidden md:table-cell".

5. Charts & Visualizations:
   - Wrap Recharts / PortfolioPerformanceChart in a responsive height container with "w-full min-w-0":
     <div className="w-full min-w-0 h-[280px] sm:h-[380px]">
       <PortfolioPerformanceChart />
     </div>

6. Component Guidelines:
   - Avatar: Always wrap in <Avatar><AvatarFallback>XYZ</AvatarFallback></Avatar>
   - AssetHoldingsTable: Always pass <AssetHoldingsTable data={sampleHoldings} />
   - Root export: Always export default function MockupPage() { ... }

First provide a brief, friendly 1-2 sentence explanation of the design choices made, then wrap the complete code inside a single \`\`\`tsx ... \`\`\` block.`;

      const fullSystemPrompt = designSpec
        ? `${systemInstruction}\n\nDESIGN SYSTEM TOKENS & SPECS (from design.md):\n${designSpec}`
        : systemInstruction;

      const payloadMessages = [
        { role: "system", content: fullSystemPrompt },
        ...newMessages,
      ];

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gemini",
          model,
          messages: payloadMessages,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const generatedContent = data.content || "";
      const generatedCode = extractCode(generatedContent);

      setMessages([...newMessages, { role: "assistant", content: generatedContent }]);
      setStatusMessage("");

      if (generatedCode) {
        await handleRenderToCanvas(generatedCode);
      }
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `⚠️ **Generation Error**: ${err.message}`,
        },
      ]);
      setStatusMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  // Instantly render mockup into the live Storybook Canvas (Session-isolated, zero disk writes)
  const handleRenderToCanvas = async (code: string) => {
    try {
      setStatusMessage("Mounting mockup into Storybook Canvas...");

      // 1. Emit code over Storybook Addon Channel to the preview iframe
      const ch = channel || (api && typeof api.getChannel === "function" ? api.getChannel() : null);
      if (ch && typeof ch.emit === "function") {
        ch.emit("AI_LIVE_CODE_UPDATE", { code });
      }

      // 2. Also dispatch postMessage to preview iframe
      try {
        const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: "AI_LIVE_CODE_UPDATE", code }, "*");
        }
      } catch {}

      // 3. Switch story if not currently on Live AI Canvas
      if (api && typeof api.getCurrentStoryData === "function") {
        const currentStory = api.getCurrentStoryData();
        if (currentStory?.id !== "01-ai-mockups-live-ai-canvas--default") {
          if (typeof api.selectStory === "function") {
            api.selectStory("01-ai-mockups-live-ai-canvas--default");
          }
        }
      }
    } catch (e) {
      console.error("Failed to render to Canvas:", e);
    } finally {
      setStatusMessage("");
    }
  };

  // Copy Code to Clipboard
  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Reset conversation and return Canvas to blank slate
  const handleReset = async () => {
    setMessages([]);
    const ch = channel || (api && typeof api.getChannel === "function" ? api.getChannel() : null);
    if (ch && typeof ch.emit === "function") {
      ch.emit("AI_LIVE_CODE_UPDATE", { code: null });
    }
    try {
      const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "AI_LIVE_CODE_UPDATE", code: null }, "*");
      }
    } catch {}
  };

  // Save directly into Storybook repository
  const handleSaveToStorybook = async (code: string, index: number) => {
    const rawTitle = prompt("Enter a name for this mockup page:", "CustomDashboard");
    if (!rawTitle) return;

    const cleanName = rawTitle.replace(/[^a-zA-Z0-9]/g, "");
    setSavedStatus({ ...savedStatus, [index]: "Saving..." });

    try {
      const res = await fetch("/api/ai/save-mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: cleanName,
          title: rawTitle,
          code,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save failed");
      }

      const data = await res.json();
      setSavedStatus({
        ...savedStatus,
        [index]: `✓ Saved as ${data.storyTitle}! Check Storybook sidebar.`,
      });
    } catch (e: any) {
      setSavedStatus({ ...savedStatus, [index]: `❌ Failed: ${e.message}` });
    }
  };

  const starterCards = [
    {
      icon: TrendingUp,
      title: "Crypto Spot Trading Terminal",
      desc: "Orderbook depth, live pair ticker, and limit order entry",
      prompt: "Create a modern, fully responsive Crypto Spot Trading Terminal with orderbook, live pair ticker, chart, and order entry form. Ensure it stacks gracefully on mobile and expands to a 3-column layout on desktop.",
    },
    {
      icon: PieChart,
      title: "Portfolio Rebalancing & Allocation",
      desc: "Asset allocation donut chart, target weights, and asset table",
      prompt: "Create a modern, fully responsive Portfolio Rebalancing and Asset Allocation dashboard with charts, holding weights, and rebalance buttons.",
    },
    {
      icon: ShieldCheck,
      title: "Institutional Security & KYC",
      desc: "Tier verification levels, security audit logs, and 2FA settings",
      prompt: "Create an Institutional Security and KYC verification center with responsive verification progress, identity forms, and audit logs.",
    },
    {
      icon: Zap,
      title: "Automated DCA Investment Strategy",
      desc: "Recurring schedule cards, execution history, and P&L metrics",
      prompt: "Create an Automated DCA (Dollar Cost Averaging) strategy setup screen with responsive recurring buy intervals, funding source, and profit projection.",
    },
  ];

  const modelOptions = [
    { value: "gemini-3.6-flash", label: "Gemini 3.6 Flash (Default, Ultra Fast)" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Deep Reasoning)" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0f19] text-slate-100 font-sans text-[13px] select-text overflow-hidden antialiased">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#0d1322]/80 backdrop-blur-md border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm tracking-tight">
                AI Mockup Studio
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Gemini
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Model Selector Dropdown */}
          <div className="relative">
            <select
              value={model}
              onChange={(e) => handleModelChange(e.target.value)}
              className="bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-indigo-500 shadow-inner cursor-pointer"
            >
              {modelOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear / Reset Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-rose-400 hover:border-rose-900/50 transition-all"
            title="Reset Canvas & Start New Mockup"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto py-8">
            {/* Hero Glow Icon */}
            <div className="relative mb-5">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-30 blur-lg animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2 tracking-tight text-center">
              What shall we design today?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm text-center leading-relaxed max-w-lg mb-8">
              Describe any financial screen, trading terminal, or dashboard. The AI will synthesize components from your design system and render them live in the Canvas above.
            </p>

            {/* Prompt Starter Cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              {starterCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(card.prompt)}
                    className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/40 text-left transition-all duration-200 hover:-translate-y-0.5 group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-200 text-xs group-hover:text-white transition-colors">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pl-9">
                      {card.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => {
            const code = msg.role === "assistant" ? extractCode(msg.content) : null;
            const textWithoutCode = code
              ? msg.content.replace(/```(?:tsx|jsx|typescript|javascript)?\s*[\s\S]*?```/, "").trim()
              : msg.content;

            return (
              <div
                key={index}
                className={`flex gap-3.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm shadow-md font-medium"
                      : "bg-[#111726]/90 border border-slate-800/80 text-slate-200 rounded-tl-sm shadow-sm"
                  }`}
                >
                  {textWithoutCode ? (
                    <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-[13px]">
                      {textWithoutCode}
                    </div>
                  ) : (
                    <div className="leading-relaxed text-slate-300 text-xs sm:text-[13px]">
                      ✨ I have created and updated the requested mockup page. It is rendered live in the Canvas above.
                    </div>
                  )}

                  {/* Clean AI Mockup Status Card */}
                  {code && (
                    <div className="mt-3 p-3.5 rounded-xl bg-[#0b0f19] border border-slate-800/90 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            Rendered Live in Canvas
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveToStorybook(code, index)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition shadow-sm flex items-center gap-1.5"
                            title="Permanently register this mockup into Storybook stories"
                          >
                            <Bookmark className="w-3 h-3" />
                            Save as Story
                          </button>
                          <button
                            onClick={() => handleCopy(code, index)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition flex items-center gap-1.5"
                            title="Copy TSX code to clipboard"
                          >
                            {copiedIndex === index ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy TSX</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {savedStatus[index] && (
                        <div className="px-3 py-1.5 rounded-lg bg-indigo-950/60 text-indigo-300 text-[11px] border border-indigo-800/60 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{savedStatus[index]}</span>
                        </div>
                      )}

                      {/* Optional Collapsed Code Viewer */}
                      <details className="text-[11px] text-slate-400 group pt-1 border-t border-slate-800/60">
                        <summary className="cursor-pointer hover:text-slate-200 select-none text-[11px] font-mono flex items-center gap-1">
                          <span>▸ View TSX Source</span>
                        </summary>
                        <pre className="mt-2 p-3 rounded-lg bg-[#080b12] border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-56 select-text">
                          <code>{code}</code>
                        </pre>
                      </details>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 max-w-md">
            <div className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin shrink-0" />
            <span className="font-medium text-slate-300">
              {statusMessage || "Synthesizing UI mockup..."}
            </span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Modern Floating Chat Input Box (ChatGPT / v0 style) */}
      <div className="p-4 bg-[#0d1322]/80 backdrop-blur-md border-t border-slate-800/80 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex flex-col rounded-2xl bg-[#111726] border border-slate-800/90 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-lg transition-all">
            <textarea
              ref={textareaRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask AI to design a screen... (e.g. 'Create a high-frequency trading terminal with depth chart')"
              className="w-full bg-transparent px-4 pt-3.5 pb-2 text-slate-100 placeholder:text-slate-500 text-xs sm:text-[13px] focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between px-4 pb-3 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-400 font-mono">
                  Enter
                </kbd>
                <span>to send,</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-400 font-mono">
                  Shift+Enter
                </kbd>
                <span>for newline</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                    input.trim() && !isLoading
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 scale-100"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
