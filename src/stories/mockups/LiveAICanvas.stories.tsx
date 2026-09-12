import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { transform } from "sucrase";
import ActiveMockup from "@/mockups/ActiveMockup";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  RefreshCw,
  Download,
  Copy,
  Check,
  Sparkles,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { downloadStandaloneHtml, generateStandaloneHtml } from "@/mockups/html-exporter";

// All UI and Layout components available for dynamic mockups
import * as LucideIcons from "lucide-react";
import { Button as CompButton } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge as CompBadge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Grid, GridItem } from "@/components/layout/grid";
import { Stack, VStack, HStack } from "@/components/layout/stack";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/layout/container";
import {
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
  portfolioHistoryData,
  allocationData,
} from "@/finance/portfolio-chart";
import { AssetHoldingsTable, sampleHoldings } from "@/finance/asset-table";
import { CandlestickChart, sampleCandleData } from "@/finance/candlestick-chart";

function createSafeModule(target: Record<string, any>, defaultComponent?: any) {
  const fallback =
    defaultComponent ||
    target.default ||
    Object.values(target).find((v) => typeof v === "function") ||
    ((props: any) => React.createElement("div", props, props?.children));

  return new Proxy(target, {
    get: (t, prop: string | symbol) => {
      if (prop === "__esModule") return true;
      if (prop === "default") return fallback;
      if (typeof prop === "string") {
        if (prop in t && t[prop] !== undefined) {
          return t[prop];
        }
        // Return a safe stub component instead of undefined so React never throws
        // "Element type is invalid: expected a string or class/function but got: undefined"
        const Stub = (props: any) => React.createElement("div", props, props?.children);
        Stub.displayName = `SafeStub(${prop})`;
        return Stub;
      }
      return (t as any)[prop];
    },
  });
}

