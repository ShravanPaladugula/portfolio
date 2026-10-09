import { featured, otherBuilds, type Project } from "@/content/projects";
import { Photo } from "./Photo";

function teamLabel(team: readonly string[]) {
  return team.length === 0
    ? "Solo build"
    : `Team of ${team.length + 1} — with ${team.join(", ")}`;
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-3.5">
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed">{children}</dd>
    </div>
  );
}

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const [lead, ...rest] = project.photos;

  return (
    <article className="border-t border-line-strong pt-8">
      <header>
        <p className="eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
          {project.venue && (
            <>
              <span aria-hidden>·</span>
              <span>{project.venue}</span>
            </>
          )}
          {project.award && (
            <>
              <span aria-hidden>·</span>
              <span className="text-accent">{project.award}</span>
            </>
          )}
        </p>

        <h3 className="mt-3 font-serif text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.02] tracking-[-0.015em]">
          {project.name}
        </h3>
        <p className="mt-2 max-w-[48ch] text-[clamp(1.0625rem,2.2vw,1.375rem)] leading-snug text-muted">
          {project.tagline}
        </p>
      </header>

      <div className="mt-9 grid gap-x-12 gap-y-9 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="max-w-[62ch] leading-[1.7]">{project.summary}</p>

          <h4 className="eyebrow mt-8">What it took</h4>
          <ul className="mt-3 max-w-[62ch] space-y-2.5">
            {project.build.map((item) => (
              <li
                key={item}
                className="relative pl-5 leading-[1.65] text-[0.9375rem] before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-2.5 before:bg-line-strong"
              >
                {item}
              </li>
            ))}
          </ul>

          <h4 className="eyebrow mt-8">The hard part</h4>
          <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-muted">
            {project.challenge}
          </p>
        </div>

        <div className="self-start">
          {project.mark && (
            <div className="mb-6 flex h-24 w-fit items-center border border-line bg-white px-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.mark.src}
                alt={project.mark.alt}
                className="max-h-14 w-auto max-w-[13rem] object-contain"
              />
            </div>
          )}

          <dl className="border-b border-line">
            <Meta label="My role">{project.role}</Meta>
            {project.team && (
              <Meta label="Team">{teamLabel(project.team)}</Meta>
            )}
            <Meta label="Built with">
              <span className="flex flex-wrap gap-1.5">
                {project.tools.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </span>
            </Meta>
            {project.links.length > 0 && (
              <Meta label="Links">
                <span className="flex flex-wrap gap-x-4">
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ul"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </span>
              </Meta>
            )}
          </dl>
        </div>
      </div>

      {lead && (
        <div className="mt-10">
          <Photo
            src={lead.src}
            alt={lead.alt}
            caption={lead.caption}
            aspect="aspect-[16/10]"
            sizes="(max-width: 1120px) 100vw, 1120px"
            fit={lead.fit}
            priority={index === 1}
          />
          {rest.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
              {rest.map((p) => (
                <Photo
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  caption={p.caption}
                  aspect="aspect-square"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  fit={p.fit}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className="wrap section">
      <div className="rule">
        <span className="eyebrow">Selected work</span>
        <span className="eyebrow ml-auto">{featured.length} builds</span>
      </div>

      <div className="space-y-20 sm:space-y-28">
        {featured.map((p, i) => (
          <FeaturedProject key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* Other builds ------------------------------------------------ */}
      <div className="rule mt-24">
        <span className="eyebrow">Also built</span>
        <span className="eyebrow ml-auto">{otherBuilds.length} more</span>
      </div>

      <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {otherBuilds.map((p) => (
          <li key={p.id} className="flex gap-5 border-t border-line pt-5">
            {p.image && (
              <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden border border-line bg-sunk sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            <div className="min-w-0">
              <p className="eyebrow flex flex-wrap items-center gap-x-2">
                <span>{p.year}</span>
                {p.venue && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{p.venue}</span>
                  </>
                )}
                {p.award && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="text-accent">{p.award}</span>
                  </>
                )}
              </p>

              <h3 className="mt-1.5 font-serif text-xl tracking-tight">
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {p.name} <span className="text-muted">↗</span>
                  </a>
                ) : (
                  p.name
                )}
              </h3>

              <p className="mt-2 text-[0.9375rem] leading-[1.6] text-muted">
                {p.blurb}
              </p>

              {p.team && (
                <p className="eyebrow mt-2.5 normal-case tracking-[0.08em]">
                  {teamLabel(p.team)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
