"use client";

import { useEffect, useState } from "react";
import { getTheme, toggleTheme } from "@/lib/theme";

type Theme = "night" | "day";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("night");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setTheme(getTheme());
    sync();
    setReady(true);
    window.addEventListener("sp-theme-change", sync);
    return () => window.removeEventListener("sp-theme-change", sync);
  }, []);

  const onToggle = () => {
    const next = toggleTheme();
    setTheme(next);
    window.dispatchEvent(new Event("sp-theme-change"));
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={
        theme === "night" ? "Switch to day mode" : "Switch to night mode"
      }
      className="border border-fg/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-fg hover:bg-fg hover:text-bg"
      suppressHydrationWarning
    >
      {ready ? (theme === "night" ? "Day" : "Night") : "Day"}
    </button>
  );
}
