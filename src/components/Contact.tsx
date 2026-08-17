"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { SectionLabel } from "./SectionLabel";

const links = [
  { label: "Email", href: `mailto:${profile.email}`, value: profile.email },
  { label: "Phone", href: `tel:${profile.phone.replace(/\D/g, "")}`, value: profile.phone },
  { label: "LinkedIn", href: profile.links.linkedin, value: "shravan-paladugula" },
  { label: "GitHub", href: profile.links.github, value: "ShravanPaladugula" },
  { label: "Devpost", href: profile.links.devpost, value: "ShravanPaladugula" },
  { label: "Resume", href: profile.links.resume, value: "PDF" },
];

export function Contact() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      className="relative overflow-hidden section-pad"
      aria-label="Contact"
    >
      <div
        className="pointer-events-none absolute -right-8 top-8 select-none font-display text-[clamp(8rem,28vw,22rem)] font-bold leading-none tracking-[-0.06em] text-fg/[0.035]"
        aria-hidden
      >
        SP
      </div>
      <div className="content-wrap relative z-10">
        <SectionLabel index="08" label="Contact" />
        <motion.h2
          className="mb-6 max-w-3xl font-display text-[clamp(2rem,5vw,3.75rem)] font-bold leading-[1.02] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Let’s build the next <span className="text-accent">system.</span>
        </motion.h2>
        <p className="mb-8 max-w-xl text-muted">
          Open to software engineering internships and embedded / firmware roles.
          Reach out directly.
        </p>

        <motion.a
          href={`mailto:${profile.email}`}
          className="group mb-14 inline-flex flex-col gap-2 border-b border-accent pb-3"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Primary
          </span>
          <span className="font-display text-[clamp(1.35rem,3.5vw,2.5rem)] font-bold tracking-tight transition-colors group-hover:text-accent">
            {profile.email}
          </span>
        </motion.a>

        <ul className="grid gap-0 border-t border-line sm:grid-cols-2">
          {links.map((link, i) => (
            <motion.li
              key={link.label}
              className="border-b border-line sm:odd:border-r"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <a
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="group flex items-baseline justify-between gap-4 px-1 py-6 transition-colors hover:bg-fg/[0.03] sm:px-4"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {link.label}
                </span>
                <span className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-xl">
                  {link.value}
                </span>
              </a>
            </motion.li>
          ))}
        </ul>

        <footer className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <a
            href="#top"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
          >
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
