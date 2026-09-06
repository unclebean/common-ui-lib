import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Switch } from "./switch";
import { Label } from "./label";

const meta: Meta<typeof Switch> = {
  title: "04. Forms & Controls/Switch",
  component: Switch,
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [checked, setChecked] = React.useState(true);
    return (
      <div className="p-8 flex items-center space-x-2">
        <Switch id="dark-mode" checked={checked} onCheckedChange={setChecked} />
        <Label htmlFor="dark-mode" className="cursor-pointer">
          Enable Automated Rebalancing
        </Label>
      </div>
    );
  },
};

export const SettingRow: StoryObj = {
  render: () => {
    const [checked, setChecked] = React.useState(true);
    return (
      <div className="p-8 max-w-md">
        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
          <div className="space-y-0.5">
            <Label htmlFor="stoploss-switch" className="text-sm font-semibold cursor-pointer">
              Dynamic Stop-Loss
            </Label>
            <p className="text-xs text-muted-foreground">
              Execute trailing stop-loss orders when volatility exceeds 3σ.
            </p>
          </div>
          <Switch id="stoploss-switch" checked={checked} onCheckedChange={setChecked} />
        </div>
      </div>
    );
  },
};
