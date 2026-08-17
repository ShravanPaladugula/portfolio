"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/content/projects";
import { SectionLabel } from "./SectionLabel";
import { ProjectPanel } from "./ProjectPanel";

export function Work() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const featured = projects.slice(0, 4);
  const stageId = hoverId ?? openId ?? projects[0]?.id;
  const stage = projects.find((p) => p.id === stageId) ?? projects[0];

  return (
    <section id="work" className="relative overflow-hidden" aria-label="Selected work">
      <div className="relative z-10 border-y border-line bg-[color-mix(in_oklab,var(--bg)_94%,var(--fg))]">
        <div className="content-wrap grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[280px] overflow-hidden border-b border-line lg:min-h-[420px] lg:border-b-0 lg:border-r">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={stage.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                    Now viewing · {stage.year}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    {stage.name}
                  </p>
                  {stage.award && (
                    <p className="mt-2 max-w-md font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {stage.award}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col justify-between px-[clamp(1.25rem,4vw,2.5rem)] py-7">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                Featured work
              </p>
              <ul className="space-y-1">
                {featured.map((project, i) => {
                  const active = stage.id === project.id;
                  return (
                    <li key={project.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setHoverId(project.id)}
                        onMouseLeave={() => setHoverId(null)}
                        onFocus={() => setHoverId(project.id)}
                        onBlur={() => setHoverId(null)}
                        onClick={() => {
                          setOpenId(project.id);
                          document
                            .getElementById(`project-${project.id}`)
                            ?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`group flex w-full items-baseline justify-between gap-4 border-b border-line py-3.5 text-left transition-colors ${
                          active ? "text-fg" : "text-muted hover:text-fg"
                        }`}
                      >
                        <span className="flex min-w-0 items-baseline gap-3">
                          <span className="font-mono text-[10px] text-muted">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-display text-xl font-bold tracking-tight sm:text-2xl ${
                              active ? "text-accent" : ""
                            }`}
                          >
                            {project.name}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em]">
                          {project.year}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Hover to preview · Click to open dossier
            </p>
          </div>
        </div>
      </div>

      <div className="section-pad content-wrap">
        <SectionLabel index="02" label="Selected Work" />
        <motion.h2
          className="mb-4 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Build notes, problems, and iterations.
        </motion.h2>
        <p className="mb-12 max-w-xl text-muted">
          Open a project for the full build dossier — what shipped, what broke,
          and how it got better.
        </p>

        <div>
          {projects.map((project, i) => (
            <div key={project.id} id={`project-${project.id}`}>
              <ProjectPanel
                project={project}
                index={i}
                open={openId === project.id}
                onToggle={() =>
                  setOpenId((cur) => (cur === project.id ? null : project.id))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
