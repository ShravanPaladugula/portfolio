"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#about", label: "About", id: "about" },
  { href: "#work", label: "Work", id: "work" },
  { href: "#lab", label: "Lab", id: "lab" },
  { href: "#path", label: "Path", id: "path" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");

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

  useEffect(() => {
    const ids = ["about", "work", "systems", "path", "awards", "lab", "education", "contact"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          const id = visible[0].target.id;
          if (id === "systems" || id === "awards" || id === "education") {
            // map adjacent sections to nearest nav anchors
            if (id === "systems") setActive("work");
            else if (id === "awards") setActive("path");
            else setActive("lab");
          } else {
            setActive(id);
          }
        }
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  isActive ? "text-accent" : "text-muted hover:text-fg"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-accent" />
                )}
              </a>
            );
          })}
          <div className="ml-3 flex items-center gap-3">
            <ThemeToggle />
            <a
              href={profile.links.resume}
              className="border border-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:bg-accent hover:text-[color:var(--selection-fg)]"
            >
              Resume
            </a>
          </div>
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
                className={`font-mono text-sm uppercase tracking-[0.18em] ${
                  active === link.id ? "text-accent" : "text-fg"
                }`}
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
