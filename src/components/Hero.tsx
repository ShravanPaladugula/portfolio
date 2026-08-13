"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { profile } from "@/content/profile";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative overflow-hidden" aria-label="Hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-bg" />
        <div className="tech-grid absolute inset-0 opacity-20" />
      </div>

      <div className="content-wrap relative z-10 grid grid-cols-1 items-center gap-10 px-[clamp(1.25rem,4vw,4rem)] pb-20 pt-28 lg:grid-cols-[1fr_220px] lg:gap-14 lg:pb-24 lg:pt-32">
        <div>
          <motion.p
            className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-muted sm:text-[13px]"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {profile.role}
          </motion.p>

          <motion.h1
            className="font-display text-[clamp(2.5rem,6.5vw,4.5rem)] font-bold leading-[0.96] tracking-[-0.03em] text-fg"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18 }}
          >
            <span className="block">SHRAVAN</span>
            <span className="block">PALADUGULA</span>
          </motion.h1>

          <motion.p
            className="mt-8 max-w-xl font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {profile.headline}
          </motion.p>

          <motion.p
            className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <a
              href="#work"
              className="inline-flex items-center bg-fg px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent hover:text-[color:var(--selection-fg)]"
            >
              See my work
            </a>
            <a
              href={profile.links.resume}
              className="inline-flex items-center border border-fg/50 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Resume
            </a>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-fg/50 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
            >
              GitHub
            </a>
          </motion.div>

          <motion.p
            className="mt-10 font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.7 }}
          >
            {profile.location}
          </motion.p>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-[220px] lg:mx-0 lg:justify-self-end"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28 }}
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-line bg-[color-mix(in_oklab,var(--bg)_92%,var(--fg))]">
            <Image
              src="/portrait.jpg"
              alt={profile.name}
              fill
              priority
              className="object-cover object-center"
              sizes="220px"
            />
            <span className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-accent" />
            <span className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-fg" />
            <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-fg" />
            <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
