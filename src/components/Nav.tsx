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
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="wrap flex h-14 items-center justify-between gap-6"
      >
        <a href="#top" className="headline text-base leading-none">
          {profile.name}
        </a>

        <ul className="hidden items-center gap-6 sm:flex">
          {sections.map((s) => (
            <li key={s.href}>
              <a href={s.href} className="label transition-colors hover:text-fg">
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={profile.links.resume}
              className="label label-fg border border-line-strong px-3 py-1.5 transition-opacity hover:opacity-60"
            >
              Résumé
            </a>
          </li>
        </ul>

        <a
          href={`mailto:${profile.email}`}
          className="label label-fg sm:hidden"
        >
          Email
        </a>
      </nav>
    </header>
  );
}
