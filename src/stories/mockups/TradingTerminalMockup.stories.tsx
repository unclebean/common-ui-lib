import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import TradingTerminalMockup from "@/mockups/TradingTerminalMockup";

const meta: Meta = {
  title: "01. AI Mockups/Trading Terminal",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-background text-foreground p-8">
      <TradingTerminalMockup />
    </div>
  ),
};
