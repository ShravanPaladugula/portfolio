import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" className="wrap section">
      <div className="rule">
        <span className="eyebrow">About</span>
      </div>

      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="max-w-[18ch] font-serif text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.08] tracking-[-0.015em]">
          Engineering starts where code meets matter.
        </h2>

        <div className="space-y-5">
          {profile.about.map((p) => (
            <p key={p} className="max-w-[62ch] leading-[1.75]">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
