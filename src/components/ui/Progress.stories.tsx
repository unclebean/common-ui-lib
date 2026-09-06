import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Progress } from "./progress";
import { Label } from "./label";

const meta: Meta<typeof Progress> = {
  title: "04. Forms & Controls/Progress",
  component: Progress,
  argTypes: {
    value: { control: "range", min: 0, max: 100, step: 1 },
  },
};

export default meta;

export const Default: StoryObj<typeof Progress> = {
  args: {
    value: 68,
  },
  render: (args) => (
    <div className="p-8 max-w-sm space-y-2">
      <div className="flex justify-between text-xs">
        <Label>Portfolio Allocation Goal</Label>
        <span className="font-mono font-semibold">{args.value}%</span>
      </div>
      <Progress value={args.value} />
    </div>
  ),
};
