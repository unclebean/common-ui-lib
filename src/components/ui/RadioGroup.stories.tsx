import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";

const meta: Meta<typeof RadioGroup> = {
  title: "04. Forms & Controls/Radio Group",
  component: RadioGroup,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-sm space-y-3">
      <Label className="font-semibold text-sm">Execution Order Type</Label>
      <RadioGroup defaultValue="market">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="market" id="market" />
          <Label htmlFor="market" className="cursor-pointer font-normal">Market Order (Immediate fill)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="limit" id="limit" />
          <Label htmlFor="limit" className="cursor-pointer font-normal">Limit Order (Fixed price ceiling)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="stop" id="stop" />
          <Label htmlFor="stop" className="cursor-pointer font-normal">Stop-Loss Order (Trigger on drop)</Label>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const CardSelectionStyle: StoryObj = {
  render: () => (
    <div className="p-8 max-w-md">
      <RadioGroup defaultValue="standard" className="grid grid-cols-2 gap-4">
        <div className="flex items-start space-x-3 rounded-lg border p-4 hover:border-primary cursor-pointer">
          <RadioGroupItem value="standard" id="std" className="mt-1" />
          <div>
            <Label htmlFor="std" className="font-semibold cursor-pointer">Standard Pool</Label>
            <p className="text-xs text-muted-foreground mt-1">0.05% fee, optimal for large liquid pairs.</p>
          </div>
        </div>
        <div className="flex items-start space-x-3 rounded-lg border p-4 hover:border-primary cursor-pointer">
          <RadioGroupItem value="flash" id="fls" className="mt-1" />
          <div>
            <Label htmlFor="fls" className="font-semibold cursor-pointer">Flash Pool</Label>
            <p className="text-xs text-muted-foreground mt-1">0.30% fee, instant cross-DEX arbitrage.</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};
