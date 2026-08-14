"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { PhotoSlot } from "./PhotoSlot";

type ProjectPanelProps = {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
};

export function ProjectPanel({
  project,
  index,
  open,
  onToggle,
}: ProjectPanelProps) {
  const reduce = useReducedMotion();
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="border-t border-line last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group grid w-full grid-cols-1 items-center gap-6 py-7 text-left transition-colors hover:bg-fg/[0.03] sm:py-8 lg:grid-cols-[160px_1fr_auto]"
      >
        <div className="relative hidden aspect-[4/3] overflow-hidden border border-line bg-[color-mix(in_oklab,var(--bg)_92%,var(--fg))] lg:block">
          <Image
            src={project.image}
            alt=""
            fill
            className="object-cover grayscale contrast-110 transition-[transform,filter] duration-500 group-hover:scale-105 group-hover:grayscale-0"
            sizes="160px"
          />
          <span className="absolute left-2 top-2 font-mono text-[9px] uppercase tracking-[0.18em] text-fg/80">
            {num}
          </span>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[11px] text-muted lg:hidden">
              {num}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {project.name}
            </h3>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {project.year}
            </span>
          </div>
          {project.award && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {project.award}
            </p>
          )}
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {project.summary}
          </p>
        </div>

        <span
          className={`shrink-0 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-accent ${
            open ? "text-accent" : ""
          }`}
        >
          {open ? "Close −" : "Open +"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-4 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
              <PhotoSlot
                src={project.image}
                alt={`${project.name} build photo`}
                caption={project.imageCaption}
                aspect="video"
              />
              <div className="grid gap-8 content-start">
                <DossierBlock title="What I built" body={project.built} />
                <DossierBlock title="The problem" body={project.problem} />
                <DossierBlock title="How I improved it" body={project.improved} />
              </div>
            </div>

            <div className="mb-10 mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-line pt-5">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Tools
              </span>
              {project.tools.map((tool, i) => (
                <span key={tool} className="contents">
                  {i > 0 && (
                    <span className="font-mono text-[11px] text-line" aria-hidden>
                      /
                    </span>
                  )}
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-fg/80">
                    {tool}
                  </span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function DossierBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-fg/85 sm:text-[15px]">{body}</p>
    </div>
  );
}
