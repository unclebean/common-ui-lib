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
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-5",
    6: "grid-cols-1 sm:grid-cols-3 md:grid-cols-6",
    12: "grid-cols-1 md:grid-cols-12",
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

export interface ResponsiveSpan {
  base?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  span?: number | ResponsiveSpan;
  rowSpan?: 1 | 2 | 3 | 4;
}

export function GridItem({
  colSpan,
  span,
  rowSpan,
  className,
  ...props
}: GridItemProps) {
  const colSpanMap: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-1 sm:col-span-2",
    3: "col-span-1 md:col-span-3",
    4: "col-span-1 md:col-span-4",
    5: "col-span-1 md:col-span-5",
    6: "col-span-1 md:col-span-6",
    7: "col-span-1 md:col-span-7",
    8: "col-span-1 md:col-span-8",
    9: "col-span-1 md:col-span-9",
    10: "col-span-1 md:col-span-10",
    11: "col-span-1 md:col-span-11",
    12: "col-span-1 md:col-span-12",
  };

  const spanClasses: string[] = [];
  const effectiveColSpan = colSpan ?? (typeof span === "number" ? span : undefined);

  if (effectiveColSpan && colSpanMap[effectiveColSpan]) {
    spanClasses.push(colSpanMap[effectiveColSpan]);
  } else if (typeof span === "object" && span !== null) {
    if (span.base) spanClasses.push(`col-span-${span.base}`);
    if (span.sm) spanClasses.push(`sm:col-span-${span.sm}`);
    if (span.md) spanClasses.push(`md:col-span-${span.md}`);
    if (span.lg) spanClasses.push(`lg:col-span-${span.lg}`);
    if (span.xl) spanClasses.push(`xl:col-span-${span.xl}`);
  }

  return (
    <div
      className={cn(
        spanClasses.join(" "),
        rowSpan && `row-span-${rowSpan}`,
        className
      )}
      {...props}
    />
  );
}
