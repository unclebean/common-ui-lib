import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "04. Forms & Controls/Calendar",
  component: Calendar,
};

export default meta;

export const Default: StoryObj = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="p-8 flex flex-col items-start gap-4">
        <div className="rounded-md border p-2 bg-card">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          Selected Date: {date ? date.toDateString() : "None"}
        </p>
      </div>
    );
  },
};