function createModuleResolver() {
  const fallbackIcon = (props: any) =>
    React.createElement("svg", {
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...props,
    });

  const iconProxy = new Proxy(LucideIcons, {
    get: (target: any, prop: string | symbol) => {
      if (prop === "__esModule") return true;
      if (prop === "default") return target;
      if (typeof prop === "string") {
        if (prop in target && target[prop]) return target[prop];
        const singular = prop.replace(/s([A-Z])/, "$1");
        if (singular in target && target[singular]) return target[singular];
        return target.Sparkles || fallbackIcon;
      }
      return fallbackIcon;
    },
  });

  return (moduleName: string) => {
    const clean = moduleName.toLowerCase().replace(/['"]/g, "");
    if (clean === "react" || clean.startsWith("react/")) {
      return createSafeModule({ ...React, default: React });
    }
    if (clean.includes("lucide-react") || clean.includes("lucide")) {
      return iconProxy;
    }
    if (clean.includes("button")) {
      return createSafeModule({ Button: CompButton, default: CompButton });
    }
    if (clean.includes("card")) {
      return createSafeModule({
        Card,
        CardHeader,
        CardTitle,
        CardDescription,
        CardContent,
        CardFooter,
        default: Card,
      });
    }
    if (clean.includes("badge")) {
      return createSafeModule({ Badge: CompBadge, default: CompBadge });
    }
    if (clean.includes("avatar")) {
      return createSafeModule({ Avatar, AvatarImage, AvatarFallback, default: Avatar });
    }
    if (clean.includes("separator")) {
      return createSafeModule({ Separator, default: Separator });
    }
    if (clean.includes("alert")) {
      return createSafeModule({ Alert, AlertTitle, AlertDescription, default: Alert });
    }
    if (clean.includes("input")) {
      return createSafeModule({ Input, default: Input });
    }
    if (clean.includes("label")) {
      return createSafeModule({ Label, default: Label });
    }
    if (clean.includes("progress")) {
      return createSafeModule({ Progress, default: Progress });
    }
    if (clean.includes("switch")) {
      return createSafeModule({ Switch, default: Switch });
    }
    if (clean.includes("slider")) {
      return createSafeModule({ Slider, default: Slider });
    }
    if (clean.includes("tabs")) {
      return createSafeModule({ Tabs, TabsList, TabsTrigger, TabsContent, default: Tabs });
    }
    if (clean.includes("dialog")) {
      return createSafeModule({
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
        default: Dialog,
      });
    }
    if (clean.includes("popover")) {
      return createSafeModule({ Popover, PopoverTrigger, PopoverContent, default: Popover });
    }
    if (clean.includes("tooltip")) {
      return createSafeModule({
        Tooltip,
        TooltipTrigger,
        TooltipContent,
        TooltipProvider,
        default: Tooltip,
      });
    }
    if (clean.includes("accordion")) {
      return createSafeModule({
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
        default: Accordion,
      });
    }
    if (clean.includes("scroll-area")) {
      return createSafeModule({ ScrollArea, default: ScrollArea });
    }
    if (clean.includes("select")) {
      return createSafeModule({
        Select,
        SelectTrigger,
        SelectValue,
        SelectContent,
        SelectItem,
        default: Select,
      });
    }
    if (clean.includes("table") && !clean.includes("asset-table")) {
      return createSafeModule({
        Table,
        TableHeader,
        TableBody,
        TableFooter,
        TableHead,
        TableRow,
        TableCell,
        TableCaption,
        default: Table,
      });
    }
    if (clean.includes("dropdown")) {
      return createSafeModule({
        DropdownMenu,
        DropdownMenuTrigger,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuCheckboxItem,
        DropdownMenuRadioItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuShortcut,
        DropdownMenuGroup,
        DropdownMenuPortal,
        DropdownMenuSub,
        DropdownMenuSubContent,
        DropdownMenuSubTrigger,
        DropdownMenuRadioGroup,
        default: DropdownMenu,
      });
    }
    if (clean.includes("checkbox")) {
      return createSafeModule({ Checkbox, default: Checkbox });
    }
    if (clean.includes("radio")) {
      return createSafeModule({ RadioGroup, RadioGroupItem, default: RadioGroup });
    }
    if (clean.includes("textarea")) {
      return createSafeModule({ Textarea, default: Textarea });
    }
    if (clean.includes("calendar")) {
      return createSafeModule({ Calendar, default: Calendar });
    }
    if (clean.includes("chart") && !clean.includes("portfolio") && !clean.includes("candlestick")) {
      return createSafeModule({
        ChartContainer,
        ChartTooltip,
        ChartTooltipContent,
        ChartLegend,
        ChartLegendContent,
        default: ChartContainer,
      });
    }
    if (clean.includes("grid")) {
      return createSafeModule({ Grid, GridItem, default: Grid });
    }
    if (clean.includes("stack")) {
      return createSafeModule({ Stack, VStack, HStack, default: Stack });
    }
    if (clean.includes("page-header")) {
      return createSafeModule({ PageHeader, default: PageHeader });
    }
    if (clean.includes("container")) {
      return createSafeModule({ Container, default: Container });
    }
    if (clean.includes("portfolio-chart")) {
      return createSafeModule({
        PortfolioPerformanceChart,
        AssetAllocationDonutChart,
        portfolioHistoryData,
        allocationData,
        default: PortfolioPerformanceChart,
      });
    }
    if (clean.includes("asset-table")) {
      return createSafeModule({
        AssetHoldingsTable,
        sampleHoldings,
        default: AssetHoldingsTable,
      });
    }
    if (
      clean.includes("candlestick") ||
      clean.includes("candle") ||
      clean.includes("tradingview") ||
      clean.includes("trading-chart")
    ) {
      return createSafeModule({
        CandlestickChart,
        sampleCandleData,
        default: CandlestickChart,
      });
    }

    // Safe fallback stub for any other unexpected module
    return new Proxy(
      {},
      {
        get: (_, prop) => {
          if (prop === "__esModule") return true;
          const Stub = (props: any) => React.createElement("div", props, props?.children);
          Stub.displayName = `SafeStub(${String(prop)})`;
          return Stub;
        },
      }
    );
  };
}

function sanitizeResponsiveGridClasses(raw: string): string {
  let res = raw;
  // 1. Revert any split 3-pane classes that caused col-span-6 to orphan on row 1
  res = res.replace(/\b(?:col-span-12\s+)?md:col-span-6\s+xl:col-span-3\b/g, "col-span-12 lg:col-span-3");
  res = res.replace(/\b(?:col-span-12\s+)?md:col-span-12\s+xl:col-span-6\b/g, "col-span-12 lg:col-span-6");

  // 2. In 12-col layouts, convert col-span-1 base to col-span-12 so mobile/tablet stacks full width instead of 8.33%
  res = res.replace(/\bcol-span-1\s+((?:sm|md|lg|xl):col-span-)/g, "col-span-12 $1");

  // 3. Promote 2-pane (8+4, 7+5) layouts to md: so they trigger side-by-side on tablet/canvas
  res = res.replace(/\bcol-span-12\s+lg:col-span-8\b/g, "col-span-12 md:col-span-8");
  res = res.replace(/\bcol-span-12\s+lg:col-span-4\b/g, "col-span-12 md:col-span-4");
  res = res.replace(/\bcol-span-12\s+lg:col-span-7\b/g, "col-span-12 md:col-span-7");
  res = res.replace(/\bcol-span-12\s+lg:col-span-5\b/g, "col-span-12 md:col-span-5");
  res = res.replace(/(?<!md:col-span-\d+\s+)\blg:col-span-8\b/g, "md:col-span-8");
  res = res.replace(/(?<!md:col-span-\d+\s+)\blg:col-span-4\b/g, "md:col-span-4");
  res = res.replace(/(?<!md:col-span-\d+\s+)\blg:col-span-7\b/g, "md:col-span-7");
  res = res.replace(/(?<!md:col-span-\d+\s+)\blg:col-span-5\b/g, "md:col-span-5");

  return res;
}

const UI_COMPONENT_IMPORTS: Record<string, string> = {
  Separator: 'import { Separator } from "@/components/ui/separator";',
  Button: 'import { Button } from "@/components/ui/button";',
  Badge: 'import { Badge } from "@/components/ui/badge";',
  Card: 'import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";',
  Avatar: 'import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";',
  Input: 'import { Input } from "@/components/ui/input";',
  Label: 'import { Label } from "@/components/ui/label";',
  Progress: 'import { Progress } from "@/components/ui/progress";',
  Switch: 'import { Switch } from "@/components/ui/switch";',
  Slider: 'import { Slider } from "@/components/ui/slider";',
  Tabs: 'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";',
  Dialog: 'import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";',
  Popover: 'import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";',
  Tooltip: 'import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";',
  Accordion: 'import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";',
  Alert: 'import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";',
  ScrollArea: 'import { ScrollArea } from "@/components/ui/scroll-area";',
  Select: 'import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";',
  Table: 'import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table";',
  DropdownMenu: 'import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";',
  Checkbox: 'import { Checkbox } from "@/components/ui/checkbox";',
  RadioGroup: 'import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";',
  Textarea: 'import { Textarea } from "@/components/ui/textarea";',
  Calendar: 'import { Calendar } from "@/components/ui/calendar";',
  Grid: 'import { Grid, GridItem } from "@/components/layout/grid";',
  Stack: 'import { Stack, VStack, HStack } from "@/components/layout/stack";',
  PageHeader: 'import { PageHeader } from "@/components/layout/page-header";',
  Container: 'import { Container } from "@/components/layout/container";',
  PortfolioPerformanceChart: 'import { PortfolioPerformanceChart } from "@/finance/portfolio-chart";',
  AssetAllocationDonutChart: 'import { AssetAllocationDonutChart } from "@/finance/portfolio-chart";',
  AssetHoldingsTable: 'import { AssetHoldingsTable, sampleHoldings } from "@/finance/asset-table";',
  CandlestickChart: 'import { CandlestickChart, sampleCandleData } from "@/finance/candlestick-chart";',
};

const scopeComponents: Record<string, any> = {
  Button: CompButton,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge: CompBadge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Input,
  Label,
  Progress,
  Switch,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Alert,
  AlertTitle,
  AlertDescription,
  ScrollArea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Textarea,
  Calendar,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  Grid,
  GridItem,
  Stack,
  VStack,
  HStack,
  PageHeader,
  Container,
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
  portfolioHistoryData,
  allocationData,
  AssetHoldingsTable,
  sampleHoldings,
  CandlestickChart,
  sampleCandleData,
};

function compileMockup(code: string): React.ComponentType | null {
  try {
    // Strip import.meta statements as new Function executes in a non-module context
    let cleanCode = code
      .replace(/if\s*\(\s*import\.meta(?:\.[A-Za-z0-9_$]+)*\s*\)\s*\{[\s\S]*?\}/g, "")
      .replace(/import\.meta(?:\.[A-Za-z0-9_$]+)*/g, "undefined");

    cleanCode = sanitizeResponsiveGridClasses(cleanCode);

    // Auto-inject missing UI component imports if JSX uses them but code lacks import
    const missingImports: string[] = [];
    for (const [tag, importStmt] of Object.entries(UI_COMPONENT_IMPORTS)) {
      const tagRegex = new RegExp(`<${tag}\\b`);
      if (tagRegex.test(cleanCode)) {
        const alreadyImported =
          new RegExp(`import\\s*\\{[^}]*\\b${tag}\\b[^}]*\\}`).test(cleanCode) ||
          new RegExp(`import\\s+${tag}\\b`).test(cleanCode);
        if (!alreadyImported) {
          missingImports.push(importStmt);
        }
      }
    }
    if (missingImports.length > 0) {
      cleanCode = missingImports.join("\n") + "\n" + cleanCode;
    }

    const compiled = transform(cleanCode, {
      transforms: ["jsx", "typescript", "imports"],
      jsxRuntime: "classic",
    }).code;

    const resolveModule = createModuleResolver();
    const exports: any = {};
    const scopeKeys = Object.keys(scopeComponents);
    const scopeValues = Object.values(scopeComponents);
    const runner = new Function("require", "exports", "React", ...scopeKeys, compiled);
    runner(resolveModule, exports, React, ...scopeValues);

    const Component =
      exports.default ||
      exports.MockupPage ||
      Object.values(exports).find((v) => typeof v === "function");

    if (!Component) {
      throw new Error("No default export found in mockup code.");
    }
    return Component as React.ComponentType;
  } catch (err: any) {
    console.error("Transpilation failed:", err);
    throw err;
  }
}

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
  // Pure in-memory session state: fresh load / refresh always begins at null (Blank Canvas)
  const [liveCode, setLiveCode] = React.useState<string | null>(null);
  const [renderKey, setRenderKey] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const [compileError, setCompileError] = React.useState<string | null>(null);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const reloadCanvas = React.useCallback(() => {
    setRenderKey((k) => k + 1);
  }, []);

  const clearCanvas = React.useCallback(() => {
    setLiveCode(null);
    setCompileError(null);
    setRenderKey((k) => k + 1);
  }, []);

  React.useEffect(() => {
    const channel =
      (window as any).__STORYBOOK_ADDONS_CHANNEL__ ||
      (window.parent as any)?.__STORYBOOK_ADDONS_CHANNEL__;

    const handleLiveCode = (data: { code: string | null }) => {
      setLiveCode(data?.code || null);
      setCompileError(null);
      setRenderKey((k) => k + 1);
    };

    if (channel && typeof channel.on === "function") {
      channel.on("AI_LIVE_CODE_UPDATE", handleLiveCode);
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "AI_LIVE_CODE_UPDATE") {
        handleLiveCode(e.data);
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      if (channel && typeof channel.off === "function") {
        channel.off("AI_LIVE_CODE_UPDATE", handleLiveCode);
      }
      window.removeEventListener("message", handleMessage);
    };
  }, []);

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

  // Compile component if liveCode is present
  const DynamicComponent = React.useMemo(() => {
    if (!liveCode) return null;
    try {
      const comp = compileMockup(liveCode);
      setCompileError(null);
      return comp;
    } catch (err: any) {
      setCompileError(err.message || String(err));
      return null;
    }
  }, [liveCode, renderKey]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sticky In-Canvas Header Toolbar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 py-2 bg-background/80 backdrop-blur-md border-b border-border text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="gap-1.5 py-1 px-2.5 border-primary/40 bg-primary/10 text-primary font-medium"
          >
            <Sparkles className="h-3 w-3 animate-pulse text-primary" />
            Live AI Canvas
          </Badge>
          {liveCode ? (
            <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              Session Mockup Active
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              Blank Canvas (Ready)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {liveCode && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearCanvas}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-rose-500"
              title="Clear current mockup and restore blank canvas"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Canvas
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={reloadCanvas}
            className="h-8 gap-1.5 text-xs"
            title="Reload canvas"
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
      <div ref={contentRef} className="flex-1 p-2 sm:p-4 md:p-6 w-full min-w-0 overflow-x-hidden">
        {compileError ? (
          <div className="p-8 max-w-xl mx-auto space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Transpilation Error</AlertTitle>
              <AlertDescription className="mt-2 text-xs font-mono">
                {compileError}
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearCanvas} className="gap-2">
                Restore Blank Canvas
              </Button>
            </div>
          </div>
        ) : (
          <ErrorBoundary key={renderKey} onReset={reloadCanvas}>
            {DynamicComponent ? <DynamicComponent /> : <ActiveMockup />}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export const Default: StoryObj = {
  render: () => <LiveCanvasWrapper />,
};
