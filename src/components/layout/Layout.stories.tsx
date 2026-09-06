import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Container } from "./container";
import { Stack, VStack, HStack } from "./stack";
import { Grid, GridItem } from "./grid";
import { PageHeader } from "./page-header";
import { DashboardShell, SidebarNav } from "./dashboard-shell";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/logo";
import { LayoutDashboard, PieChart, Wallet, Settings } from "lucide-react";

const meta: Meta = {
  title: "06. Layout & Shells/Primitives & Dashboard",
};

export default meta;

export const PageHeaderDemo: StoryObj = {
  render: () => (
    <div className="p-6 max-w-5xl">
      <PageHeader
        title="Asset Allocation & Portfolio"
        description="Monitor real-time exposure, rebalance thresholds, and benchmark performance across asset classes."
        badge={<Badge variant="bullish">Live Markets</Badge>}
        actions={
          <>
            <Button variant="outline">Export CSV</Button>
            <Button>Rebalance</Button>
          </>
        }
      />
    </div>
  ),
};

export const ResponsiveGridDemo: StoryObj = {
  render: () => (
    <div className="p-6 max-w-5xl space-y-4">
      <h3 className="font-semibold text-sm">Responsive 3-Column Grid</h3>
      <Grid cols={3} gap="md">
        <div className="p-6 rounded-lg border bg-card text-center font-mono text-sm">
          Card 1
        </div>
        <div className="p-6 rounded-lg border bg-card text-center font-mono text-sm">
          Card 2
        </div>
        <div className="p-6 rounded-lg border bg-card text-center font-mono text-sm">
          Card 3
        </div>
      </Grid>

      <h3 className="font-semibold text-sm pt-4">12-Column Grid with Spans</h3>
      <Grid cols={12} gap="md">
        <GridItem colSpan={8} className="p-6 rounded-lg border bg-card text-center font-mono text-sm">
          Main Content (Span 8)
        </GridItem>
        <GridItem colSpan={4} className="p-6 rounded-lg border bg-card text-center font-mono text-sm">
          Sidebar Widget (Span 4)
        </GridItem>
      </Grid>
    </div>
  ),
};

export const FlexStackDemo: StoryObj = {
  render: () => (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          HStack (Horizontal Flex with aligned items)
        </h4>
        <HStack spacing="md" className="p-4 border rounded-lg bg-card">
          <Button size="sm">Action 1</Button>
          <Button size="sm" variant="secondary">Action 2</Button>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-xs text-muted-foreground">Status: Ready</span>
        </HStack>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          VStack (Vertical Flex with gap)
        </h4>
        <VStack spacing="sm" className="p-4 border rounded-lg bg-card max-w-xs">
          <span className="font-semibold text-sm">Portfolio Summary</span>
          <Separator />
          <span className="text-xs text-muted-foreground">Equity: $55,000</span>
          <span className="text-xs text-muted-foreground">Bonds: $30,000</span>
        </VStack>
      </div>
    </div>
  ),
};

export const FullDashboardShellDemo: StoryObj = {
  render: () => {
    const navItems = [
      { title: "Overview", icon: LayoutDashboard, active: true },
      { title: "Portfolio", icon: PieChart, badge: "3 Alerts" },
      { title: "Wallets", icon: Wallet },
      { title: "Settings", icon: Settings },
    ];

    return (
      <div className="border rounded-xl overflow-hidden shadow-sm h-[480px]">
        <DashboardShell
          sidebar={
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <Logo size="sm" brandName="AstraUI" />
              </div>
              <SidebarNav items={navItems} className="flex-1" />
              <div className="p-4 border-t text-xs text-muted-foreground font-mono">
                v0.1.0 • Figma Sync
              </div>
            </div>
          }
          header={
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-sm">Dashboard Workspace</span>
              <Button size="sm" variant="outline">Sign Out</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Welcome to Dashboard Shell</h2>
            <p className="text-sm text-muted-foreground">
              This layout component organizes navigation, persistent topbars, and scrollable application views.
            </p>
          </div>
        </DashboardShell>
      </div>
    );
  },
};
