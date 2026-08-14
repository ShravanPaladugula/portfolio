"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#lab", label: "Lab" },
  { href: "#path", label: "Path" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-bg/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        className="content-wrap flex items-center justify-between px-[clamp(1.25rem,4vw,4rem)] py-4"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          className="font-mono text-xs uppercase tracking-[0.2em] text-fg transition-opacity hover:opacity-70"
          onClick={() => setOpen(false)}
        >
          {profile.monogram}
          <span className="ml-3 hidden text-muted sm:inline">{profile.name}</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href={profile.links.resume}
            className="border border-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:bg-accent hover:border-accent hover:text-[color:var(--selection-fg)]"
          >
            Resume
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="border border-fg/40 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-line bg-bg px-[clamp(1.25rem,4vw,4rem)] py-6 md:hidden"
        >
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-sm uppercase tracking-[0.18em] text-fg"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={profile.links.resume}
              className="mt-2 inline-flex w-fit border border-fg px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg"
              onClick={() => setOpen(false)}
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
