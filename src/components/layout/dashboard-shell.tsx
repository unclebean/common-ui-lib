import * as React from "react";
import { cn } from "@/lib/utils";

export interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({
  sidebar,
  header,
  children,
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className={cn("min-h-screen bg-background flex flex-col md:flex-row", className)} {...props}>
      {/* Sidebar navigation column */}
      {sidebar && (
        <aside className="w-full md:w-64 shrink-0 border-r border-border bg-card/50 flex flex-col">
          {sidebar}
        </aside>
      )}

      {/* Main app area */}
      <div className="flex-1 flex flex-col min-w-0">
        {header && (
          <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-background/80 backdrop-blur sticky top-0 z-30">
            {header}
          </header>
        )}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
    active?: boolean;
    badge?: string;
    onClick?: () => void;
  }[];
}

export function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("space-y-1 p-3", className)} {...props}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <button
            key={idx}
            onClick={item.onClick}
            className={cn(
              "w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              <span>{item.title}</span>
            </div>
            {item.badge && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-mono",
                  item.active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
