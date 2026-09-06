import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

const meta: Meta = {
  title: "05. Overlays & Navigation/Accordion",
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 max-w-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>How are tokens synchronized with Figma?</AccordionTrigger>
          <AccordionContent>
            Tokens are parsed from the Figma document tree via REST API and compiled into CSS Custom Properties in `globals.css`.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>What is the downstream consumption pattern?</AccordionTrigger>
          <AccordionContent>
            Apps import `@common/ui-lib/globals.css` and use components directly. Tailwind classes work seamlessly using CSS variables.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Are finance charts customizable?</AccordionTrigger>
          <AccordionContent>
            Yes, Recharts wrappers accept custom data series, time intervals, and color override tokens matching `--chart-1` through `--chart-5`.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
