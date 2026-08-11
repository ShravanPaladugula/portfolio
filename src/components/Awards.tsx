"use client";

import { motion, useReducedMotion } from "framer-motion";
import { awards } from "@/content/experience";
import { accents, ColorMark } from "./ColorMark";
import { SectionLabel } from "./SectionLabel";

export function Awards() {
  const reduce = useReducedMotion();

  return (
    <section
      className="band-invert relative overflow-hidden section-pad"
      id="awards"
      aria-label="Awards"
    >
      <ColorMark color={accents.awards} variant="corner" />
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionLabel index="05" label="Awards" invert accent={accents.awards} />
        <motion.h2
          className="mb-12 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Recognition.
        </motion.h2>

        <ul className="divide-y divide-[color:var(--invert-line)] border-y border-[color:var(--invert-line)]">
          {awards.map((award, i) => (
            <motion.li
              key={award.title}
              className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
            >
              <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                {award.title}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--invert-muted)]">
                {award.detail}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
