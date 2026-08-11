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
  const line = invert ? "border-[#cfcfcf]" : "border-line";
  const muted = invert ? "text-[#666]" : "text-muted";
  const fill = invert ? "bg-[#ececec]" : "bg-[#0c0c0c]";

  return (
    <figure className={`group relative ${className}`}>
      <div
        className={`relative overflow-hidden border ${line} ${fill} ${
          aspect === "fill" ? "h-full min-h-[280px]" : aspectClass[aspect]
        }`}
      >
        {/* Corner ticks */}
        <span
          aria-hidden
          className={`pointer-events-none absolute left-0 top-0 z-20 h-4 w-4 border-l border-t ${
            invert ? "border-black" : "border-fg"
          }`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute right-0 top-0 z-20 h-4 w-4 border-r border-t ${
            invert ? "border-black" : "border-fg"
          }`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-0 left-0 z-20 h-4 w-4 border-b border-l ${
            invert ? "border-black" : "border-fg"
          }`}
        />
        <span
          aria-hidden
          className={`pointer-events-none absolute bottom-0 right-0 z-20 h-4 w-4 border-b border-r ${
            invert ? "border-black" : "border-fg"
          }`}
        />

        {!failed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover grayscale contrast-110 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.22em] ${muted}`}
            >
              Photo slot
            </span>
            <span
              className={`font-mono text-[11px] uppercase tracking-[0.14em] ${
                invert ? "text-black/70" : "text-fg/70"
              }`}
            >
              Drop file at {src}
            </span>
          </div>
        )}

        <div
          className={`pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay ${
            invert ? "bg-[radial-gradient(circle_at_30%_20%,#fff,transparent_55%)]" : "bg-[radial-gradient(circle_at_70%_30%,#fff3,transparent_50%)]"
          }`}
        />
      </div>
      {caption && (
        <figcaption
          className={`mt-3 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] ${muted}`}
        >
          <span>{caption}</span>
          <span className="opacity-60">IMG</span>
        </figcaption>
      )}
    </figure>
  );
}
