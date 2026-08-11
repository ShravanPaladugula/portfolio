"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { projects } from "@/content/projects";
import { SectionLabel } from "./SectionLabel";
import { ProjectPanel } from "./ProjectPanel";

export function Work() {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);
  const reduce = useReducedMotion();
  const featured = projects.slice(0, 4);

  return (
    <section
      id="work"
      className="relative overflow-hidden section-pad !pt-0"
      aria-label="Selected work"
    >
      {/* Featured visual rail */}
      <div className="relative z-10 border-y border-line bg-[color-mix(in_oklab,var(--bg)_92%,var(--fg))]">
        <div className="mx-auto max-w-[1500px] px-[clamp(1.25rem,4vw,4rem)] py-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Featured frames · replace files in /public/projects
            </p>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
              Scroll →
            </p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featured.map((project, i) => (
              <motion.button
                key={project.id}
                type="button"
                onClick={() => {
                  setOpenId(project.id);
                  document
                    .getElementById(`project-${project.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="group relative w-[min(78vw,420px)] shrink-0 text-left"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <div className="relative aspect-[16/10] overflow-hidden border border-line">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
                    sizes="420px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {String(i + 1).padStart(2, "0")} · {project.year}
                    </p>
                    <p className="mt-1 font-display text-xl font-bold tracking-tight">
                      {project.name}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-[clamp(1.25rem,4vw,4rem)] pt-[clamp(4.5rem,10vw,7rem)]">
        <SectionLabel index="02" label="Selected Work" />
        <motion.h2
          className="mb-4 max-w-3xl font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Build notes, problems, and iterations.
        </motion.h2>
        <p className="mb-12 max-w-xl text-muted">
          Every project has a photo slot and a full build dossier. Drop your
          hardware shots into{" "}
          <span className="text-fg/80">/public/projects</span>.
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
