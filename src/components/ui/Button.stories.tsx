import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "./button";
import { Plus, ArrowRight, Heart } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "03. Core Primitives/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "subtle",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "iconCircle"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Default Button",
    variant: "default",
  },
};

export const FigmaVariantsShowcase: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-6">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="subtle">Subtle (Figma)</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const FigmaIconAndSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center p-6">
      {/* With Icon (gap-2 aligned with Figma itemSpacing) */}
      <Button>
        <Plus className="h-4 w-4" />
        <span>With Icon</span>
      </Button>

      {/* Just Icon */}
      <Button size="icon" variant="outline" title="Add item">
        <Plus className="h-4 w-4" />
      </Button>

      {/* Just Icon Circle (type=just icon circle in Figma) */}
      <Button size="iconCircle" variant="outline" title="Favorite">
        <Heart className="h-4 w-4 text-destructive" />
      </Button>

      {/* Loading state (type=loading in Figma) */}
      <Button loading>Executing Order...</Button>

      <Button variant="default">
        <span>Proceed</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  ),
};
