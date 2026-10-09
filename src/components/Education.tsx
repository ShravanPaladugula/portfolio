import { awards } from "@/content/experience";
import { profile } from "@/content/profile";

export function Education() {
  return (
    <section id="education" className="wrap section">
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-2">
        <div>
          <div className="rule">
            <span className="eyebrow">Education</span>
          </div>

          {profile.education.map((e) => (
            <article key={e.school} className="border-t border-line py-6">
              <p className="eyebrow">
                {e.when} · {e.place}
              </p>
              <h3 className="mt-2 font-serif text-xl leading-tight tracking-tight">
                {e.school}
              </h3>
              <p className="mt-1 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
                {e.detail}
              </p>
            </article>
          ))}
        </div>

        <div>
          <div className="rule">
            <span className="eyebrow">Awards</span>
            <span className="eyebrow ml-auto">{awards.length}</span>
          </div>

          <ul>
            {awards.map((a) => (
              <li
                key={a.title}
                className="flex flex-col gap-0.5 border-t border-line py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="text-[0.9375rem] leading-snug sm:flex-1">
                  {a.title}
                </span>
                <span className="eyebrow min-w-0 normal-case leading-snug tracking-[0.08em] sm:max-w-[16rem] sm:flex-1 sm:text-right">
                  {a.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
