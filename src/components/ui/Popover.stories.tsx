import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { SlidersHorizontal } from "lucide-react";

const meta: Meta = {
  title: "05. Overlays & Navigation/Popover",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Quick Slippage Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Execution Constraints</h4>
              <p className="text-xs text-muted-foreground">
                Set maximum acceptable price impact for DEX routing.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="slippage">Max Slip</Label>
                <Input id="slippage" defaultValue="0.5%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" defaultValue="20 mins" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
