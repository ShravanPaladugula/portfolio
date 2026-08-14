"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { experience, leadership, type ExperienceItem } from "@/content/experience";
import { SectionLabel } from "./SectionLabel";

export function Path() {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  const items = [...experience, ...leadership];

  return (
    <section
      id="path"
      className="relative overflow-hidden section-pad"
      aria-label="Experience and leadership"
    >
      <div className="content-wrap relative z-10">
        <SectionLabel index="04" label="Path" />
        <motion.h2
          className="mb-12 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Experience & leadership.
        </motion.h2>

        <div>
          {items.map((item, i) => (
            <PathRow
              key={item.id}
              item={item}
              index={i}
              open={openId === item.id}
              onToggle={() =>
                setOpenId((cur) => (cur === item.id ? null : item.id))
              }
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PathRow({
  item,
  index,
  open,
  onToggle,
  reduce,
}: {
  item: ExperienceItem;
  index: number;
  open: boolean;
  onToggle: () => void;
  reduce: boolean;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <div className="border-t border-line last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 py-7 text-left transition-colors hover:bg-fg/[0.03] sm:py-8"
      >
        <div className="flex min-w-0 gap-4 sm:gap-8">
          <span className="shrink-0 pt-1 font-mono text-[11px] text-muted">
            {num}
          </span>
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              {item.role}
            </h3>
            <p className="mt-1 text-muted">{item.org}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              {item.when}
              {item.place ? ` · ${item.place}` : ""}
            </p>
          </div>
        </div>
        <span className={`mt-1 shrink-0 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${open ? "text-accent" : "text-muted"}`}>
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 pb-8 pl-0 sm:pl-12 md:pl-16">
              {item.bullets.map((b) => (
                <li
                  key={b}
                  className="flex gap-3 text-sm leading-relaxed text-fg/85 sm:text-[15px]"
                >
                  <span className="mt-2 h-px w-3 shrink-0 bg-muted" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            {item.tools && (
              <div className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-line pt-4 pl-0 sm:pl-12 md:pl-16">
                <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Tools
                </span>
                {item.tools.map((t, i) => (
                  <span key={t} className="contents">
                    {i > 0 && (
                      <span className="font-mono text-[11px] text-line" aria-hidden>
                        /
                      </span>
                    )}
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg/80">
                      {t}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
