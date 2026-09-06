import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";

const meta: Meta<typeof Dialog> = {
  title: "05. Overlays & Navigation/Dialog",
  component: Dialog,
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Modal Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>
              Please review the portfolio order details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">
            This modal is built on Radix Dialog primitive with full accessibility, focus trap, and design token styling.
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Confirm Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
