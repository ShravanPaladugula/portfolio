"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CarGame } from "./CarGame";
import { CommandPalette } from "./CommandPalette";
import { CustomCursor } from "./CustomCursor";
import { StatusDock } from "./StatusDock";
import { ToastProvider, useToast } from "./Toast";

const SECRET_WORD = "vroom";
const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function SiteChromeInner({ children }: { children: ReactNode }) {
  const [commandsOpen, setCommandsOpen] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);
  const { push } = useToast();
  const buffer = useRef("");
  const konami = useRef(0);
  const monogramHits = useRef(0);
  const monogramTimer = useRef(0);

  const openGarage = useCallback(
    (how: string) => {
      setCommandsOpen(false);
      setGarageOpen(true);
      push(how);
    },
    [push],
  );

  useEffect(() => {
    const open = () => setCommandsOpen(true);
    const openGarageEvent = () => openGarage("Garage unlocked");
    window.addEventListener("sp-open-commands", open);
    window.addEventListener("sp-open-garage", openGarageEvent);
    return () => {
      window.removeEventListener("sp-open-commands", open);
      window.removeEventListener("sp-open-garage", openGarageEvent);
    };
  }, [openGarage]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (garageOpen) return;
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      const expected = KONAMI[konami.current];
      const keyMatch =
        e.key === expected ||
        e.key.toLowerCase() === String(expected).toLowerCase();
      if (keyMatch) {
        konami.current += 1;
        if (konami.current >= KONAMI.length) {
          konami.current = 0;
          openGarage("Konami cleared · garage open");
        }
      } else if (e.key === "ArrowUp") {
        konami.current = 1;
      } else {
        konami.current = 0;
      }

      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (/^[a-z]$/i.test(e.key)) {
        buffer.current = (buffer.current + e.key.toLowerCase()).slice(
          -SECRET_WORD.length,
        );
        if (buffer.current === SECRET_WORD) {
          buffer.current = "";
          openGarage("Vroom · garage open");
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [garageOpen, openGarage]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = e.target as HTMLElement | null;
      if (!el?.closest?.("[data-secret-monogram]")) return;
      monogramHits.current += 1;
      window.clearTimeout(monogramTimer.current);
      monogramTimer.current = window.setTimeout(() => {
        monogramHits.current = 0;
      }, 1400);
      if (monogramHits.current >= 5) {
        monogramHits.current = 0;
        openGarage("Monogram override · garage open");
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [openGarage]);

  return (
    <>
      <CustomCursor />
      {children}
      <StatusDock onOpenCommands={() => setCommandsOpen(true)} />
      <CommandPalette open={commandsOpen} onOpenChange={setCommandsOpen} />
      <CarGame open={garageOpen} onClose={() => setGarageOpen(false)} />
    </>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SiteChromeInner>{children}</SiteChromeInner>
    </ToastProvider>
  );
}
