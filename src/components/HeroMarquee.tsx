const MARQUEE_WORDS = [
  "Quiet",
  "Focused",
  "Honest",
  "Independent",
  "Patient",
  "Useful",
  "Considered",
  "Long-term",
  "Bootstrapped",
  "Crafted",
];

/** Number of times the word list is duplicated inside the track.
 *
 *  Why more than 2 copies:
 *    With 2 copies the track is 2C wide (where C = one-copy width).
 *    The animation translates by -C and wraps. After wrap, the viewer
 *    sees track positions [C, V+C] where V is the viewport width.
 *    If V > C (very common — e.g. 10 short words at 14px ≈ 1600px on
 *    a 1920px monitor), the right portion V+C > 2C lands BEYOND the
 *    end of the track, exposing empty space on the right.
 *
 *    With N copies (track = N*C), the constraint becomes V <= (N-1)*C
 *    for the viewport to always be fully covered. N=4 gives ample
 *    headroom for ultra-wide viewports (up to V = 3C) without
 *    over-rendering on mobile.
 *
 *  Why 4 specifically and not 3 or 5:
 *    4 also pairs cleanly with the CSS keyframe that drives the
 *    animation: `translate3d(-25%, 0, 0)` shifts the track left by
 *    exactly 25% of its OWN width, which equals one-copy width when
 *    there are 4 copies — so the wrap from end-of-animation back to
 *    start renders pixel-identical and the loop is seamless. */
const COPIES = 4;

/**
 * Hero marquee — infinite horizontal ticker of brand vocabulary that
 * crowns the Hero with a translucent white band.
 *
 * Pure CSS implementation. The track holds `COPIES` (4) identical
 * copies of the word list as a flat list of sibling spans, and a
 * `.hero-marquee-track` class (defined in `globals.css`) runs a 45s
 * linear infinite `translate3d(0) → translate3d(-25%, 0)` keyframe
 * on it. -25% lands ONE copy further left (since the track is 4
 * copies wide), so the end-of-animation state renders pixel-identical
 * to t=0 and the loop is seamless.
 *
 * Why CSS and not `requestAnimationFrame`:
 *   We tried rAF earlier to avoid sub-pixel jumps at the loop
 *   boundary, but on mobile (notably iOS Safari) the marquee was
 *   sitting frozen because the rAF tick was reading
 *   `track.scrollWidth = 0`. The hero entrance animation starts the
 *   container at opacity 0 + transform, and the browser defers
 *   layout calculation in that state — so `scrollWidth` returned 0
 *   forever, the rAF loop bailed, and the marquee never advanced.
 *   The CSS keyframe runs on the compositor without reading layout,
 *   so it's immune to that timing issue.
 *
 *   The sub-pixel jump that pushed us off CSS the first time (with a
 *   2-copy `-50%` translate) is at most ~0.25px with 4 copies and
 *   `-25%` — sub-CSS-pixel, invisible on every modern display.
 */
export function HeroMarquee() {
  return (
    <div
      className="hero-reveal-4 pointer-events-none absolute inset-x-0 overflow-hidden py-2 md:py-2.5"
      style={{
        top: 0,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}
      aria-hidden="true"
    >
      <div
        className="hero-marquee-track flex w-max items-center whitespace-nowrap"
        style={{
          fontSize: "clamp(14px, 1.5vw, 19px)",
          backfaceVisibility: "hidden",
          color: "#00ff85",
        }}
      >
        {/* `COPIES` copies of the word list, rendered as a flat list
            of sibling spans (NOT wrapped in separate "copy" divs).
            The flat structure ensures every word-gap is identical so
            the wrap from one copy boundary to the next is
            pixel-perfect. See the COPIES constant for the math. */}
        {Array.from({ length: COPIES }).flatMap((_, copyIdx) =>
          MARQUEE_WORDS.map((word, i) => (
            <span
              key={`${copyIdx}-${i}`}
              className="flex shrink-0 items-center"
            >
              <span className="px-1.5 italic" style={{ fontWeight: 600 }}>
                {word}
              </span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
