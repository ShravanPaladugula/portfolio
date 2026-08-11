type SectionLabelProps = {
  index: string;
  label: string;
  invert?: boolean;
  accent?: string;
};

export function SectionLabel({
  index,
  label,
  invert,
  accent = "#00E5FF",
}: SectionLabelProps) {
  return (
    <div
      className={`mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${
        invert ? "text-[color:var(--invert-muted)]" : "text-muted"
      }`}
    >
      <span style={{ color: accent }}>{index}</span>
      <span className="h-px w-8" style={{ background: accent }} />
      <span>{label}</span>
    </div>
  );
}

/** Thin colored seam between sections — quiet color rhythm, not paint blobs. */
export function ColorSeam({ color }: { color: string }) {
  return (
    <div aria-hidden className="relative h-px w-full overflow-hidden">
      <div className="absolute inset-0 bg-line" />
      <div
        className="absolute inset-y-0 left-[8%] w-[28%] max-w-xs"
        style={{ background: color }}
      />
      <div
        className="absolute inset-y-0 right-[18%] w-2"
        style={{ background: color, opacity: 0.55 }}
      />
    </div>
  );
}
