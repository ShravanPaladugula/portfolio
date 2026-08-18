"use client";

export type Theme = "night" | "day";

export function getTheme(): Theme {
  if (typeof document === "undefined") return "night";
  return document.documentElement.classList.contains("light") ? "day" : "night";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("light", theme === "day");
  window.localStorage.setItem("sp-theme", theme);
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === "night" ? "day" : "night";
  setTheme(next);
  return next;
}
