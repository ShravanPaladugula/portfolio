type SectionLabelProps = {
  index: string;
  label: string;
  invert?: boolean;
};

export function SectionLabel({ index, label, invert }: SectionLabelProps) {
  return (
    <div
      className={`mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] ${
        invert ? "text-[color:var(--invert-muted)]" : "text-muted"
      }`}
    >
      <span className="text-accent">{index}</span>
      <span className="h-px w-8 bg-accent" />
      <span>{label}</span>
    </div>
  );
}

/** Single-accent seam between dark / light bands. */
export function ColorSeam() {
  return (
    <div aria-hidden className="relative h-px w-full overflow-hidden bg-line">
      <div className="absolute inset-y-0 left-[8%] w-[28%] max-w-[280px] bg-accent seam-pulse" />
    </div>
  );
}
