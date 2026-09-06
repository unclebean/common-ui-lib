import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Button } from "./button";
import { HelpCircle } from "lucide-react";

const meta: Meta = {
  title: "05. Overlays & Navigation/Tooltip",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 flex items-center gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Annual Percentage Yield (APY) includes compounded rewards</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary">Hover for Details</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Figma-aligned Tooltip popover spec</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};
