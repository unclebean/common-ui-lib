import React from "react";
import { Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";

export default function MockupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8 select-none">
      <div className="relative mb-6">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/30 to-indigo-500/20 blur-xl animate-pulse" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/10 via-background to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-lg">
          <LayoutTemplate className="w-8 h-8 opacity-90" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ready to Create</span>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Blank AI Canvas
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
        Use the <strong className="text-foreground">AI Mockup Studio</strong> panel on the right to describe any screen or interface. The AI will synthesize your design system components and render them live here.
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 border border-border px-4 py-2 rounded-xl">
        <span>Type a prompt in the assistant panel</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
        <span>Watch your mockup generate instantly</span>
      </div>
    </div>
  );
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
