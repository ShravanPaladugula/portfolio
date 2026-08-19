"use client";

import { useEffect, useState } from "react";

/** Mac uses ⌘K; Windows/Linux use Ctrl+Shift+K (Ctrl+K is taken by Chrome). */
export function getCommandShortcutLabel(isMac: boolean) {
  return isMac ? "⌘K" : "Ctrl+Shift+K";
}

export function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform) || navigator.userAgent.includes("Mac"));
  }, []);

  return isMac;
}

export function isCommandPaletteHotkey(e: KeyboardEvent) {
  const key = e.key.toLowerCase();
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform) || navigator.userAgent.includes("Mac");

  if (isMac) {
    return e.metaKey && !e.ctrlKey && !e.altKey && key === "k";
  }

  // Windows/Linux: Ctrl+Shift+K (Ctrl+K is claimed by Chrome omnibox)
  return e.ctrlKey && e.shiftKey && !e.metaKey && !e.altKey && key === "k";
}
