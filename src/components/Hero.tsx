"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { profile } from "@/content/profile";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Hero"
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { y: imageY }}
        aria-hidden
      >
        <Image
          src="/portrait.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[68%_center] opacity-[0.42] saturate-[0.85] contrast-110 sm:object-[72%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/88 to-bg/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/55" />
        <div className="hero-signal absolute inset-0" />
        <div className="tech-grid absolute inset-0 opacity-[0.18]" />
      </motion.div>

      <motion.div
        className="content-wrap relative z-10 flex flex-1 flex-col justify-end px-[clamp(1.25rem,4vw,4rem)] pb-16 pt-28 sm:pb-20 lg:pb-24"
        style={reduce ? undefined : { opacity: contentOpacity }}
      >
        <motion.p
          className="mb-6 font-mono text-xs uppercase tracking-[0.28em] text-accent sm:text-[13px]"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          {profile.role}
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(3.1rem,11vw,8.5rem)] font-bold leading-[0.88] tracking-[-0.04em] text-fg"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block">SHRAVAN</span>
          <span className="block">
            PALADUGULA
            <span className="signal-dot ml-2 inline-block align-middle" aria-hidden />
          </span>
        </motion.h1>

        <motion.div
          className="mt-8 h-px w-full max-w-md overflow-hidden bg-line"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          aria-hidden
        >
          <span className="block h-full w-1/3 bg-accent signal-scan" />
        </motion.div>

        <motion.p
          className="mt-8 max-w-xl font-display text-[clamp(1.35rem,2.6vw,2rem)] font-semibold tracking-tight text-fg"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.42 }}
        >
          {profile.headline}
        </motion.p>

        <motion.p
          className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.52 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.62 }}
        >
          <a
            href="#work"
            className="inline-flex items-center bg-fg px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent hover:text-[color:var(--selection-fg)]"
          >
            See my work
          </a>
          <a
            href={profile.links.resume}
            className="inline-flex items-center border border-fg/45 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Resume
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-fg/45 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
        </motion.div>

        <motion.div
          className="mt-14 flex items-end justify-between gap-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {profile.location}
          </p>
          <a
            href="#about"
            className="group hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent sm:inline-flex"
          >
            Scroll
            <span className="relative h-8 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-3 bg-accent scroll-pip" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
