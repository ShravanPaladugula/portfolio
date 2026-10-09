import { profile } from "@/content/profile";

const rows = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  {
    label: "Phone",
    value: profile.phone,
    href: `tel:+1${profile.phone.replace(/\D/g, "")}`,
  },
  {
    label: "LinkedIn",
    value: "shravan-paladugula",
    href: profile.links.linkedin,
  },
  { label: "GitHub", value: "ShravanPaladugula", href: profile.links.github },
  { label: "Devpost", value: "ShravanPaladugula", href: profile.links.devpost },
  { label: "Résumé", value: "PDF", href: profile.links.resume },
];

export function Contact() {
  return (
    <section id="contact" className="wrap section">
      <div className="rule">
        <h2 className="label label-fg">Contact</h2>
      </div>

      <p className="display max-w-[14ch] text-[clamp(2.25rem,7vw,4.25rem)]">
        Let&rsquo;s build the next system.
      </p>

      <p className="mt-6 max-w-[50ch] text-[1.0125rem] leading-[1.65] text-muted">
        {profile.availability} The fastest way to reach me is email.
      </p>

      <ul className="mt-9 border-t border-line">
        {rows.map((r) => (
          <li key={r.label} className="border-b border-line">
            <a
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-6 py-3.5"
            >
              <span className="label group-hover:text-fg">{r.label}</span>
              <span className="headline text-base sm:text-lg">
                <span className="ul">{r.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-12 flex flex-col gap-3 border-t-2 border-line-strong pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <a href="#top" className="label transition-colors hover:text-fg">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
