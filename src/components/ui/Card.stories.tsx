import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "03. Core Primitives/Card",
  component: Card,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-sm">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Total Balance</CardTitle>
            <Badge variant="bullish">+12.4%</Badge>
          </div>
          <CardDescription>Aggregate net portfolio equity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono tracking-tight">$1,248,392.50</div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            +$138,420 vs last quarter
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">Download CSV</Button>
          <Button size="sm">Deposit Funds</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const AssetMetricsCard: StoryObj = {
  render: () => (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">NVIDIA Corp (NVDA)</CardTitle>
          <div className="text-2xl font-bold font-mono">$128.45</div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-xs text-emerald-600 font-medium flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-0.5" /> +3.25% today
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Bitcoin (BTC)</CardTitle>
          <div className="text-2xl font-bold font-mono">$64,210.00</div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-xs text-emerald-600 font-medium flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-0.5" /> +1.84% today
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
