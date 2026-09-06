import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Slider } from "./slider";
import { Label } from "./label";

const meta: Meta<typeof Slider> = {
  title: "04. Forms & Controls/Slider",
  component: Slider,
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [val, setVal] = React.useState([50]);
    return (
      <div className="p-8 max-w-sm space-y-4">
        <div className="flex justify-between items-center">
          <Label>Leverage Ratio</Label>
          <span className="font-mono text-sm font-semibold">{val[0]}x</span>
        </div>
        <Slider value={val} onValueChange={setVal} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1x (Cash)</span>
          <span>50x</span>
          <span>100x (Max)</span>
        </div>
      </div>
    );
  },
};

export const DualThumbRange: StoryObj = {
  render: () => {
    const [range, setRange] = React.useState([20, 80]);
    return (
      <div className="p-8 max-w-sm space-y-4">
        <div className="flex justify-between items-center">
          <Label>Target Valuation Range</Label>
          <span className="font-mono text-sm font-semibold">${range[0]} - ${range[1]}</span>
        </div>
        <Slider value={range} onValueChange={setRange} max={150} min={10} step={5} />
      </div>
    );
  },
};
