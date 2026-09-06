import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Sun,
  Moon,
  CalendarIcon,
  CheckCircle2,
  PieChart as PieIcon,
  Sliders,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
} from "@/finance/portfolio-chart";
import { AssetHoldingsTable } from "@/finance/asset-table";

// Form Validation Schema using Zod
const tradeFormSchema = z.object({
  assetSymbol: z.string().min(1, "Please select an asset."),
  orderType: z.enum(["buy", "sell"], {
    required_error: "Order type is required.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  executionDate: z.date({
    required_error: "Execution date is required.",
  }),
  enableStopLoss: z.boolean().default(false),
});

type TradeFormValues = z.infer<typeof tradeFormSchema>;

export default function App() {
  const [isDark, setIsDark] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<TradeFormValues | null>(null);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const form = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: {
      assetSymbol: "NVDA",
      orderType: "buy",
      amount: "5000",
      executionDate: new Date(),
      enableStopLoss: true,
    },
  });

  function onSubmit(values: TradeFormValues) {
    setSubmittedData(values);
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Logo size="md" brandName="CommonUI" tagline="Design Tokens & Kit" />
            <Badge variant="outline" className="hidden sm:inline-flex text-xs font-normal">
              Figma MCP Ready
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDark(!isDark)}
              className="gap-2"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  Quick Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Design Tokens</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => alert("Tokens are defined in src/tokens/tokens.json")}>
                  Inspect Tokens JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => alert("Figma config located at .figma/config.json")}>
                  Figma MCP Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => alert("Ready to export as an npm package or git submodule")}>
                  Export Common Lib
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Section 1: Hero Banner */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Design Token & Component Sandbox
            </h1>
            <p className="text-sm text-muted-foreground">
              All components, charts, and brand assets are powered by CSS variables mapped directly to Figma Local Variables.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Open Dialog Demo</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Dialog Modal Component</DialogTitle>
                  <DialogDescription>
                    Fully accessible modal primitive backed by Radix UI. It adheres to all focus trapping, keyboard navigation, and design token rules.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2 text-sm text-muted-foreground">
                  <p>
                    All padding, border-radius, background, and typography are driven by:
                  </p>
                  <code className="block p-2 rounded bg-muted text-foreground text-xs font-mono">
                    --card, --popover, --radius, --border
                  </code>
                </div>
                <DialogFooter>
                  <Button type="button">Understood</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Section 2: Financial Charts (Portfolio & Allocation) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">
                Finance Portfolio Visualization (Recharts + Token Bindings)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Colors dynamically sourced from --chart-1 through --chart-5
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PortfolioPerformanceChart className="lg:col-span-2" />
            <AssetAllocationDonutChart />
          </div>
        </section>

        {/* Section 3: Financial Asset Data Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">
                Holdings Data Table (TanStack Table Integration)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Supports real column sorting & bullish/bearish indicator badges
            </span>
          </div>

          <AssetHoldingsTable />
        </section>

        {/* Section 4: Interactive Form & Foundation Form Controls */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">
                Zod-Validated Form & Controls (Checkbox, Radio, Select, Calendar)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* The Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Place Trade Order</CardTitle>
                <CardDescription>
                  Demonstrates React Hook Form integration with Radix Select, Checkbox, Radio, and Calendar Popover.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Asset Select */}
                      <FormField
                        control={form.control}
                        name="assetSymbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Asset</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select asset" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="NVDA">NVDA - NVIDIA Corp</SelectItem>
                                <SelectItem value="AAPL">AAPL - Apple Inc</SelectItem>
                                <SelectItem value="BTC">BTC - Bitcoin</SelectItem>
                                <SelectItem value="VOO">VOO - Vanguard S&P 500</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>Choose position to rebalance.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Trade Amount */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount ($ USD)</FormLabel>
                            <FormControl>
                              <Input placeholder="1000" {...field} />
                            </FormControl>
                            <FormDescription>Order execution nominal value.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Side (Radio) */}
                      <FormField
                        control={form.control}
                        name="orderType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Order Side</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-4"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="buy" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Buy / Long
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="sell" />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    Sell / Short
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Execution Date Picker with Calendar + Popover */}
                      <FormField
                        control={form.control}
                        name="executionDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="mb-2">Execution Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal flex justify-between items-center"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Stop Loss Checkbox */}
                    <FormField
                      control={form.control}
                      name="enableStopLoss"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="cursor-pointer font-medium">
                              Enable automated stop-loss protection
                            </FormLabel>
                            <FormDescription>
                              Liquidates order if asset drops below 5% of entry price.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full sm:w-auto">
                      Execute Test Order
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Form State & Token Palette Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Design Token Color Swatches</CardTitle>
                  <CardDescription>Live CSS variable references</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Primary</span>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-primary border" />
                      <code className="font-mono">--primary</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Bullish</span>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-bullish border" />
                      <code className="font-mono">--bullish</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Bearish</span>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-bearish border" />
                      <code className="font-mono">--bearish</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Chart Palette</span>
                    <div className="flex gap-1">
                      <span className="w-4 h-4 rounded bg-[hsl(var(--chart-1))]" />
                      <span className="w-4 h-4 rounded bg-[hsl(var(--chart-2))]" />
                      <span className="w-4 h-4 rounded bg-[hsl(var(--chart-3))]" />
                      <span className="w-4 h-4 rounded bg-[hsl(var(--chart-4))]" />
                      <span className="w-4 h-4 rounded bg-[hsl(var(--chart-5))]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {submittedData && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-primary">
                      <CheckCircle2 className="h-4 w-4" /> Form Submission Received
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs font-mono space-y-1">
                    <div>Asset: {submittedData.assetSymbol}</div>
                    <div>Side: {submittedData.orderType.toUpperCase()}</div>
                    <div>Amount: ${submittedData.amount}</div>
                    <div>Date: {format(submittedData.executionDate, "yyyy-MM-dd")}</div>
                    <div>StopLoss: {submittedData.enableStopLoss ? "Active" : "Disabled"}</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
