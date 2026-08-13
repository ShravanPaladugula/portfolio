"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [failed, setFailed] = useState(false);
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

  return (
    <figure className={`group relative ${className}`}>
      <div
        className={`relative overflow-hidden border ${line} ${fill} ${
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
