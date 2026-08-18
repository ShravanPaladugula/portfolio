"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const downRef = useRef(false);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const paint = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      if (!dot || !ringEl) {
        raf.current = requestAnimationFrame(paint);
        return;
      }

      const { x, y } = target.current;
      // Dot: hard lock to pointer (no lag)
      dot.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0) scale(${
        downRef.current ? 0.55 : 1
      })`;

      // Ring: very light follow (almost 1:1)
      ring.current.x += (x - ring.current.x) * 0.55;
      ring.current.y += (y - ring.current.y) * 0.55;
      const size = hoverRef.current ? 44 : 28;
      const half = size / 2;
      ringEl.style.width = `${size}px`;
      ringEl.style.height = `${size}px`;
      ringEl.style.opacity = downRef.current ? "0.35" : "0.9";
      ringEl.style.transform = `translate3d(${ring.current.x - half}px, ${
        ring.current.y - half
      }px, 0)`;

      raf.current = requestAnimationFrame(paint);
    };

    raf.current = requestAnimationFrame(paint);

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const onDown = () => {
      downRef.current = true;
    };
    const onUp = () => {
      downRef.current = false;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      hoverRef.current = !!t.closest(
        "a, button, [role='button'], input, textarea, summary, label",
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver);

    return () => {
      cancelAnimationFrame(raf.current);
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
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] will-change-transform mix-blend-difference"
        aria-hidden
      >
        <span className="block h-1.5 w-1.5 rounded-full bg-white" />
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[90] will-change-transform mix-blend-difference"
        aria-hidden
      >
        <span className="block h-full w-full rounded-full border border-white" />
      </div>
    </>
  );
}
