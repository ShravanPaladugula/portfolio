"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { SectionLabel } from "./SectionLabel";

const columns = [
  { key: "embedded", title: "Embedded & Hardware", items: profile.systems.embedded },
  { key: "firmware", title: "Firmware & Systems", items: profile.systems.firmware },
  { key: "fullstack", title: "Full-Stack & Edge AI", items: profile.systems.fullstack },
] as const;

export function Systems() {
  const reduce = useReducedMotion();

  return (
    <section
      className="band-invert relative overflow-hidden section-pad"
      id="systems"
      aria-label="Systems"
    >
      <div className="content-wrap relative z-10">
        <SectionLabel index="03" label="Systems" invert />
        <motion.h2
          className="mb-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Inventory of what I ship with.
        </motion.h2>
        <p className="mb-12 max-w-xl text-[color:var(--invert-muted)]">
          From board bring-up to production software — the stack behind the builds.
        </p>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {columns.map((col, i) => (
            <motion.div
              key={col.key}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <h3 className="mb-5 border-b border-[color:var(--invert-line)] pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--invert-muted)]">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-sm sm:text-[15px]"
                  >
                    <span className="font-mono text-[10px] text-accent">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
