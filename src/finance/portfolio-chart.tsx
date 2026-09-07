import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Mock Portfolio Historical Performance Data
const portfolioHistoryData = [
  { date: "2024-01", portfolio: 100000, benchmark: 100000 },
  { date: "2024-02", portfolio: 108500, benchmark: 102100 },
  { date: "2024-03", portfolio: 114200, benchmark: 104500 },
  { date: "2024-04", portfolio: 111000, benchmark: 103200 },
  { date: "2024-05", portfolio: 122400, benchmark: 106800 },
  { date: "2024-06", portfolio: 129800, benchmark: 109100 },
  { date: "2024-07", portfolio: 135600, benchmark: 111400 },
];

const historyConfig = {
  portfolio: {
    label: "My Portfolio ($)",
    color: "hsl(var(--chart-1))",
  },
  benchmark: {
    label: "S&P 500 Index ($)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Mock Asset Allocation Data
const allocationData = [
  { name: "US Tech Equities", value: 55000, color: "hsl(var(--chart-1))" },
  { name: "Fixed Income / Bonds", value: 30000, color: "hsl(var(--chart-2))" },
  { name: "Global ETF", value: 25000, color: "hsl(var(--chart-3))" },
  { name: "Crypto Assets", value: 15600, color: "hsl(var(--chart-4))" },
  { name: "Cash Reserves", value: 10000, color: "hsl(var(--chart-5))" },
];

const allocationConfig = {
  equities: { label: "US Tech", color: "hsl(var(--chart-1))" },
  bonds: { label: "Bonds", color: "hsl(var(--chart-2))" },
  etf: { label: "Global ETF", color: "hsl(var(--chart-3))" },
  crypto: { label: "Crypto", color: "hsl(var(--chart-4))" },
  cash: { label: "Cash", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

export function PortfolioPerformanceChart({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full min-w-0 overflow-hidden", className)}>
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg font-semibold truncate">Portfolio Growth</CardTitle>
            <CardDescription className="text-xs sm:text-sm truncate">
              Historical Net Asset Value (NAV) vs Benchmark
            </CardDescription>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
              $135,600
            </span>
            <span className="ml-2 text-xs font-semibold text-bullish">
              +35.6% YTD
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6 pt-0 sm:pt-0">
        <ChartContainer config={historyConfig} className="h-[280px] w-full min-w-0">
          <AreaChart
            data={portfolioHistoryData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillBenchmark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.5} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
              stroke="hsl(var(--muted-foreground))"
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="benchmark"
              type="monotone"
              fill="url(#fillBenchmark)"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
            />
            <Area
              dataKey="portfolio"
              type="monotone"
              fill="url(#fillPortfolio)"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function AssetAllocationDonutChart({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>Target weights by asset class</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={allocationConfig} className="h-[280px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={allocationData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              stroke="hsl(var(--background))"
              strokeWidth={2}
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t text-xs">
          {allocationData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
