/** Quiet section-level color cues — marks, not paint floods. */
export const accents = {
  about: "#FF3B1F",
  work: "#00E5FF",
  systems: "#B8FF3C",
  path: "#FF2D95",
  awards: "#FFE600",
  lab: "#7A5CFF",
  education: "#FF8A3D",
  contact: "#00E5FF",
} as const;

type MarkProps = {
  color: string;
  variant?: "corner" | "dash" | "dot" | "bar";
};

export function ColorMark({ color, variant = "corner" }: MarkProps) {
  if (variant === "dot") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute right-[6%] top-[10%] h-2 w-2 rounded-full"
          style={{ background: color }}
        />
        <span
          className="absolute left-[5%] bottom-[14%] h-1.5 w-1.5 rounded-full opacity-70"
          style={{ background: color }}
        />
      </div>
    );
  }

  if (variant === "dash") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute right-[7%] top-[12%] h-1 w-8 rotate-[-18deg]"
          style={{ background: color }}
        />
        <span
          className="absolute left-[6%] bottom-[16%] h-1 w-5 rotate-[12deg] opacity-80"
          style={{ background: color }}
        />
      </div>
    );
  }

  if (variant === "bar") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span
          className="absolute left-0 top-[18%] h-16 w-1 sm:h-24"
          style={{ background: color }}
        />
      </div>
    );
  }

  /* corner */
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span
        className="absolute right-4 top-4 h-8 w-8 border-r border-t sm:right-8 sm:top-8"
        style={{ borderColor: color }}
      />
      <span
        className="absolute bottom-4 left-4 h-6 w-6 border-b border-l opacity-70 sm:bottom-8 sm:left-8"
        style={{ borderColor: color }}
      />
    </div>
  );
}
