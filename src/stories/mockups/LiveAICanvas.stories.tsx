import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import ActiveMockup from "@/mockups/ActiveMockup";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Download, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloadStandaloneHtml, generateStandaloneHtml } from "@/mockups/html-exporter";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onReset?: () => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onReset?: () => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Live AI Canvas Render Error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Mockup Render Exception</AlertTitle>
            <AlertDescription className="mt-2 text-xs font-mono">
              {this.state.error?.message || "An unexpected error occurred while rendering the mockup."}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={this.reset} className="gap-2">
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Render
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const meta: Meta = {
  title: "01. AI Mockups/Live AI Canvas",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

function LiveCanvasWrapper() {
  const [renderKey, setRenderKey] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<string>(() => new Date().toLocaleTimeString());

  const contentRef = React.useRef<HTMLDivElement>(null);

  const reloadCanvas = React.useCallback(() => {
    setRenderKey((k) => k + 1);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  React.useEffect(() => {
    // 1. Listen to Storybook global addon channel
    const channel =
      (window as any).__STORYBOOK_ADDONS_CHANNEL__ ||
      (window.parent as any)?.__STORYBOOK_ADDONS_CHANNEL__;

    const handleUpdate = () => {
      reloadCanvas();
    };

    if (channel && typeof channel.on === "function") {
      channel.on("AI_MOCKUP_UPDATED", handleUpdate);
    }

    // 2. Storage event listener (cross-frame coordination)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "live_mockup_timestamp") {
        reloadCanvas();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. postMessage listener
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "AI_MOCKUP_UPDATED") {
        reloadCanvas();
      }
    };
    window.addEventListener("message", handleMessage);


    return () => {
      if (channel && typeof channel.off === "function") {
        channel.off("AI_MOCKUP_UPDATED", handleUpdate);
      }
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("message", handleMessage);
    };
  }, [reloadCanvas]);

  const handleDownloadHtml = () => {
    if (!contentRef.current) return;
    downloadStandaloneHtml(contentRef.current, "MockupPage");
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleCopyHtml = () => {
    if (!contentRef.current) return;
    const html = generateStandaloneHtml(contentRef.current, "MockupPage");
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sticky In-Canvas Header Toolbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-2.5 bg-background/80 backdrop-blur-md border-b border-border text-xs">
        <div className="flex items-center gap-2.5">
          <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-primary/40 bg-primary/10 text-primary font-medium">
            <Sparkles className="h-3 w-3 animate-pulse text-primary" />
            Live AI Canvas
          </Badge>
          {lastUpdated && (
            <span className="text-[11px] text-muted-foreground">
              Updated at {lastUpdated}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={reloadCanvas}
            className="h-8 gap-1.5 text-xs"
            title="Reload mockup"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyHtml}
            className="h-8 gap-1.5 text-xs"
            title="Copy standalone HTML to clipboard"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied HTML!" : "Copy HTML"}
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={handleDownloadHtml}
            className="h-8 gap-1.5 text-xs shadow-sm"
            title="Download fully styled standalone HTML file"
          >
            {downloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
            {downloaded ? "Downloaded!" : "Download HTML"}
          </Button>
        </div>
      </div>

      {/* Main Render Area */}
      <div ref={contentRef} className="flex-1 p-8">
        <ErrorBoundary key={renderKey} onReset={reloadCanvas}>
          <ActiveMockup />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => <LiveCanvasWrapper />,
};


