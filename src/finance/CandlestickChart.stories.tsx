import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { CandlestickChart, sampleCandleData } from "./candlestick-chart";

const meta: Meta<typeof CandlestickChart> = {
  title: "07. Finance Modules/Candlestick Chart (TradingView)",
  component: CandlestickChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof CandlestickChart>;

export const Default: Story = {
  render: () => (
    <div className="max-w-5xl mx-auto p-4">
      <CandlestickChart symbol="BTC / USDT" subtitle="Bitcoin / TetherUS Spot" />
    </div>
  ),
};

export const EthereumDaily: Story = {
  render: () => (
    <div className="max-w-5xl mx-auto p-4">
      <CandlestickChart
        symbol="ETH / USDT"
        subtitle="Ethereum / TetherUS Spot"
        interval="1D"
        height={420}
      />
    </div>
  ),
};

export const CompactSidebar: Story = {
  render: () => (
    <div className="max-w-sm p-4">
      <CandlestickChart
        symbol="SOL / USDT"
        subtitle="Solana Spot"
        interval="5m"
        height={280}
        showVolume={false}
      />
    </div>
  ),
};

export const TradingDashboardGrid: Story = {
  render: () => (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-8 min-w-0">
        <CandlestickChart symbol="BTC / USDT" height={420} />
      </div>
      <div className="lg:col-span-4 min-w-0 space-y-4">
        <CandlestickChart symbol="ETH / USDT" height={220} showVolume={false} />
        <CandlestickChart symbol="SOL / USDT" height={220} showVolume={false} />
      </div>
    </div>
  ),
};
