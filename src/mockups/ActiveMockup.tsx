import React from "react";
import { AlertTriangle, Paintbrush, EyeOff, Flame, Layers, Activity, RefreshCw, ZapOff, AlertCircle, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { Grid, GridItem } from "@/components/layout/grid";
import { Stack, VStack, HStack } from "@/components/layout/stack";
import { PortfolioPerformanceChart } from "@/finance/portfolio-chart";
import { AssetHoldingsTable, sampleHoldings } from "@/finance/asset-table";

export default function MockupPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <PageHeader 
        title="UX Debt & Aesthetic Anti-Pattern Audit" 
        description="Real-time telemetry tracking layout thrashing, contrast violations, and unstyled component leakage."
      >
        <HStack spacing="sm">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Rescan DOM
          </Button>
          <Button variant="destructive" className="gap-2">
            <Flame className="w-4 h-4" />
            Purge Visual Debt
          </Button>
        </HStack>
      </PageHeader>

      {/* Top Metric Cards */}
      <Grid cols={4} gap="lg">
        <GridItem colSpan={1}>
          <Card className="border-destructive/40 bg-destructive/5">
            <CardHeader className="pb-2">
              <CardDescription className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Critical Violations
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-destructive">142</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +28 ugly component leaks detected today
              </div>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem colSpan={1}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Contrast Failures
                <EyeOff className="w-4 h-4 text-amber-500" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold">89</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-amber-600 font-medium">
                WCAG AA non-compliant nodes
              </div>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem colSpan={1}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Font Stack Chaos
                <Paintbrush className="w-4 h-4 text-indigo-500" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold">14 Families</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Comic Sans leakage in <span className="font-mono text-xs">/legacy-billing</span>
              </div>
            </CardContent>
          </Card>
        </GridItem>

        <GridItem colSpan={1}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex justify-between items-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Design Health Index
                <Activity className="w-4 h-4 text-emerald-500" />
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-amber-600">34 / 100</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-destructive font-medium">
                Status: Severe Aesthetics Degradation
              </div>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>

      {/* Main Analysis Section */}
      <Grid cols={3} gap="lg">
        {/* Trend Chart */}
        <GridItem colSpan={2}>
          <Card className="h-full">
            <CardHeader>
              <HStack className="justify-between items-center">
                <div>
                  <CardTitle>Aesthetic Degradation Velocity</CardTitle>
                  <CardDescription>
                    Historical spike in visual bugs and unstyled DOM nodes over time
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                  High Risk Spikes
                </Badge>
              </HStack>
            </CardHeader>
            <CardContent>
              <PortfolioPerformanceChart />
            </CardContent>
          </Card>
        </GridItem>

        {/* Live Anti-Pattern Feed */}
        <GridItem colSpan={1}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Live Incidents
              </CardTitle>
              <CardDescription>
                Real-time DOM inspection alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VStack spacing="md">
                <div className="p-3 border rounded-lg bg-muted/40 space-y-2">
                  <HStack className="justify-between items-center">
                    <Badge variant="destructive">Neon Yellow Text</Badge>
                    <span className="text-xs text-muted-foreground">2m ago</span>
                  </HStack>
                  <p className="text-xs text-foreground font-mono bg-background p-1.5 rounded border">
                    color: #ffff00; background: #ffffff;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Unreadable contrast in footer copyright component.
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/40 space-y-2">
                  <HStack className="justify-between items-center">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      Nested Scrolling
                    </Badge>
                    <span className="text-xs text-muted-foreground">14m ago</span>
                  </HStack>
                  <p className="text-xs text-foreground font-mono bg-background p-1.5 rounded border">
                    overflow-y: scroll; /* inside scroll */
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Double scrollbars detected in user settings modal.
                  </p>
                </div>

                <div className="p-3 border rounded-lg bg-muted/40 space-y-2">
                  <HStack className="justify-between items-center">
                    <Badge variant="outline" className="border-red-500 text-red-500">
                      Misaligned Grid
                    </Badge>
                    <span className="text-xs text-muted-foreground">1h ago</span>
                  </HStack>
                  <p className="text-xs text-foreground font-mono bg-background p-1.5 rounded border">
                    margin-left: -37px; /* dynamic hack */
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Arbitrary negative margins breaking layout structure.
                  </p>
                </div>
              </VStack>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>

      {/* Component Quarantine Inventory */}
      <Card>
        <CardHeader>
          <HStack className="justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileWarning className="w-5 h-5 text-amber-500" />
                Quarantined Legacy Components
              </CardTitle>
              <CardDescription>
                High-priority visual debt candidates scheduled for refactoring into system standards
              </CardDescription>
            </div>
            <HStack spacing="xs">
              <Avatar className="w-8 h-8">
                <Avatar><AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  UX
                </AvatarFallback></Avatar>
              </Avatar>
              <Avatar className="w-8 h-8">
                <Avatar><AvatarFallback className="text-xs bg-destructive text-destructive-foreground">
                  DEV
                </AvatarFallback></Avatar>
              </Avatar>
            </HStack>
          </HStack>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AssetHoldingsTable data={sampleHoldings} />
        </CardContent>
        <CardFooter className="justify-between border-t py-4 text-xs text-muted-foreground">
          <span>Displaying legacy design tokens and orphaned components</span>
          <Button variant="ghost" size="sm" className="text-xs">
            Export Audit Report (PDF)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
