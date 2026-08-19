"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { isCommandPaletteHotkey, useIsMac, getCommandShortcutLabel } from "@/lib/hotkeys";
import { toggleTheme } from "@/lib/theme";
import { useToast } from "./Toast";

type Command = {
  id: string;
  label: string;
  hint: string;
  group: string;
  run: () => void;
};

type CommandPaletteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { push } = useToast();
  const isMac = useIsMac();
  const shortcut = getCommandShortcutLabel(isMac);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "about",
        label: "Go to About",
        hint: "#about",
        group: "Navigate",
        run: () => scrollToId("about"),
      },
      {
        id: "work",
        label: "Go to Work",
        hint: "#work",
        group: "Navigate",
        run: () => scrollToId("work"),
      },
      {
        id: "lab",
        label: "Go to Lab",
        hint: "#lab",
        group: "Navigate",
        run: () => scrollToId("lab"),
      },
      {
        id: "path",
        label: "Go to Path",
        hint: "#path",
        group: "Navigate",
        run: () => scrollToId("path"),
      },
      {
        id: "contact",
        label: "Go to Contact",
        hint: "#contact",
        group: "Navigate",
        run: () => scrollToId("contact"),
      },
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        label: `Open ${p.name}`,
        hint: p.award ?? p.year,
        group: "Projects",
        run: () => scrollToId(`project-${p.id}`),
      })),
      {
        id: "copy-email",
        label: "Copy email",
        hint: profile.email,
        group: "Actions",
        run: async () => {
          await navigator.clipboard.writeText(profile.email);
          push("Email copied");
        },
      },
      {
        id: "resume",
        label: "Open resume",
        hint: "PDF",
        group: "Actions",
        run: () => window.open(profile.links.resume, "_blank"),
      },
      {
        id: "github",
        label: "Open GitHub",
        hint: "ShravanPaladugula",
        group: "Actions",
        run: () => window.open(profile.links.github, "_blank"),
      },
      {
        id: "linkedin",
        label: "Open LinkedIn",
        hint: "Profile",
        group: "Actions",
        run: () => window.open(profile.links.linkedin, "_blank"),
      },
      {
        id: "theme",
        label: "Toggle day / night",
        hint: "Theme",
        group: "Actions",
        run: () => {
          const next = toggleTheme();
          push(next === "day" ? "Day mode" : "Night mode");
          window.dispatchEvent(new Event("sp-theme-change"));
        },
      },
    ],
    [push],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setIndex(0);
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isCommandPaletteHotkey(e)) {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[index];
        if (cmd) {
          onOpenChange(false);
          cmd.run();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, filtered, index]);

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    for (const cmd of filtered) {
      const list = map.get(cmd.group) ?? [];
      list.push(cmd);
      map.set(cmd.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  let flat = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden border border-line bg-bg shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                {shortcut}
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump, open, copy, toggle…"
                className="w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-muted"
              />
              <kbd className="hidden border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:inline">
                esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  No matches
                </p>
              ) : (
                groups.map(([group, items]) => (
                  <div key={group} className="mb-2">
                    <p className="px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                      {group}
                    </p>
                    <ul>
                      {items.map((cmd) => {
                        flat += 1;
                        const active = flat === index;
                        const current = flat;
                        return (
                          <li key={cmd.id}>
                            <button
                              type="button"
                              onMouseEnter={() => setIndex(current)}
                              onClick={() => {
                                onOpenChange(false);
                                cmd.run();
                              }}
                              className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors ${
                                active
                                  ? "bg-accent text-[color:var(--selection-fg)]"
                                  : "text-fg hover:bg-fg/[0.04]"
                              }`}
                            >
                              <span className="font-display text-sm font-semibold tracking-tight sm:text-base">
                                {cmd.label}
                              </span>
                              <span
                                className={`truncate font-mono text-[10px] uppercase tracking-[0.14em] ${
                                  active ? "opacity-70" : "text-muted"
                                }`}
                              >
                                {cmd.hint}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
