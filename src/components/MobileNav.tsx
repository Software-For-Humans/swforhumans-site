"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/site";
import { useChromeFreeZone } from "./useChromeFreeZone";

/**
 * Returns the id of the section currently dominating the viewport — the
 * same approach as the desktop floating Nav: check each section's top
 * against a fixed line in the viewport (IntersectionObserver can't tell
 * which tall, sticky-laden section the user is actually "in").
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
      const lineY = window.innerHeight * 0.4;
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

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return active;
}

/**
 * Mobile section navbar — plain row of the four section links, WHITE
 * text, NO background. Placed in `page.tsx` inside a sticky wrapper that
 * lifts it into the bottom of the Hero at scrollY=0, then pins it just
 * below the navbar at the top for the rest of the page (mirroring the
 * desktop floating Nav). The section the user is currently in is
 * highlighted in the brand accent.
 */
export function MobileNav() {
  const active = useActiveSection();
  // Hide the nav inside chrome-free zones (the "Just Software for
  // humans" photo beat, the "We are a STUDIO" anchor, the "New ideas"
  // panel, and the footer) so those immersive moments own the screen —
  // same behaviour as the brand mark / hamburger.
  const inChromeFreeZone = useChromeFreeZone();

  return (
    <nav
      aria-label="Section navigation"
      className="flex w-full items-center justify-between px-5"
      style={{
        opacity: inChromeFreeZone ? 0 : 1,
        pointerEvents: inChromeFreeZone ? "none" : "auto",
        transition: "opacity 0.3s ease",
      }}
    >
      {navLinks.map((link) => {
        const id = link.href.replace(/^#/, "");
        const isActive = active === id;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className="italic transition-colors"
            style={{
              fontSize: "var(--text-sm)",
              whiteSpace: "nowrap",
              color: isActive ? "#00ff85" : "rgba(255, 255, 255, 0.8)",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
