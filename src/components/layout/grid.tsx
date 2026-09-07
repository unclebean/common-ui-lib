import * as React from "react";
import { cn } from "@/lib/utils";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  as?: React.ElementType;
}

export function Grid({
  as: Comp = "div",
  cols = 3,
  gap = "md",
  className,
  ...props
}: GridProps) {
  const colsMap = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-1 lg:grid-cols-12",
  };

  const gapMap = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <Comp
      className={cn("grid", colsMap[cols], gapMap[gap], className)}
      {...props}
    />
  );
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  rowSpan?: 1 | 2 | 3 | 4;
}

export function GridItem({
  colSpan,
  rowSpan,
  className,
  ...props
}: GridItemProps) {
  const colSpanMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-1 sm:col-span-2",
    3: "col-span-1 lg:col-span-3",
    4: "col-span-1 lg:col-span-4",
    5: "col-span-1 lg:col-span-5",
    6: "col-span-1 md:col-span-6",
    12: "col-span-1 lg:col-span-12",
  };

  return (
    <div
      className={cn(
        colSpan && colSpanMap[colSpan],
        rowSpan && `row-span-${rowSpan}`,
        className
      )}
      {...props}
    />
  );
}
