"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { SectionLabel } from "./SectionLabel";

export function Education() {
  const reduce = useReducedMotion();

  return (
    <section
      className="band-invert relative overflow-hidden section-pad"
      id="education"
      aria-label="Education"
    >
      <div className="content-wrap relative z-10">
        <SectionLabel index="07" label="Education" invert />
        <motion.h2
          className="mb-12 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Training ground.
        </motion.h2>

        <ul className="divide-y divide-[color:var(--invert-line)] border-y border-[color:var(--invert-line)]">
          {profile.education.map((edu, i) => (
            <motion.li
              key={edu.school}
              className="grid gap-3 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-10"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                  {edu.school}
                </h3>
                <p className="mt-2 text-[color:var(--invert-muted)]">{edu.detail}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--invert-muted)]">
                  {edu.place}
                </p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {edu.when}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
