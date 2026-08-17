"use client";

const items = [
  "CONJR",
  "CHEHRA",
  "Rosetta MD",
  "PillWatch",
  "GestAR",
  "Embedded",
  "Edge AI",
  "Firmware",
  "Fabrication",
  "UC San Diego",
];

export function SignalMarquee() {
  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-line bg-[color-mix(in_oklab,var(--bg)_94%,var(--fg))]"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div className="marquee-track flex w-max gap-0 py-4">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.24em] text-muted"
          >
            <span className="text-accent">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
