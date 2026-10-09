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
        <span className="eyebrow">Contact</span>
      </div>

      <h2 className="max-w-[16ch] font-serif text-[clamp(2rem,5.5vw,3.5rem)] leading-[1.03] tracking-[-0.015em]">
        Let&rsquo;s build the next system.
      </h2>

      <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">
        {profile.availability} The fastest way to reach me is email.
      </p>

      <ul className="mt-10 border-t border-line">
        {rows.map((r) => (
          <li key={r.label} className="border-b border-line">
            <a
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-baseline justify-between gap-6 py-4 transition-colors hover:text-accent"
            >
              <span className="eyebrow transition-colors group-hover:text-accent">
                {r.label}
              </span>
              <span className="font-serif text-lg tracking-tight sm:text-xl">
                {r.value}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <footer className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="eyebrow normal-case tracking-[0.08em]">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <a href="#top" className="eyebrow transition-colors hover:text-accent">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
