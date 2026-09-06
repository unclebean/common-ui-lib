import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

const meta: Meta = {
  title: "05. Overlays & Navigation/Scroll Area",
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const logs = [
      "2026-09-06 22:45:10 - WebSocket connected to live feeds (binance, nyse)",
      "2026-09-06 22:45:12 - Subscribed to NVDA, AAPL, BTC/USD, ETH/USD",
      "2026-09-06 22:45:15 - Portfolio snapshot reconciled: $1,248,392.50",
      "2026-09-06 22:46:00 - Price tick: NVDA $128.45 (+3.25%)",
      "2026-09-06 22:46:05 - Price tick: BTC $64,210.00 (+1.84%)",
      "2026-09-06 22:46:30 - Heartbeat ping: 12ms latency",
      "2026-09-06 22:47:00 - Target allocation check: within 1.2% variance band",
      "2026-09-06 22:47:15 - Yield accrual credited: +$14.20 on staked ETH",
      "2026-09-06 22:48:00 - Audit trail verified with SHA256 checksum",
    ];

    return (
      <div className="p-8 max-w-md">
        <div className="rounded-md border p-4 bg-card">
          <h4 className="text-sm font-semibold mb-2">Live Trading Event Stream</h4>
          <ScrollArea className="h-48 w-full rounded-md border p-3">
            <div className="space-y-2 text-xs font-mono">
              {logs.map((log, i) => (
                <div key={i} className="text-muted-foreground hover:text-foreground transition-colors">
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  },
};
