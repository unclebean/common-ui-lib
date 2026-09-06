import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  PortfolioPerformanceChart,
  AssetAllocationDonutChart,
} from "./portfolio-chart";

const meta: Meta = {
  title: "07. Finance Modules/Portfolio Growth & Allocation",
};

export default meta;

export const PerformanceAreaChart: StoryObj = {
  render: () => (
    <div className="p-8 max-w-3xl">
      <PortfolioPerformanceChart />
    </div>
  ),
};

export const AssetAllocationDonut: StoryObj = {
  render: () => (
    <div className="p-8 max-w-md">
      <AssetAllocationDonutChart />
    </div>
  ),
};

export const FullDashboardWidget: StoryObj = {
  render: () => (
    <div className="p-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PortfolioPerformanceChart className="lg:col-span-2" />
      <AssetAllocationDonutChart />
    </div>
  ),
};
