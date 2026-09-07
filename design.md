# Common UI Design System & Component Guidelines (`design.md`)

This document serves as the foundational design system rulebook and code-generation reference for **`@common/ui-lib`**. All AI agents and developers generating mockup pages must adhere strictly to these principles, token names, and component import conventions.

---

## 1. Design Principles & Tokens

The library is built upon **Radix UI Primitives** styled with **Tailwind CSS** using dynamic CSS variables (Design Tokens) synchronized with Figma.

### 1.1 Color Tokens
Always use semantic token classes or CSS variables instead of hardcoded hex values:

| Token Name | Tailwind Class | CSS Custom Variable | Purpose |
|------------|----------------|---------------------|---------|
| Primary | `bg-primary text-primary-foreground` | `--primary` | Main call-to-action buttons, active navigation states |
| Secondary | `bg-secondary text-secondary-foreground` | `--secondary` | Auxiliary actions, sub-navigation tabs |
| Muted | `bg-muted text-muted-foreground` | `--muted` | Subdued backgrounds, helper labels, disabled states |
| Accent | `bg-accent text-accent-foreground` | `--accent` | Hover states, list item selections |
| Destructive | `bg-destructive text-destructive-foreground`| `--destructive` | Error messages, cancel orders, critical warnings |
| Border | `border-border` | `--border` | Subtle dividing lines, container boundaries |
| Card | `bg-card text-card-foreground` | `--card` | Elevated surface containers |
| Bullish | `text-emerald-600 dark:text-emerald-400` / `badge-bullish` | `--bullish` | Financial profit, upward percentage gain |
| Bearish | `text-rose-600 dark:text-rose-400` / `badge-bearish` | `--bearish` | Financial loss, downward percentage drop |

### 1.2 Chart Color Palette
When displaying Recharts or custom metrics, use the semantic chart variables:
- `--chart-1`: Portfolio / Top Asset Primary Curve (Indigo / Blue)
- `--chart-2`: Benchmark Index / Fixed Income (Cyan / Teal)
- `--chart-3`: Global Equities / ETFs (Amber / Gold)
- `--chart-4`: Crypto & High-Beta Assets (Purple)
- `--chart-5`: Commodities & Real Assets (Orange)

### 1.3 Radii & Elevation
- Default radius: `rounded-md` (`calc(var(--radius) - 2px)`)
- Card & modal radius: `rounded-lg` (`var(--radius)`)
- Pill & badges: `rounded-full`

---

## 2. Component Inventory & Import Reference

When generating React mockups, import components using `@/components/...` or `@/finance/...`:

### 2.1 Brand Identity
```tsx
import { Logo } from "@/components/brand/logo";
// <Logo variant="full" | "icon" size="sm" | "md" | "lg" brandName="..." />
```

### 2.2 Layout Primitives
```tsx
import { Container } from "@/components/layout/container";
import { Stack, VStack, HStack } from "@/components/layout/stack";
import { Grid, GridItem } from "@/components/layout/grid";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardShell, SidebarNav } from "@/components/layout/dashboard-shell";
```

### 2.3 Core Foundation Primitives
```tsx
import { Button } from "@/components/ui/button";
// variants: "default" | "destructive" | "outline" | "secondary" | "subtle" | "ghost" | "link"
// sizes: "default" | "sm" | "lg" | "icon" | "iconCircle"
// extra props: loading={boolean}

import { Badge } from "@/components/ui/badge";
// variants: "default" | "secondary" | "destructive" | "outline" | "bullish" | "bearish"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
```

### 2.4 Form & Input Controls
```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
```

### 2.5 Overlays & Feedback
```tsx
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
```

### 2.6 Financial Visualizations & Tables
```tsx
import {
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
} from "@/finance/portfolio-chart";

import {
  AssetHoldingsTable,
  sampleHoldings,
  type AssetHolding,
} from "@/finance/asset-table";
```

---

## 3. Mockup Page Construction Best Practices

When synthesizing a complete mockup page:

1. **Top-Level Structure**:
   - Wrap dashboard pages with `PageHeader` at the top for title, breadcrumbs, and primary CTA actions.
   - Use `Grid` with responsive breakpoints (`grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6`) or `VStack` / `HStack` for clean alignment.

2. **Metrics & KPI Cards**:
   - Display key figures using `Card` with monospace font (`font-mono`) for numerical values.
   - Accompany values with `Badge` (variant `bullish` or `bearish`) and trending icons from `lucide-react` (e.g. `TrendingUp`, `ArrowUpRight`, `ArrowDownRight`).

3. **Financial Terminals & Trading Layouts**:
   - Left / Center panel: Chart area (`PortfolioPerformanceChart` or Recharts visual) + `AssetHoldingsTable`.
   - Right panel: Order placement ticket using `Tabs` (Buy / Sell), `Input`, `Slider` (Leverage / Allocation percentage), and prominent `Button`.

4. **Realistic Mock Data**:
   - Always populate with realistic asset tickers (e.g., `NVDA`, `AAPL`, `BTC`, `ETH`, `SOL`, `VOO`), realistic monetary amounts (`$1,248,392.50`), and realistic timestamps.

5. **Pure React & TypeScript**:
   - Export a default React Functional Component.
   - Code must be self-contained and compilable without external unstated dependencies.
