import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="top" className="wrap pt-14 pb-16 sm:pt-20 sm:pb-24">
      <p className="eyebrow">{profile.role}</p>

      <h1 className="mt-5 max-w-[16ch] font-serif text-[clamp(2.75rem,8.5vw,5.5rem)] font-normal leading-[0.98] tracking-[-0.02em]">
        {profile.headline}
      </h1>

      <p className="mt-7 max-w-[62ch] text-[clamp(1rem,1.9vw,1.1875rem)] leading-[1.65] text-muted">
        {profile.intro}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={profile.links.resume}
          className="border border-fg px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:bg-accent hover:text-bg"
        >
          Download résumé
        </a>
        <a href={`mailto:${profile.email}`} className="ul text-sm">
          {profile.email}
        </a>
        <span className="flex items-center gap-x-4 text-sm">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ul"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="ul"
          >
            LinkedIn
          </a>
          <a
            href={profile.links.devpost}
            target="_blank"
            rel="noopener noreferrer"
            className="ul"
          >
            Devpost
          </a>
        </span>
      </div>

      <dl className="mt-14 grid grid-cols-3 gap-px overflow-hidden border-y border-line bg-line sm:max-w-2xl">
        {profile.stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col-reverse bg-bg px-1 py-5 sm:px-4"
          >
            <dt className="eyebrow mt-2 normal-case tracking-[0.1em]">
              {s.label}
            </dt>
            <dd className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] leading-none tracking-tight">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm text-muted">
        <span className="text-accent">●</span> {profile.availability}
      </p>
    </section>
  );
}
