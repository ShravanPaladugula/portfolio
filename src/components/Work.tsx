import { featured, otherBuilds, type Project } from "@/content/projects";
import { Photo } from "./Photo";

function teamLabel(team: readonly string[]) {
  return team.length === 0
    ? "Solo build"
    : `${team.length + 1} people — with ${team.join(", ")}`;
}

function Spec({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-x-4 border-t border-line py-3 sm:grid-cols-[6.5rem_1fr]">
      <dt className="label pt-0.5">{term}</dt>
      <dd className="text-[0.9375rem] leading-[1.55]">{children}</dd>
    </div>
  );
}

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const [lead, ...rest] = project.photos;

  return (
    <article className="border-t-2 border-line-strong pt-5">
      {/* Index + name on one line, metadata beneath. */}
      <header className="flex items-start gap-5 sm:gap-8">
        <span className="display shrink-0 text-[clamp(1.5rem,4vw,2.5rem)] text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="display text-[clamp(2rem,6vw,3.5rem)]">
            {project.name}
          </h3>

          <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="label">{project.year}</span>
            {project.venue && <span className="label">{project.venue}</span>}
            {project.award && <span className="marker">{project.award}</span>}
          </p>
        </div>
      </header>

      <p className="headline mt-7 max-w-[30ch] text-[clamp(1.25rem,3vw,1.875rem)]">
        {project.tagline}
      </p>

      <div className="mt-8 grid gap-x-14 gap-y-9 lg:grid-cols-[1.3fr_1fr]">
        <div className="max-w-[64ch] space-y-4 text-[1.0125rem] leading-[1.65]">
          <p>{project.summary}</p>
          <p className="text-muted">{project.challenge}</p>

          <ul className="space-y-2 pt-2">
            {project.build.map((item) => (
              <li
                key={item}
                className="relative pl-6 text-[0.9375rem] leading-[1.6] before:absolute before:left-0 before:top-[0.62em] before:h-px before:w-3.5 before:bg-fg"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="self-start">
          {project.mark && (
            <div className="mb-5 flex h-20 w-fit items-center border border-line bg-white px-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.mark.src}
                alt={project.mark.alt}
                className="max-h-11 w-auto max-w-[11rem] object-contain"
              />
            </div>
          )}

          <dl className="border-b border-line">
            <Spec term="Role">{project.role}</Spec>
            {project.team && <Spec term="Team">{teamLabel(project.team)}</Spec>}
            <Spec term="Stack">
              <span className="text-muted">{project.tools.join(", ")}</span>
            </Spec>
            {project.links.length > 0 && (
              <Spec term="Links">
                <span className="flex flex-wrap gap-x-4">
                  {project.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ul font-medium"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </span>
              </Spec>
            )}
          </dl>
        </div>
      </div>

      {lead && (
        <div className="mt-9">
          <Photo
            src={lead.src}
            alt={lead.alt}
            caption={lead.caption}
            aspect="aspect-[16/10]"
            sizes="(max-width: 1080px) 100vw, 1080px"
            fit={lead.fit}
            priority={index === 1}
          />
          {rest.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3">
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
        <h2 className="label label-fg">Selected work</h2>
        <span className="label">{featured.length} builds</span>
      </div>

      <div className="space-y-16 sm:space-y-24">
        {featured.map((p, i) => (
          <FeaturedProject key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* Everything else, compact ----------------------------------- */}
      <div className="rule mt-20">
        <h2 className="label label-fg">Also built</h2>
        <span className="label">{otherBuilds.length} more</span>
      </div>

      <ul className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
        {otherBuilds.map((p) => (
          <li key={p.id} className="flex gap-4 border-t border-line pt-4">
            {p.image && (
              <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden border border-line bg-sunk sm:block">
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
              <h3 className="headline text-lg">
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ul"
                  >
                    {p.name} ↗
                  </a>
                ) : (
                  p.name
                )}
              </h3>

              <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <span className="label">{p.year}</span>
                {p.venue && <span className="label">{p.venue}</span>}
                {p.award && <span className="marker">{p.award}</span>}
              </p>

              <p className="mt-2.5 text-[0.9375rem] leading-[1.55] text-muted">
                {p.blurb}
              </p>

              {p.team && <p className="label mt-2">{teamLabel(p.team)}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
