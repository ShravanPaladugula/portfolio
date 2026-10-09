import { profile } from "@/content/profile";

export function About() {
  return (
    <section id="about" className="wrap section">
      <div className="rule">
        <h2 className="label label-fg">About</h2>
      </div>

      <div className="grid gap-x-14 gap-y-7 lg:grid-cols-[1fr_1.5fr]">
        <h3 className="headline max-w-[16ch] text-[clamp(1.625rem,4vw,2.5rem)]">
          Engineering starts where code meets matter.
        </h3>

        <div className="space-y-4.5">
          {profile.about.map((p) => (
            <p
              key={p}
              className="max-w-[62ch] text-[1.0125rem] leading-[1.7]"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
