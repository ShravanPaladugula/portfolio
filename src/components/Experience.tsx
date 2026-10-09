import { experience, leadership, type Entry } from "@/content/experience";

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <article className="grid gap-x-10 gap-y-3 border-b border-line py-6 sm:grid-cols-[13rem_1fr]">
      <div>
        <p className="label label-fg">{entry.when}</p>
        {entry.place && <p className="label mt-1">{entry.place}</p>}
      </div>

      <div>
        <h3 className="headline text-lg">{entry.role}</h3>
        <p className="mt-0.5 text-[0.9375rem] text-muted">{entry.org}</p>

        <ul className="mt-3 space-y-2">
          {entry.bullets.map((b) => (
            <li
              key={b}
              className="relative max-w-[66ch] pl-6 text-[0.9375rem] leading-[1.6] before:absolute before:left-0 before:top-[0.62em] before:h-px before:w-3.5 before:bg-fg"
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
        <h2 className="label label-fg">Experience</h2>
      </div>
      {experience.map((e) => (
        <EntryBlock key={e.id} entry={e} />
      ))}

      <div className="rule mt-14">
        <h2 className="label label-fg">Leadership</h2>
      </div>
      {leadership.map((e) => (
        <EntryBlock key={e.id} entry={e} />
      ))}
    </section>
  );
}
