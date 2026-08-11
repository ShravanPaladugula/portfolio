"use client";

import { useEffect, useState } from "react";

type Theme = "night" | "day";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("light", theme === "day");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("night");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("sp-theme");
    const next: Theme = stored === "day" ? "day" : "night";
    setTheme(next);
    applyTheme(next);
    setReady(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "night" ? "day" : "night";
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem("sp-theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
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
