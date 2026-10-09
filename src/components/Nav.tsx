import { profile } from "@/content/profile";

const sections = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#toolbox", label: "Toolbox" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="wrap flex h-14 items-center justify-between gap-6"
      >
        <a
          href="#top"
          className="font-serif text-lg leading-none tracking-tight transition-colors hover:text-accent"
        >
          {profile.name}
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {sections.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                className="eyebrow transition-colors hover:text-fg"
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.links.resume}
              className="eyebrow border border-line-strong px-3 py-1.5 text-fg transition-colors hover:border-accent hover:text-accent"
            >
              Résumé
            </a>
          </li>
        </ul>

        <a
          href={`mailto:${profile.email}`}
          className="eyebrow text-fg transition-colors hover:text-accent sm:hidden"
        >
          Email
        </a>
      </nav>
    </header>
  );
}
