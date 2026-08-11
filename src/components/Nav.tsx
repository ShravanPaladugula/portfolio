"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#lab", label: "Lab" },
  { href: "#path", label: "Path" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-[1500px] items-center justify-between px-[clamp(1.25rem,4vw,4rem)] py-4"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="font-mono text-xs uppercase tracking-[0.2em] text-fg transition-opacity hover:opacity-70"
        >
          {profile.monogram}
          <span className="ml-3 hidden text-muted sm:inline">{profile.name}</span>
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent sm:inline"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href={profile.links.resume}
            className="hidden border border-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:bg-fg hover:text-bg sm:inline-block"
          >
            Resume
          </a>
        </div>
      </nav>
    </header>
  );
}
