import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    spacing: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "column",
    spacing: "md",
    align: "stretch",
    justify: "start",
    wrap: false,
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType;
}

export function Stack({
  as: Comp = "div",
  direction,
  spacing,
  align,
  justify,
  wrap,
  className,
  ...props
}: StackProps) {
  return (
    <Comp
      className={cn(
        stackVariants({ direction, spacing, align, justify, wrap }),
        className
      )}
      {...props}
    />
  );
}

// Vertical Stack Shortcut
export function VStack({
  className,
  ...props
}: Omit<StackProps, "direction">) {
  return <Stack direction="column" className={className} {...props} />;
}

// Horizontal Stack Shortcut
export function HStack({
  className,
  ...props
}: Omit<StackProps, "direction">) {
  return <Stack direction="row" align="center" className={className} {...props} />;
}
