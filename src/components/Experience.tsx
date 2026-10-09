import { experience, leadership, type Entry } from "@/content/experience";

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <article className="grid gap-x-10 gap-y-3 border-t border-line py-7 sm:grid-cols-[13rem_1fr]">
      <div>
        <p className="eyebrow">{entry.when}</p>
        {entry.place && (
          <p className="eyebrow mt-1 normal-case tracking-[0.08em]">
            {entry.place}
          </p>
        )}
      </div>

      <div>
        <h3 className="font-serif text-xl leading-tight tracking-tight">
          {entry.role}
        </h3>
        <p className="mt-0.5 text-[0.9375rem] text-muted">{entry.org}</p>

        <ul className="mt-3 space-y-2">
          {entry.bullets.map((b) => (
            <li
              key={b}
              className="relative max-w-[66ch] pl-5 text-[0.9375rem] leading-[1.65] before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-2.5 before:bg-line-strong"
            >
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Experience() {
  return (
    <section id="experience" className="wrap section">
      <div className="rule">
        <span className="eyebrow">Experience</span>
      </div>
      {experience.map((e) => (
        <EntryBlock key={e.id} entry={e} />
      ))}

      <div className="rule mt-16">
        <span className="eyebrow">Leadership</span>
      </div>
      {leadership.map((e) => (
        <EntryBlock key={e.id} entry={e} />
      ))}
    </section>
  );
}
