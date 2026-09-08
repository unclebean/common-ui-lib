# Common UI Library Context & Design System Reference (`CONTEXT.md`)

> **Single Source of Truth** for AI assistants, agents, and developers working on `@common/ui-lib`.
> **Do not scan the codebase.** Everything needed to design, compose, generate, and review UI components and mockups is documented here.

---

## 1. Quick Technical Identity

- **Library**: `@common/ui-lib`
- **Framework**: React 18 + TypeScript + Vite 5 + Tailwind CSS 3
- **Component Foundations**: Radix UI Primitives + Lucide React (`lucide-react`)
- **Financial Visualization**: TradingView Lightweight Charts (`lightweight-charts`) + Recharts
- **Path Aliases**:
  - `@/components/ui/*` (Core design system atoms & primitives)
  - `@/components/layout/*` (Responsive layout system & containers)
  - `@/components/brand/*` (Brand assets & logo)
  - `@/finance/*` (Financial charts, candlestick charts, portfolio tables)
  - `@/mockups/*` (AI-generated mockup screens and active canvas)
  - `@/tokens/*` (Design tokens & CSS variables)
  - `@/lib/utils` (`cn()` helper for clsx + tailwind-merge)

---

## 2. Design Tokens & Color Palette

All styling relies on semantic CSS variables mapped to Tailwind utility classes. **Never use hardcoded hex values in layout or component markup.**

### 2.1 Core Semantic Tokens

| Token Name | Tailwind Classes | Purpose |
|------------|------------------|---------|
| **Background** | `bg-background text-foreground` | App canvas background and default body text |
| **Card / Surface** | `bg-card text-card-foreground border-border` | Elevated surface containers, dashboard panels |
| **Primary** | `bg-primary text-primary-foreground` | Main CTA buttons, active states, key accents |
| **Secondary** | `bg-secondary text-secondary-foreground` | Sub-actions, auxiliary pills, secondary tabs |
| **Muted** | `bg-muted text-muted-foreground` | Subtle card headers, disabled states, helper captions |
| **Accent** | `bg-accent text-accent-foreground` | Hover highlights, active list row selection |
| **Destructive** | `bg-destructive text-destructive-foreground` | Danger alerts, sell orders, critical warnings |
| **Border** | `border-border` | Subtle dividing lines, container boundaries |
| **Input** | `border-input bg-background` | Form input boundaries and backgrounds |
| **Ring** | `ring-ring` | Focus state outlines |

### 2.2 Financial & Trading Tokens

| Concept | Classes | Example Use Case |
|---------|---------|------------------|
| **Bullish / Profit** | `text-emerald-500 bg-emerald-500/10 border-emerald-500/30` | Upward price change (`+5.42%`), buy badges |
| **Bearish / Loss** | `text-rose-500 bg-rose-500/10 border-rose-500/30` | Downward price change (`-3.18%`), sell badges |
| **Chart Palette** | `hsl(var(--chart-1))` to `hsl(var(--chart-5))` | Recharts series, multi-asset allocation slices |

### 2.3 Typography & Metrics

- **Body & Headings**: Font sans (`Inter`, system-ui).
- **Financial Figures & Tickers**: Always apply `font-mono tracking-tight` for prices (e.g. `$62,490.00`), percentages, balances, and dates to ensure columnar alignment.
- **Radii**:
  - `rounded-md`: Default buttons, inputs, pills
  - `rounded-lg` / `rounded-xl`: Cards, modals, dialog surfaces
  - `rounded-full`: Avatars, status badges, indicator dots

---

## 3. Responsive Layout & 12-Column Grid Rules

