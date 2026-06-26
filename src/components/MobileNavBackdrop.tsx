"use client";

import { useEffect, useState } from "react";
import { useChromeFreeZone } from "./useChromeFreeZone";

/**
 * Mobile-only blurred backdrop that sits BEHIND the brand mark and
 * hamburger button. Its job: whenever the user scrolls and section
 * content passes underneath the fixed nav elements, the backdrop
 * blurs that content so the navbar's white logo + bars stay legible
 * and the section text underneath doesn't visually clash with them.
 *
 * Behaviour mirrors `MobileBrandMark`:
 *   - HIDDEN during the Hero (scrollY < 50vh) — the Hero's content
 *     is its own composition and a blurred bar at the top would
 *     compete with it.
 *   - FADES IN once the user scrolls past 50vh — same threshold as
 *     the brand mark, so the navbar (backdrop + brand mark + button)
 *     all appear together.
 *
 * Layout choices:
 *   - `top-0 left-0 right-0`  full-width strip at the top.
 *   - `h-[160px]`             tall enough to cover BOTH:
 *                                a) the nav row itself (brand mark +
 *                                   hamburger at top-6 = 24px + their
 *                                   ~48px of height ≈ ends at 72px),
 *                                b) the sticky section titles that
 *                                   pin at `top-16` = 64px below them,
 *                                   with ~30-40px of text height ≈
 *                                   ends at ~104px. The backdrop's
 *                                   actual full-opacity zone goes up
 *                                   to ~75% of the 160px → 120px,
 *                                   covering both layers in one blur.
 *   - `z-[89]`                BELOW the brand mark (z-90) and below
 *                              the menu overlay (z-95) — so when the
 *                              hamburger menu opens, the side panel
 *                              and its backdrop cover this nav
 *                              backdrop cleanly.
 *   - `backdrop-blur-md`      blurs the section content passing
 *                              behind it.
 *   - vertical gradient mask  fades the backdrop's bottom edge to
 *                              transparent so the strip dissolves
 *                              softly into the page content rather
 *                              than ending with a hard seam.
 *   - `pointer-events-none`   the user never interacts with the
 *                              backdrop directly.
 *   - `md:hidden`             desktop has its own nav.
 */
export function MobileNavBackdrop() {
  const [scrolled, setScrolled] = useState(false);
  /** In a chrome-free zone (Footer, "We are a STUDIO" anchor moment)
   *  → hide the backdrop so the underlying composition isn't blurred
   *  under a half-transparent strip. */
  const inChromeFreeZone = useChromeFreeZone();
  const visible = scrolled && !inChromeFreeZone;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 right-0 z-[89] md:hidden"
      style={{
        // SHRUNK to 60px (was 120px). The navbar backdrop now ONLY
        // covers the brand mark + hamburger row at top-4 = 16-64px.
        // Section titles, now rendered as per-section `sticky top-16`
        // h2 elements (= y 64px+), sit BELOW this band and never get
        // blurred or darkened by the backdrop — they pin sharp at the
        // navbar's bottom edge while the navbar's brand mark area
        // keeps its frosted-glass look above.
        height: "60px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease-out",
        // Lighter blur (was 14px) — `backdrop-filter` re-samples the
        // scrolling content every frame, so a smaller radius keeps the
        // frosted strip cheap on mobile without losing legibility.
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        // Subtle dark gradient — softens the blur underneath and
        // boosts contrast for the white nav elements without painting
        // a hard panel across the top of the page.
        background:
          "linear-gradient(to bottom, rgba(21, 40, 56, 0.35) 0%, rgba(21, 40, 56, 0.10) 80%, rgba(21, 40, 56, 0) 100%)",
        // Fade the bottom edge of the blur to transparent so the
        // strip dissolves softly into the page below it. With the
        // shorter 60px height the fade now starts at 60% (= y 36px)
        // so the bottom 24px of the strip blends smoothly into the
        // page below before reaching the sticky title row at y 64px.
        maskImage:
          "linear-gradient(to bottom, black 60%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 60%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}
