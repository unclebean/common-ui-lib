import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "02. Brand Identity/Logo",
  component: Logo,
  argTypes: {
    variant: {
      control: "radio",
      options: ["full", "icon"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    brandName: { control: "text" },
    tagline: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: {
    variant: "full",
    size: "md",
    brandName: "AstraUI",
    tagline: "Design System",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "icon",
    size: "lg",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start p-6">
      <Logo size="sm" brandName="Small Size" />
      <Logo size="md" brandName="Medium Size" />
      <Logo size="lg" brandName="Large Size" />
    </div>
  ),
};
