import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Search } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "04. Forms & Controls/Input",
  component: Input,
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "password", "email", "number"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Enter asset ticker (e.g. NVDA)",
  },
};

export const WithLabelAndHelper: StoryObj = {
  render: () => (
    <div className="p-8 max-w-sm space-y-2">
      <Label htmlFor="ticker">Stock / ETF Ticker</Label>
      <Input id="ticker" placeholder="e.g. AAPL, VOO, SPY" />
      <p className="text-xs text-muted-foreground">Supports US Equities and global ADRs.</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Read-only Portfolio ID: #PORT-9821",
  },
};
