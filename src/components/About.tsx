"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { PhotoSlot } from "./PhotoSlot";
import { SectionLabel } from "./SectionLabel";

export function About() {
  const reduce = useReducedMotion();

  return (
    <section className="band-invert section-pad" id="about" aria-label="About">
      <div className="mx-auto max-w-[1500px]">
        <SectionLabel index="01" label="About" invert accent="#FF3B1F" />

        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <motion.h2
              className="max-w-xl font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              {profile.about.title}
            </motion.h2>

            <div className="mt-8 flex max-w-xl flex-col gap-5 text-base leading-relaxed text-[color:var(--invert-muted)] sm:text-lg">
              {profile.about.paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div
              className="mt-10 grid grid-cols-2 gap-4 border-t border-[color:var(--invert-line)] pt-8 sm:max-w-md"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--invert-muted)]">
                  Focus
                </p>
                <p className="mt-2 font-display text-lg font-semibold tracking-tight">
                  Embedded · Edge AI · Fabrication
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--invert-muted)]">
                  Next
                </p>
                <p className="mt-2 font-display text-lg font-semibold tracking-tight">
                  UC San Diego CE
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <PhotoSlot
              src="/about.jpg"
              alt="Workspace and build environment"
              caption="Slot · /public/about.jpg — lab, bench, or candid build shot"
              aspect="portrait"
              invert
              className="max-w-xl lg:ml-auto"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
