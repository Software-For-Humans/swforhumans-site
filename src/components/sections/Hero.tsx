import { LogoIsotype } from "../LogoIsotype";
import { HeroMarquee } from "../HeroMarquee";

/**
 * Hero — full-bleed 100vh section that opens the page.
 *
 * IMPORTANT: this Hero does NOT render its own aurora background. The
 * dark gradient is provided by a SHARED `AuroraBackground` that wraps
 * Hero + WhatWeDo + WhatWeDont together (set up in `page.tsx`). That
 * gives one continuous gradient across all three dark sections with
 * no visible seams between them — when each section had its own
 * AuroraBackground, the blobs animated independently and the
 * sticky-release between sections created a visible cut.
 *
 * The Hero's role here is just to:
 *   - reserve 100vh of vertical space
 *   - render the centered logo lockup
 *   - render the infinite marquee band of brand vocabulary
 *   - render the bottom-right mission paragraph
 */
export function Hero() {
  return (
    // `height: 100svh` (small viewport height) instead of `100vh` so
    // the Hero exactly matches the visible viewport on iOS Safari.
    // The previous `100vh` was TALLER than the visible viewport on
    // mobile because Safari excludes the URL bar's area from
    // `window.innerHeight` but INCLUDES it in `100vh` units —
    // causing the Hero's centred logo to render lower than the
    // PageLoader's logo (which uses `fixed inset-0` = visible
    // viewport). With `100svh` both viewport calculations match and
    // the loader→hero handoff lands pixel-perfect.
    <section
      className="relative isolate flex w-full flex-col"
      style={{ height: "100svh" }}
    >
      {/* Centered lockup: isotype + wordmark.
          Lifted a touch above center (pb-16 / pb-20) so the wordmark
          doesn't collide with the floating nav that pins at the bottom
          of the hero. */}
      <div className="hero-reveal-1 absolute inset-0 flex flex-col items-center justify-center pb-16 md:pb-20">
        <LogoIsotype
          className="h-[120px] w-auto text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)] md:h-[160px]"
        />
        <h1
          className="mt-3 text-center text-white md:mt-4"
          style={{ fontSize: "var(--text-hero-wordmark)" }}
        >
          <span style={{ fontWeight: 300 }}>Software for </span>
          <span style={{ fontWeight: 700 }}>Humans</span>
        </h1>
      </div>

      {/* Infinite marquee band — translucent white strip at the top
          of the hero with brand-adjective vocabulary scrolling right
          to left. Implementation in `HeroMarquee.tsx` (client
          component using `requestAnimationFrame` instead of CSS
          keyframes for a pixel-perfect seamless loop). */}
      <HeroMarquee />

      {/* Mission statement — bottom-right inside the hero, lifted higher
          so it sits comfortably above the nav with room to breathe.

          Mobile sizing:
          - `bottom-24` (96px) instead of `bottom-40` since the floating
            nav is hidden on mobile and we don't need to reserve room
            for it. Keeps the mission well above the bottom edge.
          - `left-6 right-6` so the block can use the full width minus
            page margins. The previous `max-w-2xl` (672px) only matters
            on desktop; on mobile it would let the line stretch much
            wider than the viewport's usable area.
          - `max-w-xs md:max-w-2xl` — 320px cap on mobile so the
            paragraph wraps to a readable column instead of running
            edge-to-edge in a single long line. */}
      <div className="hero-reveal-2 absolute bottom-24 left-6 right-6 ml-auto max-w-xs text-right md:bottom-48 md:left-auto md:right-12 md:max-w-2xl">
        {/* Mission paragraph — LIGHT weight (300) base with `software`,
            `respects`, and `people` BOLD (700) for emphasis. The three
            bold words land on the key concepts of the value prop;
            "the" between "respects" and "people" stays light so the
            emphasis reads as three distinct stressed words rather
            than a single bold phrase.

            `lineHeight: 1.15` — tight display rhythm, matches the
            rest of the site's display tier. */}
        {/* Shorter, two-line mission. Break after "software" so the
            main clause and the relative clause each get their own
            line:
              Line 1: "We build **software**"
              Line 2: "that **respects** **people** using it." */}
        <p
          className="font-light text-white"
          style={{ fontSize: "var(--text-hero-mission)", lineHeight: 1.15 }}
        >
          We build <span style={{ fontWeight: 700 }}>software</span>
          <br />
          that <span style={{ fontWeight: 700 }}>respects</span>{" "}
          <span style={{ fontWeight: 700 }}>people</span> using it.
        </p>
        <p
          className="hero-reveal-3 mt-1.5 font-light text-white/70"
          style={{ fontSize: "var(--text-hero-mission-sub)", lineHeight: 1.45 }}
        >
          Software For Humans is a studio that ships a small portfolio of
          quiet, honest tools — built to outlast trends and serve the people
          who depend on them.
        </p>
      </div>
    </section>
  );
}
