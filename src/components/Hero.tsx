"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { profile } from "@/content/profile";

const first = "SHRAVAN".split("");
const last = "PALADUGULA".split("");

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(70);
  const my = useMotionValue(40);
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${mx}% ${my}%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 55%)`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={ref}
      id="top"
      onMouseMove={onMove}
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
          className="object-cover object-[70%_center] opacity-[0.48] saturate-[0.9] contrast-[1.08] sm:object-[74%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-bg/60" />
        <motion.div className="absolute inset-0" style={{ background: spotlight }} />
        <div className="tech-grid absolute inset-0 opacity-[0.16]" />
        <div className="hero-scanlines absolute inset-0 opacity-[0.04]" />
      </motion.div>

      <motion.div
        className="content-wrap relative z-10 flex flex-1 flex-col justify-end px-[clamp(1.25rem,4vw,4rem)] pb-16 pt-28 sm:pb-20 lg:pb-28"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-accent sm:text-[13px]"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          {profile.role}
        </motion.p>

        <h1 className="font-display text-[clamp(3.25rem,12vw,9rem)] font-bold leading-[0.86] tracking-[-0.045em] text-fg">
          <span className="block overflow-hidden">
            {first.map((ch, i) => (
              <motion.span
                key={`f-${ch}-${i}`}
                className="inline-block"
                initial={reduce ? false : { y: "110%", rotate: 4 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.12 + i * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
          <span className="mt-1 block overflow-hidden">
            {last.map((ch, i) => (
              <motion.span
                key={`l-${ch}-${i}`}
                className="inline-block"
                initial={reduce ? false : { y: "110%", rotate: 4 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.28 + i * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              className="signal-dot ml-3 inline-block align-middle"
              aria-hidden
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.85, type: "spring", stiffness: 260, damping: 18 }}
            />
          </span>
        </h1>

        <motion.div
          className="mt-8 h-px w-full max-w-lg overflow-hidden bg-line"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          aria-hidden
        >
          <span className="block h-full w-1/3 bg-accent signal-scan" />
        </motion.div>

        <motion.p
          className="mt-8 max-w-xl font-display text-[clamp(1.4rem,2.8vw,2.15rem)] font-semibold tracking-tight text-fg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.58 }}
        >
          {profile.headline}
        </motion.p>

        <motion.p
          className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.68 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.78 }}
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
            href={`mailto:${profile.email}`}
            className="inline-flex items-center border border-fg/45 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Email
          </a>
        </motion.div>

        <motion.div
          className="mt-14 flex items-end justify-between gap-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.95 }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {profile.location}
          </p>
          <a
            href="#about"
            className="group hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent sm:inline-flex"
          >
            Enter
            <span className="relative h-8 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-3 bg-accent scroll-pip" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
