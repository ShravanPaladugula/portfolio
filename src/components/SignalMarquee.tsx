"use client";

const items = [
  "Embedded",
  "Edge AI",
  "Firmware",
  "Fabrication",
  "PCB",
  "ESP32",
  "OpenCV",
  "Full-stack",
  "KiCAD",
  "UC San Diego",
];

export function SignalMarquee() {
  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-line bg-[color-mix(in_oklab,var(--bg)_94%,var(--fg))]"
      aria-hidden
    >
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
