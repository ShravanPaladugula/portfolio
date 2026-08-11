"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { accents, ColorMark } from "./ColorMark";
import { SectionLabel } from "./SectionLabel";

export function Education() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden section-pad"
      id="education"
      aria-label="Education"
    >
      <ColorMark color={accents.education} variant="bar" />
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <SectionLabel index="07" label="Education" accent={accents.education} />
        <motion.h2
          className="mb-12 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Training ground.
        </motion.h2>

        <div className="grid gap-8 md:grid-cols-2">
          {profile.education.map((edu, i) => (
            <motion.div
              key={edu.school}
              className="border border-line p-6 sm:p-8"
              style={{ borderTopColor: accents.education, borderTopWidth: 2 }}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {edu.when}
              </p>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
                {edu.school}
              </h3>
              <p className="mt-3 text-muted">{edu.detail}</p>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {edu.place}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
