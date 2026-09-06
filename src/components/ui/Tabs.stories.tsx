import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

const meta: Meta = {
  title: "05. Overlays & Navigation/Tabs",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-lg">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Portfolio Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Aggregated exposure across 14 assets in 3 custody vaults.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Sharpe & Volatility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Rolling 30-day Sharpe Ratio: 2.14 • Max Drawdown: -4.2%</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Execution Log</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Last rebalance executed 3 hours ago via Smart Order Router.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
