import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Label } from "./label";
import { Input } from "./input";

const meta: Meta<typeof Label> = {
  title: "04. Forms & Controls/Label",
  component: Label,
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "default", "lg"],
    },
    required: { control: "boolean" },
    optional: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Email Address",
  },
};

export const Required: Story = {
  args: {
    children: "Account Password",
    required: true,
  },
};

export const Optional: Story = {
  args: {
    children: "Secondary Phone",
    optional: true,
  },
};

export const LabelWithField: Story = {
  render: () => (
    <div className="p-6 max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="req-input" required>
          Portfolio Name
        </Label>
        <Input id="req-input" placeholder="e.g. Growth & Tech Fund" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="opt-input" optional size="sm">
          Description Notes
        </Label>
        <Input id="opt-input" placeholder="Optional investment mandate..." />
      </div>
    </div>
  ),
};
