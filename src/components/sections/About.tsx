import { AboutPortrait } from "../AboutPortrait";
import { Reveal } from "../Reveal";

/**
 * About section — light-gray panel anchoring the lower half of the page,
 * per brand book pages 24-25.
 *
 * Layout:
 *   - top-LEFT    → small studio description paragraph (~30% wide)
 *   - bottom-LEFT → large "Built in Virginia, Made for humans." tagline
 *   - RIGHT side  → portrait image, medium opacity, blended with the gray
 *     background so it reads as a quiet atmospheric element rather than
 *     a hero photograph (matches the brand book moodboard treatment).
 *   - generous vertical breathing room between paragraph and tagline.
 *
 * Background is the same light-gray as Products (#C0C0C0); text is white
 * with the "for humans" wordmark in italic+bold (NO accent color, just
 * white — matches the brand book mockup which keeps everything white in
 * this section).
 */
export function About() {
  return (
    <section
      id="about"
      className="relative"
      style={{ backgroundColor: "#B0B0B0" }}
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">
        About
      </h2>

      {/*
        Portrait image — RIGHT side, sticky-pinned, with a SMOOTH
        entrance fade-in driven by IntersectionObserver. Implementation
        lives in `AboutPortrait` (a client component) so the rest of
        this section stays a server component. See `AboutPortrait.tsx`
        for the sticky structure, halo stack, and animation details.
      */}
      <AboutPortrait />

      {/* Mobile fallback — paragraph anchored at top, tagline
          anchored at bottom, generous breathing room between.
          `min-h-[130vh]` makes the section taller than the viewport
          so the paragraph + tagline composition gets significant
          stage time on its own (user requested About + Contact each
          OCCUPY MORE and be MORE SPACED from each other). The
          `flex-1` spacer pushes the tagline to the bottom of the
          extended panel, exaggerating the vertical breathing room
          between "studio paragraph at top" and "tagline at bottom".
          `pt-40 pb-40` adds extra padding so neither block hugs the
          edges and the gap between About's bottom and Contact's top
          reads as a deliberate pause. `pt-40` also reserves room
          for the global `MobileSectionTitle` ("About") overlaying
          the top. */}
      <div className="flex min-h-[104vh] flex-col px-6 pt-40 pb-40 md:hidden">
        <Reveal>
          <AboutParagraphs />
        </Reveal>
        <div className="flex-1" />
        <Reveal delay={150}>
          <AboutTagline />
        </Reveal>
      </div>

      {/* Desktop sticky choreography — paragraphs exit before the tagline.
          Section is 220vh; the paragraphs live in the top half, the
          tagline in the bottom half, both pinned to their respective
          corners of the viewport while the user scrolls through.

          `zIndex: 1` keeps the whole choreography (and its sticky
          children) painted above the portrait image which has
          `zIndex: 0` in the sibling background div above. */}
      <div
        className="hidden md:block"
        style={{ position: "relative", height: "220vh", zIndex: 1 }}
      >
        {/* Paragraphs sub-scope — exits earlier (120vh tall). */}
        <div
          className="absolute left-0 right-0"
          style={{ top: "0vh", height: "120vh" }}
        >
          <div
            className="sticky mx-auto"
            style={{ top: "180px", width: "80%" }}
          >
            <AboutParagraphs />
          </div>
        </div>

        {/* Tagline sub-scope — stays longer (180vh) so it lingers as the
            paragraphs fade out above it. */}
        <div
          className="absolute left-0 right-0"
          style={{ top: "40vh", height: "180vh" }}
        >
          <div
            className="sticky mx-auto"
            style={{ top: "calc(100vh - 220px)", width: "80%" }}
          >
            <AboutTagline />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Studio description block — left-aligned column with three short
 * paragraphs. Last paragraph dims slightly so the legal note reads
 * as a footer to the description.
 */
function AboutParagraphs() {
  return (
    <div
      className="max-w-md space-y-4 font-light"
      style={{
        fontSize: "var(--text-body)",
        lineHeight: 1.45,
        color: "#ffffff",
      }}
    >
      <p>
        Software For Humans, LLC is a small, independent studio. We don’t
        take investors and we don’t optimize for growth — we optimize for
        the people who actually use our software.
      </p>
      <p>
        Every product in the portfolio answers one question: would I want
        to use this every day? If the answer is no, we don’t ship it.
      </p>
      <p style={{ color: "rgba(255, 255, 255, 0.65)" }}>
        Operated as Software For Humans, LLC — a Virginia limited
        liability company.
      </p>
    </div>
  );
}

/**
 * Closing tagline — large, left-aligned, "for humans." in italic+bold
 * white (no accent color, matching the brand book mockup).
 */
function AboutTagline() {
  return (
    <div className="text-left">
      <h3
        className="font-light tracking-tight"
        style={{
          fontSize: "var(--text-tagline-lg)",
          lineHeight: 1.15,
          color: "#ffffff",
        }}
      >
        Built in Virginia, Made{" "}
        <em className="italic font-bold">for humans.</em>
      </h3>
    </div>
  );
}
