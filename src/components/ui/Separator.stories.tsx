import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "03. Core Primitives/Separator",
  component: Separator,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-md space-y-4">
      <div>
        <h4 className="text-sm font-medium leading-none">Trading Settings</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Configure default slippage and execution parameters.
        </p>
      </div>
      <Separator />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};
