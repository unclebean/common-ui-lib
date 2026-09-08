import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/layout/page-header";
import { Grid, GridItem } from "@/components/layout/grid";
import {
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
} from "@/finance/portfolio-chart";
import { AssetHoldingsTable, sampleHoldings } from "@/finance/asset-table";
import { CandlestickChart } from "@/finance/candlestick-chart";
import { TrendingUp, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";

export default function TradingTerminalMockup() {
  const [leverage, setLeverage] = React.useState([10]);
  const [autoHedging, setAutoHedging] = React.useState(true);
  const [orderAmount, setOrderAmount] = React.useState("5000");

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Institutional Multi-Asset Trading Terminal"
        description="Unified order routing, real-time exposure tracking, and algorithmic smart liquidity distribution."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Download Audit Log</Button>
            <Button size="sm" className="gap-1.5">
              <Zap className="h-4 w-4" /> Deploy Smart Router
            </Button>
          </div>
        }
      />

      {/* Top Level Metric KPIs */}
      <Grid cols={4} gap="md">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Equity</span>
              <Badge variant="bullish">+14.8% YTD</Badge>
            </div>
            <div className="text-2xl font-bold font-mono">$1,842,910.40</div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            +$24,190.00 unrealized PnL today
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Maintenance Margin</span>
              <span className="font-mono text-emerald-500 font-semibold">248.5%</span>
            </div>
            <div className="text-2xl font-bold font-mono">$482,000.00</div>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Collateral health: Optimal
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-xs text-muted-foreground">Top Exposure</div>
            <div className="text-2xl font-bold font-mono">NVDA ($425k)</div>
          </CardHeader>
          <CardContent className="text-xs text-emerald-600 font-medium flex items-center">
            <ArrowUpRight className="h-4 w-4" /> +3.42% ($128.45)
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-xs text-muted-foreground">Digital Assets</div>
            <div className="text-2xl font-bold font-mono">BTC ($321k)</div>
          </CardHeader>
          <CardContent className="text-xs text-emerald-600 font-medium flex items-center">
            <ArrowUpRight className="h-4 w-4" /> +1.84% ($64,210.00)
          </CardContent>
        </Card>
      </Grid>

      {/* Main Terminal Workspace: Left Visuals & Holdings vs Right Order Ticket */}
      <Grid cols={3} gap="lg">
        {/* Charts & Holdings (2 Cols) */}
        <GridItem colSpan={2} className="space-y-6">
          <CandlestickChart symbol="BTC / USDT" interval="15m" height={360} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Active Holdings & Risk Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetHoldingsTable data={sampleHoldings} />
            </CardContent>
          </Card>
        </GridItem>

        {/* Right Order Ticket & Allocation (1 Col) */}
        <GridItem colSpan={1} className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Asset Allocation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetAllocationDonutChart />
            </CardContent>
          </Card>

          {/* Quick Execution Ticket */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Instant Execution Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy / Long</TabsTrigger>
                  <TabsTrigger value="sell">Sell / Short</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="order-amount">Order Size (USD)</Label>
                    <Input
                      id="order-amount"
                      type="number"
                      value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)}
                      placeholder="5000"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <Label>Leverage Multiplier</Label>
                      <span className="font-mono font-semibold">{leverage[0]}x</span>
                    </div>
                    <Slider
                      value={leverage}
                      onValueChange={setLeverage}
                      max={50}
                      min={1}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center justify-between border rounded p-2.5 bg-muted/40">
                    <div className="space-y-0.5">
                      <Label htmlFor="hedging" className="text-xs font-semibold cursor-pointer">
                        Smart Auto-Hedge
                      </Label>
                      <p className="text-[10px] text-muted-foreground">
                        Offset delta risk on inverted variance
                      </p>
                    </div>
                    <Switch
                      id="hedging"
                      checked={autoHedging}
                      onCheckedChange={setAutoHedging}
                    />
                  </div>

                  <Button className="w-full font-semibold" size="lg">
                    Execute Market Order
                  </Button>
                </TabsContent>

                <TabsContent value="sell" className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sell-amount">Sell Quantity</Label>
                    <Input id="sell-amount" placeholder="0.5 BTC / 20 NVDA" />
                  </div>
                  <Button variant="destructive" className="w-full" size="lg">
                    Execute Sell Order
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}
