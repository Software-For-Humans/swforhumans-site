"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoIsotype } from "./LogoIsotype";
import { useChromeFreeZone } from "./useChromeFreeZone";

/**
 * Mobile-only sticky brand mark in the top-LEFT corner.
 *
 * HANDOFF BEHAVIOUR — at the very top of the page the Hero displays
 * its big centred logo lockup, so showing this small navbar copy at
 * the same time would duplicate the brand mark visually. Instead,
 * this component starts HIDDEN and fades in only once the user has
 * scrolled enough that the Hero's logo has moved off the screen.
 *
 * The threshold (`window.innerHeight * 0.5`) corresponds to roughly
 * where the Hero's centred lockup leaves the viewport — the Hero is
 * `100vh` tall and the logo sits a touch above its centre. Once the
 * user has scrolled half a viewport, the big logo is gone and the
 * small one takes over as the persistent brand anchor for the rest
 * of the page.
 *
 * Fade transition: 0.35s opacity + a small `translateY(-6px)` slide-
 * in so the brand mark "drops in" from above rather than popping.
 *
 * Layout choices (unchanged from the static version):
 *   - `top-12 left-6`  same vertical as the HamburgerMenu (top-right)
 *   - `z-[105]`        above page content, below the menu panel
 *   - `md:hidden`      desktop has its own nav pattern
 *   - `<Link href="#">` tap returns the user to the top of the page
 */
export function MobileBrandMark() {
  const [scrolled, setScrolled] = useState(false);
  /** In a chrome-free zone (Footer, "We are a STUDIO" anchor moment)
   *  → hide the brand mark so the underlying composition takes the
   *  screen without a competing logo at the top-left. */
  const inChromeFreeZone = useChromeFreeZone();
  const visible = scrolled && !inChromeFreeZone;

  useEffect(() => {
    const onScroll = () => {
      // 50% of viewport height is roughly where the Hero's centred
      // logo lockup has finished moving off-screen. Above that
      // threshold we show the navbar copy so it doesn't duplicate
      // the Hero's big version.
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll(); // initialise on first paint (in case the user lands
                // mid-page e.g. via an anchor link).
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Link
      href="#main-content"
      aria-label="Software For Humans — return to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="fixed top-4 left-6 z-[90] flex items-center gap-2 md:hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-6px)",
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 0.35s ease-out, transform 0.35s ease-out",
      }}
    >
      <LogoIsotype className="h-7 w-auto text-white" />
      <span
        className="text-white"
        style={{
          fontSize: "13px",
          fontWeight: 400,
          letterSpacing: "0.005em",
          lineHeight: 1,
        }}
      >
        Software for <span style={{ fontWeight: 700 }}>Humans</span>
      </span>
    </Link>
  );
}
