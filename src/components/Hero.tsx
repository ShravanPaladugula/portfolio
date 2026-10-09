import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="top" className="wrap pt-12 pb-2 sm:pt-20 sm:pb-4">
      <p className="label">{profile.role}</p>

      <h1 className="display mt-4 max-w-[15ch] text-[clamp(2.75rem,10vw,6.5rem)]">
        {profile.headline}
      </h1>

      <div className="mt-9 grid gap-x-14 gap-y-7 border-t-2 border-line-strong pt-7 lg:grid-cols-[1.4fr_1fr]">
        <p className="max-w-[58ch] text-[clamp(1.0625rem,2vw,1.25rem)] leading-[1.6]">
          {profile.intro}
        </p>

        <dl className="grid grid-cols-3 gap-x-4 self-start">
          {profile.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="label mt-1.5">{s.label}</dt>
              <dd className="display text-[clamp(1.75rem,4vw,2.5rem)]">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href={profile.links.resume}
          className="bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-80"
        >
          Download résumé
        </a>
        <a href={`mailto:${profile.email}`} className="ul text-sm font-medium">
          {profile.email}
        </a>
        <span className="flex flex-wrap items-center gap-x-4 text-sm font-medium">
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

      <p className="label mt-7">{profile.availability}</p>
    </section>
  );
}
