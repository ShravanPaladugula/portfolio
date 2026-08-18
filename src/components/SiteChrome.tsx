"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";
import { CustomCursor } from "./CustomCursor";
import { StatusDock } from "./StatusDock";
import { ToastProvider } from "./Toast";

export function SiteChrome({ children }: { children: ReactNode }) {
  const [commandsOpen, setCommandsOpen] = useState(false);

  useEffect(() => {
    const open = () => setCommandsOpen(true);
    window.addEventListener("sp-open-commands", open);
    return () => window.removeEventListener("sp-open-commands", open);
  }, []);

  return (
    <ToastProvider>
      <CustomCursor />
      {children}
      <StatusDock onOpenCommands={() => setCommandsOpen(true)} />
      <CommandPalette open={commandsOpen} onOpenChange={setCommandsOpen} />
    </ToastProvider>
  );
}
