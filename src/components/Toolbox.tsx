import { profile } from "@/content/profile";

export function Toolbox() {
  return (
    <section id="toolbox" className="wrap section">
      <div className="rule">
        <span className="eyebrow">Toolbox</span>
      </div>

      <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(profile.toolbox).map(([group, items]) => (
          <div key={group} className="border-t border-line pt-4">
            <h3 className="eyebrow text-fg">{group}</h3>
            <ul className="mt-3.5 flex flex-wrap gap-1.5">
              {items.map((item) => (
                <li key={item} className="tag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
