"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, summary, label",
      );
      setHover(!!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduce]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
        aria-hidden
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          scale: down ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.4 }}
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
        aria-hidden
        animate={{
          x: pos.x - (hover ? 22 : 16),
          y: pos.y - (hover ? 22 : 16),
          width: hover ? 44 : 32,
          height: hover ? 44 : 32,
          opacity: down ? 0.35 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.5 }}
      >
        <span className="block h-full w-full rounded-full border border-white" />
      </motion.div>
    </>
  );
}
