import { awards } from "@/content/experience";
import { profile } from "@/content/profile";

export function Education() {
  return (
    <section id="education" className="wrap section">
      <div className="grid gap-x-14 gap-y-11 lg:grid-cols-2">
        <div>
          <div className="rule">
            <h2 className="label label-fg">Education</h2>
          </div>

          {profile.education.map((e) => (
            <article key={e.school} className="border-b border-line py-5">
              <h3 className="headline text-lg">{e.school}</h3>
              <p className="label mt-1.5">
                {e.when} · {e.place}
              </p>
              <p className="mt-2 max-w-[46ch] text-[0.9375rem] leading-[1.55] text-muted">
                {e.detail}
              </p>
            </article>
          ))}
        </div>

        <div>
          <div className="rule">
            <h2 className="label label-fg">Awards</h2>
            <span className="label">{awards.length}</span>
          </div>

          <ul>
            {awards.map((a) => (
              <li key={a.title} className="border-b border-line py-3">
                <p className="text-[0.9375rem] font-medium leading-snug">
                  {a.title}
                </p>
                <p className="label mt-1">{a.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
