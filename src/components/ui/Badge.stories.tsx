import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "03. Core Primitives/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "bullish", "bearish"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Active Status",
    variant: "default",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center p-6">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="bullish">+12.4% Bullish</Badge>
      <Badge variant="bearish">-3.2% Bearish</Badge>
    </div>
  ),
};
