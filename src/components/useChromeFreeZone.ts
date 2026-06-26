"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` while the user's viewport is inside any
 * "chrome-free zone" — a part of the page where the floating mobile
 * navbar elements (blur backdrop, brand mark, hamburger button, and
 * the floating section title) should be hidden so the underlying
 * composition takes the screen uncluttered.
 *
 * Current zones:
 *   - the page `<footer>` — the final destination of the scroll
 *   - the standalone "We are a STUDIO, not a single product."
 *     mobile section (`#studio-closing-mobile`) — an anchor moment
 *     between the WhatWeDo principles and the WhatWeDont section
 *   - the WhatWeDont tagline ("Just Software for humans.") mobile
 *     anchor (`#wedont-tagline-mobile`)
 *   - the "New ideas coming soon" zoom panel (`#new-ideas`) — the
 *     dark gradient card inside Products. The user wants the navbar
 *     hidden while the slow zoom animation plays, so the breathing
 *     moment owns the full screen with no chrome on top.
 *
 * One IntersectionObserver per page (shared across all components
 * that consume the hook); the observed elements are looked up once
 * after mount via `document.querySelector`. `threshold: 0` fires as
 * soon as the first pixel of any zone enters the viewport.
 */
const CHROME_FREE_SELECTORS = [
  "footer",
  "#studio-closing-mobile",
  "#wedont-tagline-mobile",
  "#new-ideas",
];

export function useChromeFreeZone(): boolean {
  const [inZone, setInZone] = useState(false);

  useEffect(() => {
    const targets = CHROME_FREE_SELECTORS.map((sel) =>
      document.querySelector(sel),
    ).filter((el): el is Element => el !== null);

    if (targets.length === 0) return;

    const visibility = new Map<Element, boolean>();
    targets.forEach((t) => visibility.set(t, false));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          visibility.set(entry.target, entry.isIntersecting),
        );
        setInZone(Array.from(visibility.values()).some((v) => v));
      },
      {
        // `rootMargin: -10% 0 -90% 0` shrinks the observation rect to
        // a SINGLE HORIZONTAL LINE at the TOP 10% of the viewport
        // (the 10vh mark from the top). A target is "in view" only
        // when that line passes THROUGH it — i.e. when the target
        // has scrolled far enough that its top edge is at the upper
        // 10% of the screen, which for a `min-h-[80vh]` block means
        // the block is essentially FILLING the viewport.
        //
        // Why so aggressive: the user wants `What we do` to stay
        // visible while reading through ALL three principles AND
        // even while the "We are a STUDIO" closing block starts
        // entering — chrome-free only kicks in once the closing
        // block has visibly become THE composition on screen. Same
        // for the WhatWeDont tagline and the Footer.
        threshold: 0,
        rootMargin: "-10% 0px -90% 0px",
      },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return inZone;
}
