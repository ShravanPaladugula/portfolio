import { profile } from "@/content/profile";

export function Toolbox() {
  return (
    <section id="toolbox" className="wrap section">
      <div className="rule">
        <h2 className="label label-fg">Toolbox</h2>
      </div>

      <dl>
        {Object.entries(profile.toolbox).map(([group, items]) => (
          <div
            key={group}
            className="grid gap-x-10 gap-y-2 border-b border-line py-5 sm:grid-cols-[13rem_1fr]"
          >
            <dt className="label label-fg">{group}</dt>
            <dd className="text-[0.9375rem] leading-[1.7] text-muted">
              {items.join(" · ")}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
