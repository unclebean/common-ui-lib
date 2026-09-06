import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
  brandName?: string;
  tagline?: string;
}

export function Logo({
  variant = "full",
  size = "md",
  brandName = "AstraUI",
  tagline = "Design System",
  className,
  ...props
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: "text-sm", tag: "text-[10px]" },
    md: { icon: 32, text: "text-lg", tag: "text-xs" },
    lg: { icon: 44, text: "text-2xl", tag: "text-sm" },
  };

  const { icon, text, tag } = sizeMap[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-sans select-none",
        className
      )}
      {...props}
    >
      {/* Brand Icon SVG (Driven by Design Tokens: primary & chart colors) */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))" />
            <stop offset="1" stopColor="hsl(var(--chart-2))" />
          </linearGradient>
        </defs>
        <rect
          width="40"
          height="40"
          rx="10"
          fill="url(#logoGradient)"
        />
        {/* Modern geometric monogram / finance node graph */}
        <path
          d="M12 28L18 16L24 22L28 12"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28" cy="12" r="2.5" fill="hsl(var(--primary-foreground))" />
        <circle cx="18" cy="16" r="2" fill="hsl(var(--primary-foreground))" />
      </svg>

      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-bold tracking-tight text-foreground", text)}>
            {brandName}
          </span>
          {tagline && (
            <span className={cn("text-muted-foreground font-medium tracking-wider uppercase mt-0.5", tag)}>
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;
