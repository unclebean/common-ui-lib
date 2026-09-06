import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta: Meta<typeof Checkbox> = {
  title: "04. Forms & Controls/Checkbox",
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms" className="cursor-pointer">
        Accept automated trading agreement & execution risks
      </Label>
    </div>
  ),
};

export const WithDescription: StoryObj = {
  render: () => (
    <div className="p-8 max-w-md">
      <div className="items-top flex space-x-3 rounded-lg border p-4">
        <Checkbox id="margin-call" defaultChecked />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="margin-call" className="font-semibold cursor-pointer">
            Immediate Margin Protection
          </Label>
          <p className="text-sm text-muted-foreground">
            Automatically liquidate high-beta collateral if maintenance margin falls below 115%.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <div className="p-8 flex items-center space-x-2">
      <Checkbox id="disabled-check" disabled defaultChecked />
      <Label htmlFor="disabled-check" className="cursor-not-allowed opacity-70">
        Institutional Custody Lock (Requires SuperAdmin)
      </Label>
    </div>
  ),
};
