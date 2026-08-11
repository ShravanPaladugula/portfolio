"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhotoSlot } from "./PhotoSlot";
import { SectionLabel } from "./SectionLabel";

const frames = [
  {
    src: "/gallery/01.jpg",
    caption: "01 · Bench / print farm",
    aspect: "video" as const,
    span: "md:col-span-2",
  },
  {
    src: "/gallery/02.jpg",
    caption: "02 · Hardware close-up",
    aspect: "square" as const,
    span: "",
  },
  {
    src: "/gallery/03.jpg",
    caption: "03 · Field / drone",
    aspect: "square" as const,
    span: "",
  },
  {
    src: "/gallery/05.jpg",
    caption: "05 · Portrait alternate",
    aspect: "portrait" as const,
    span: "md:row-span-2",
  },
  {
    src: "/gallery/04.jpg",
    caption: "04 · Event / demo",
    aspect: "video" as const,
    span: "md:col-span-2",
  },
  {
    src: "/gallery/06.jpg",
    caption: "06 · CAD / fab detail",
    aspect: "video" as const,
    span: "md:col-span-2",
  },
];

export function Gallery() {
  const reduce = useReducedMotion();

  return (
    <section
      id="lab"
      className="relative overflow-hidden section-pad border-t border-line"
      aria-label="Lab gallery"
    >
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <SectionLabel index="06" label="Lab" />
        <motion.h2
          className="mb-4 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          Frames from the build floor.
        </motion.h2>
        <p className="mb-12 max-w-xl text-muted">
          Photo slots for printers, PCBs, demos, and team shots. Replace files in{" "}
          <span className="text-fg/80">/public/gallery</span>.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-5">
          {frames.map((frame, i) => (
            <motion.div
              key={frame.src}
              className={frame.span}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.25) }}
            >
              <PhotoSlot
                src={frame.src}
                alt={frame.caption}
                caption={frame.caption}
                aspect={frame.aspect}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
