"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { navLinks } from "@/lib/site";

type Props = {
  /**
   * - "sticky" (default): top-of-page sticky bar with logo + CTA.
   * - "floating": wide pill, centered inside hero — no logo / no CTA.
   */
  variant?: "sticky" | "floating";
  /**
   * Color scheme for the floating variant — only applies when
   * `variant === "floating"`.
   *
   * - "light" (default): WHITE text. Use on top of the DARK aurora
   *   panel (Hero / WhatWeDo / WhatWeDont).
   * - "dark":  DARK text (uses the brand deep-navy `#152838`).
   *   Use on top of the LIGHT gray panel (Products / About / Contact)
   *   where white text is illegible against the gray background.
   */
  theme?: "light" | "dark";
};

/**
 * Returns the id of the section currently dominating the viewport.
 * Uses a raw scroll listener (not IntersectionObserver) because our
 * sections are tall and contain sticky children — IO can't tell which
 * one the user is actually "reading", but checking each section's top
 * against a fixed line in the viewport always works.
 */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = navLinks
      .map((l) => l.href.replace(/^#/, ""))
      .filter(Boolean);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      // Pick whichever section's top is most recently above the 30% line of
      // the viewport. That's the section the user is currently "in".
      const lineY = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top <= lineY && rect.bottom > lineY) {
          current = s.id;
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // The desktop Nav is `hidden md:block`, but a hidden React component
    // still mounts and runs its effects — so on mobile this scroll loop
    // (a getBoundingClientRect per section, every frame) would burn work
    // for a nav nobody can see. Only attach it on desktop, and toggle on
    // viewport changes.
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (mq.matches) {
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", update);
      }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}

export function Nav({ variant = "sticky", theme = "light" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();

  useEffect(() => {
    if (variant !== "sticky") return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  if (variant === "floating") {
    // `theme="dark"` switches the floating nav to dark text for the
    // LIGHT panel of the page (Products / About / Contact) where the
    // background is light gray and white text is illegible. The
    // active-link colour matches the brand's deep navy `#152838`.
    const isDark = theme === "dark";
    const linkClass = isDark
      ? "nav-link group relative flex-1 text-center italic transition-colors text-[#152838]/65 hover:text-[#152838] data-[active=true]:text-[#152838] data-[active=true]:font-medium"
      : "nav-link group relative flex-1 text-center italic transition-colors text-white/80 hover:text-white data-[active=true]:text-white";
    return (
      <nav
        aria-label="Primary"
        className={`pointer-events-auto flex w-full items-center justify-between gap-2 px-6 py-3 md:px-10 md:py-4 ${
          isDark ? "text-[#152838]" : "text-white"
        }`}
      >
        {navLinks.map((link) => {
          const id = link.href.replace(/^#/, "");
          const isActive = active === id;
          return (
            <Link
              key={link.href}
              href={link.href}
              data-active={isActive || undefined}
              className={linkClass}
              style={{ fontSize: "var(--text-sm)" }}
            >
              <span className="link-underline inline-block">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/60 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navLinks.map((link) => {
              const id = link.href.replace(/^#/, "");
              const isActive = active === id;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive || undefined}
                  className="nav-link text-sm text-muted transition-colors hover:text-foreground data-[active=true]:text-foreground"
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="https://shopledger.app"
              className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Try Shopledger
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div
            id="mobile-nav"
            className="border-t border-white/10 py-4 md:hidden"
          >
            <nav className="flex flex-col gap-3" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-1 text-sm text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="https://shopledger.app"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex w-fit rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background"
              >
                Try Shopledger
              </Link>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
}
