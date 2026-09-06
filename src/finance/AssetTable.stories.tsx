import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { AssetHoldingsTable, sampleHoldings } from "./asset-table";

const meta: Meta<typeof AssetHoldingsTable> = {
  title: "07. Finance Modules/Asset Holdings Table",
  component: AssetHoldingsTable,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-5xl">
      <AssetHoldingsTable data={sampleHoldings} />
    </div>
  ),
};
