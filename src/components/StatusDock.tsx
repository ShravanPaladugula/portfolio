"use client";

import { motion, useReducedMotion } from "framer-motion";

type StatusDockProps = {
  onOpenCommands: () => void;
};

export function StatusDock({ onOpenCommands }: StatusDockProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 sm:bottom-6"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 border border-line bg-bg/90 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-50" />
          <span className="relative h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:inline">
          Open to internships
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:hidden">
          Open
        </span>
        <span className="h-3 w-px bg-line" aria-hidden />
        <button
          type="button"
          onClick={onOpenCommands}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg transition-colors hover:text-accent"
        >
          <span className="hidden sm:inline">Commands </span>
          <kbd className="border border-line px-1.5 py-0.5 text-muted">⌘K</kbd>
        </button>
      </div>
    </motion.div>
  );
}
