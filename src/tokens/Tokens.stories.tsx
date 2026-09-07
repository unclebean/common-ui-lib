import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

const meta: Meta = {
  title: "08. Design Tokens/Palette & Metrics",
};

export default meta;

export const AllTokens: StoryObj = {
  render: () => {
    const semanticColors = [
      { name: "Primary", var: "--primary", text: "--primary-foreground" },
      { name: "Secondary", var: "--secondary", text: "--secondary-foreground" },
      { name: "Muted", var: "--muted", text: "--muted-foreground" },
      { name: "Accent", var: "--accent", text: "--accent-foreground" },
      { name: "Destructive", var: "--destructive", text: "--destructive-foreground" },
      { name: "Border", var: "--border", text: "--foreground" },
    ];

    const chartColors = [
      { name: "Chart 1 (Equities / Portfolio)", var: "--chart-1" },
      { name: "Chart 2 (Benchmark / Bonds)", var: "--chart-2" },
      { name: "Chart 3 (Global ETF)", var: "--chart-3" },
      { name: "Chart 4 (Crypto Assets)", var: "--chart-4" },
      { name: "Chart 5 (Cash Reserves)", var: "--chart-5" },
    ];

    const financialIndicators = [
      { name: "Bullish (Gains / Long)", var: "--bullish" },
      { name: "Bearish (Losses / Short)", var: "--bearish" },
    ];

    return (
      <div className="p-6 max-w-4xl space-y-8 font-sans">
        <div>
          <h2 className="text-xl font-bold tracking-tight mb-1">Design Tokens Palette</h2>
          <p className="text-sm text-muted-foreground">
            Sourced directly from CSS variables synchronized with Figma Local Variables.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Semantic Colors
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {semanticColors.map((c) => (
              <div key={c.name} className="border rounded-lg p-3 bg-card space-y-2">
                <div
                  className="h-12 w-full rounded border flex items-center justify-center font-mono text-xs font-semibold"
                  style={{
                    backgroundColor: `hsl(var(${c.var}))`,
                    color: `hsl(var(${c.text}))`,
                  }}
                >
                  {c.name}
                </div>
                <div className="text-xs font-mono text-muted-foreground">{c.var}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Financial Chart Palette
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {chartColors.map((c) => (
              <div key={c.name} className="border rounded-lg p-3 bg-card space-y-2">
                <div
                  className="h-12 w-full rounded border flex items-center justify-center font-mono text-xs font-semibold text-white"
                  style={{ backgroundColor: `hsl(var(${c.var}))` }}
                >
                  {c.name}
                </div>
                <div className="text-xs font-mono text-muted-foreground">{c.var}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Financial Indicators (Bullish & Bearish)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {financialIndicators.map((c) => (
              <div key={c.name} className="border rounded-lg p-3 bg-card space-y-2">
                <div
                  className="h-12 w-full rounded border flex items-center justify-center font-mono text-xs font-semibold text-white"
                  style={{ backgroundColor: `hsl(var(${c.var}))` }}
                >
                  {c.name}
                </div>
                <div className="text-xs font-mono text-muted-foreground">{c.var}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