> [!IMPORTANT]
> **Strict Rules for Clean Responsive Layouts:**
> 1. **Storybook Canvas Viewport (~800px-1000px)**: Because Storybook opens a 460px AI sidebar on laptops, the active preview canvas is between 800px and 1000px. **Always use `md:` (768px) as the primary multi-column breakpoint**; do not rely solely on `lg:` (1024px) for 2-column layouts.
> 2. **Base Mobile Class MUST be `col-span-12`**: In a 12-column grid, **NEVER use `col-span-1` as the base mobile span**! `col-span-1` takes only 8.33% of screen width and squashes items into illegible 80px slivers. Always use `col-span-12` so items stack full width on small screens.
> 3. **The 12-Column Sum Rule**: In any row, child column spans MUST sum to 12 across the row (`8 + 4`, `6 + 6`, `4 + 4 + 4`, `3 + 6 + 3`). Never leave empty columns.
> 4. **The `min-w-0` Rule**: Every grid item or flex child containing tables, candlestick charts, or long text MUST include `min-w-0` to prevent horizontal container blowouts.
> 5. **No Double Wrapping**: `<CandlestickChart>`, `<PortfolioPerformanceChart>`, and `<AssetHoldingsTable>` are already self-contained Card components with headers, borders, and padding. NEVER wrap them inside an outer `<Card>` or `<CardContent>`.

### 3.1 Layout Primitives

```tsx
import { Container } from "@/components/layout/container";
// Props: size?: "sm" | "md" | "lg" | "xl" | "full", className?: string

import { Grid, GridItem } from "@/components/layout/grid";
// Grid Props: cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 (default 3), gap?: "none" | "sm" | "md" | "lg" | "xl", className?: string
// GridItem Props: colSpan?: 1..12, span?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }, rowSpan?: 1..4

import { Stack, VStack, HStack } from "@/components/layout/stack";
// Props: spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl", align?: "start" | "center" | "end" | "stretch", justify?: ...

import { PageHeader } from "@/components/layout/page-header";
// Props: title: string, description?: string, action?: React.ReactNode, breadcrumbs?: { label: string; href?: string }[]

import { DashboardShell, SidebarNav } from "@/components/layout/dashboard-shell";
```

### 3.2 Canonical Dashboard Grid Patterns

#### A. 2-Pane Layout (Main Content + Sidebar)
```tsx
<div className="grid grid-cols-12 gap-4 w-full">
  {/* Left Main Panel: Chart + Table (8 cols on desktop) */}
  <div className="col-span-12 md:col-span-8 min-w-0 space-y-6">
    <CandlestickChart symbol="BTC / USDT" height={400} />
    <AssetHoldingsTable data={sampleHoldings} />
  </div>

  {/* Right Sidebar: Order Form & KPIs (4 cols on desktop) */}
  <div className="col-span-12 md:col-span-4 min-w-0 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Order Ticket</CardTitle>
      </CardHeader>
      <CardContent>{/* Buy/Sell form controls */}</CardContent>
    </Card>
  </div>
</div>
```

#### B. 3-Pane Trading Terminal (Orderbook + Chart + Execution Ticket)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
  {/* Left: Order Book (3 cols on desktop, full width on mobile/tablet) */}
  <div className="col-span-1 lg:col-span-3 min-w-0">
    <Card>
      <CardHeader><CardTitle>Order Book</CardTitle></CardHeader>
      <CardContent>{/* Order book table */}</CardContent>
    </Card>
  </div>

  {/* Center: Candlestick Chart (6 cols on desktop, full width on mobile/tablet) */}
  <div className="col-span-1 lg:col-span-6 min-w-0">
    <CandlestickChart symbol="BTC / USDT" height={400} />
  </div>

  {/* Right: Execution Ticket (3 cols on desktop, full width on mobile/tablet) */}
  <div className="col-span-1 lg:col-span-3 min-w-0">
    <Card>
      <CardHeader><CardTitle>Trade Execution</CardTitle></CardHeader>
      <CardContent>{/* Buy/Sell forms */}</CardContent>
    </Card>
  </div>
