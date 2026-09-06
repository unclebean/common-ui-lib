import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "03. Core Primitives/Avatar",
  component: Avatar,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>HQ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">AI</AvatarFallback>
      </Avatar>
    </div>
  ),
};
