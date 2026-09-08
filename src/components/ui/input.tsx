import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const hasIcon = Boolean(startIcon || endIcon);

    const inputElement = (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          startIcon && "pl-9",
          endIcon && "pr-9",
          className
        )}
        ref={ref}
        {...props}
      />
    );

    if (!hasIcon) {
      return inputElement;
    }

    return (
      <div className="relative flex items-center w-full">
        {startIcon && (
          <div className="absolute left-3 flex items-center justify-center pointer-events-none text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {startIcon}
          </div>
        )}
        {inputElement}
        {endIcon && (
          <div className="absolute right-3 flex items-center justify-center pointer-events-none text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