</div>
```
> On desktop (`lg:` 1024px+), all three panes sit side-by-side (3 + 6 + 3 = 12).
> On mobile/tablet (< 1024px), each pane cleanly stacks full width with zero empty space.

---

## 4. UI Component Catalog & Exact Imports

All components use named exports and `@/` paths:

### 4.1 Actions & Buttons

```tsx
import { Button } from "@/components/ui/button";
// Props:
// - variant?: "default" | "destructive" | "outline" | "secondary" | "subtle" | "ghost" | "link"
// - size?: "default" | "sm" | "lg" | "icon" | "iconCircle"
// - loading?: boolean
```

### 4.2 Badges & Status

```tsx
import { Badge } from "@/components/ui/badge";
// Props:
// - variant?: "default" | "secondary" | "destructive" | "outline" | "bullish" | "bearish"
```

### 4.3 Surface Cards

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
```

### 4.4 Form & Input Controls

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
```

### 4.5 Navigation, Tabs & Overlays

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
```

### 4.6 Brand Assets

```tsx
import { Logo } from "@/components/brand/logo";
// Props: variant?: "full" | "icon", size?: "sm" | "md" | "lg", brandName?: string
```

---

## 5. Financial & Trading Modules

### 5.1 TradingView Candlestick Chart (`CandlestickChart`)

Interactive professional financial chart powered by TradingView Lightweight Charts with dynamic OHLC crosshairs, timeframe selector, volume histogram, and auto dark/light theme switching.

```tsx
import { CandlestickChart, sampleCandleData, generateSampleCandles } from "@/finance/candlestick-chart";

// Props:
// - data?: CandleData[] (default: 90 days realistic BTC sample data)
// - symbol?: string (e.g. "BTC / USDT", "NVDA", "ETH / USD")
// - subtitle?: string (e.g. "Bitcoin / TetherUS Spot")
// - interval?: string (e.g. "15m", "1H", "1D")
// - intervals?: string[] (default: ["1m", "5m", "15m", "1H", "4H", "1D"])
// - onIntervalChange?: (interval: string) => void
// - showVolume?: boolean (default: true)
// - height?: number (default: 360)
// - bullishColor?: string (default: "#10b981")
// - bearishColor?: string (default: "#ef4444")
// - className?: string
```

### 5.2 Portfolio Performance & Allocation Charts

```tsx
import {
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
} from "@/finance/portfolio-chart";
// PortfolioPerformanceChart Props: data?: any[], timeframe?: string, height?: number, title?: string
// AssetAllocationDonutChart Props: data?: any[], height?: number, title?: string
```

### 5.3 Asset Holdings Table

```tsx
import { AssetHoldingsTable, sampleHoldings, type AssetHolding } from "@/finance/asset-table";
// Props: data?: AssetHolding[] (default: sampleHoldings), title?: string, description?: string
```

---

## 6. Rules for AI Code Synthesis & Sanitization

When generating or editing mockups:

1. **Named Imports Only**:
   - Always `import { Button } from "@/components/ui/button"`, never `import Button from ...`.
2. **Lucide Icons**:
   - Only import icons that actually exist in `lucide-react` (e.g. `TrendingUp`, `TrendingDown`, `ArrowUpRight`, `Wallet`, `Activity`, `Shield`, `Search`).
   - Never import Lucide icons for UI components (`Badge`, `Button`, `Card`, etc.).
3. **Always Export Default**:
   - The root component must be exported as `export default function MockupPage() { ... }`.
4. **HMR Safe**:
   - Include `if (import.meta.hot) { import.meta.hot.accept(); }` at the bottom.
5. **No Network-reliant External Dependencies**:
   - Use only the components and utilities provided in `@common/ui-lib`.

---

## 7. Figma & Token Sync Workflows

- `npm run sync:figma`: Synchronizes design tokens from Figma via REST API.
- `npm run diff:figma`: Compares local component markup and tokens with Figma definitions.
- `npm run inspect:comp`: Inspects a specific Figma component node and extracts styles.
