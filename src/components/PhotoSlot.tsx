"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";

type PhotoSlotProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  invert?: boolean;
  aspect?: "video" | "portrait" | "square" | "wide" | "fill";
};

const aspectClass = {
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[21/9]",
  fill: "h-full w-full",
};

export function PhotoSlot({
  src,
  alt,
  caption,
  className = "",
  priority,
  invert,
  aspect = "video",
}: PhotoSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const tick = invert
    ? "border-[color:var(--invert-fg)]"
    : "border-fg";
  const line = invert
    ? "border-[color:var(--invert-line)]"
    : "border-line";
  const muted = invert
    ? "text-[color:var(--invert-muted)]"
    : "text-muted";
  const fill = invert
    ? "bg-[color-mix(in_oklab,var(--invert)_92%,var(--invert-fg))]"
    : "bg-[color-mix(in_oklab,var(--bg)_92%,var(--fg))]";

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      ry: (px - 0.5) * 10,
      rx: (0.5 - py) * 8,
    });
  }

  function onLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <figure className={`group relative [perspective:1000px] ${className}`}>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
        className={`relative overflow-hidden border transition-transform duration-200 ease-out will-change-transform ${line} ${fill} ${
          aspect === "fill" ? "h-full min-h-[280px]" : aspectClass[aspect]
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 z-20 h-4 w-4 border-l border-t ${tick}`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute right-0 top-0 z-20 h-4 w-4 border-r border-t ${tick}`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-0 left-0 z-20 h-4 w-4 border-b border-l ${tick}`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-0 right-0 z-20 h-4 w-4 border-b border-r ${tick}`}
        />

        {!failed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover grayscale contrast-110 transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.22em] ${muted}`}
            >
              Image unavailable
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption
          className={`mt-3 font-mono text-[10px] uppercase tracking-[0.18em] ${muted}`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
