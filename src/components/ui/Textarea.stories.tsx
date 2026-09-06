import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Textarea } from "./textarea";
import { Label } from "./label";

const meta: Meta<typeof Textarea> = {
  title: "04. Forms & Controls/Textarea",
  component: Textarea,
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Enter trading notes or strategy rationale here...",
    rows: 4,
  },
};

export const WithLabel: StoryObj = {
  render: () => (
    <div className="p-8 max-w-md space-y-2">
      <Label htmlFor="strategy-notes">Investment Thesis</Label>
      <Textarea
        id="strategy-notes"
        placeholder="Document the macroeconomic signals or earnings catalysts for this position..."
        rows={4}
      />
      <p className="text-xs text-muted-foreground">Max 500 characters. Visible to portfolio co-managers.</p>
    </div>
  ),
};
