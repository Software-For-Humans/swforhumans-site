import { Reveal } from "../Reveal";
import { JustSoftwareZoom } from "../JustSoftwareZoom";

type Item = {
  title: string;
  body: string;
  /** When true, the title renders in the brand teal. The brand book
   *  mockup (page 21) alternates white / teal across the four items. */
  accent?: boolean;
};

// Order from the brand book mockup (page 21), left to right:
//   1. "No grow hacks."          (white)
//   2. "No retargeting pixels."  (teal)
//   3. "No investors."           (white)
//   4. "No dark patterns."       (teal)
const items: Item[] = [
  {
    title: "No grow hacks.",
    body: "No urgency popups, no fake countdowns, no referral guilt. We grow when the work is worth growing.",
  },
  {
    title: "No retargeting pixels.",
    accent: true,
    body: "We don't follow you around the web. The site has analytics enough to know it works — and nothing else.",
  },
  {
    title: "No investors.",
    body: "Software For Humans is bootstrapped. Decisions answer to users, not to a board.",
  },
  {
    title: "No dark patterns.",
    accent: true,
    body: "Unsubscribing is one click. Cancelling is one click. The checkout doesn't grow extra steps when you hesitate.",
  },
];

function ItemBlock({ title, body, accent }: Item) {
  return (
    <div>
      {/* `--text-block-title-fluid` is now `--text-lg` (22→38px) — at
          that size the longer item titles like "No retargeting pixels."
          no longer fit on a single 260px column, so `whitespace-nowrap`
          was removed (previously: nowrap was safe at the old md
          18→28px scale). Titles wrap to 1-2 lines inside their column;
          the body's `mt-3` margin handles vertical spacing whether the
          title is one line or two.

          ACCENT — when `accent: true` is set in the items array, the
          title renders in the brand accent (`var(--accent)` =
          `#00FF85`) instead of white. Matches the brand book mockup
          (page 21) where item titles alternate white / accent across
          the four items. */}
      <h4
        className="font-semibold"
        style={{
          fontSize: "var(--text-block-title-fluid)",
          lineHeight: 1.1,
          color: accent ? "var(--accent)" : "#ffffff",
        }}
      >
        {title}
      </h4>
      {/*
        Body width capped at 280px so the prose stays narrow (~34
        chars/line at 15px) regardless of how wide the grid column is.
      */}
      <p
        className="mt-3 max-w-[280px] font-light text-white/80"
        style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.45 }}
      >
        {body}
      </p>
    </div>
  );
}

// NOTE: the `ClosingBlock` ("We are a STUDIO, not a single product.")
// used to live here as well. It was removed at the user's request
// because the SAME block already anchors WhatWeDo, and repeating it in
// WhatWeDont was redundant — the studio-vs-product framing only needs
// to be stated once.

/**
 * Title for the "What we don't" section.
 *
 * Right-aligned, no isotype — matches the brand book mockup (page 21)
 * which places this title in the top-RIGHT corner of the section (the
 * mirror of "What we do" which sits top-left with the isotype).
 *
 * Uses the brand book's spelling with the typographic apostrophe (´)
 * rather than a straight apostrophe, to match the mockup exactly.
 */
function SectionTitleRight() {
  return (
    <h2
      className="text-right font-semibold tracking-tight text-white"
      style={{ fontSize: "var(--text-section-title)" }}
    >
      What{" "}
      <em className="italic font-normal">we</em> don´t
    </h2>
  );
}

/**
 * Centered tagline that anchors the bottom of the section, just below
 * the four "No X" items. Matches the brand book mockup's center-bottom
 * placement of "Just Software, for humans."
 */
function Tagline() {
  return (
    // Two-line layout — "Just Software" on top, italic-bold
    // "for humans." underneath. The forced `<br />` (no comma)
    // turns the tagline into a stacked statement rather than a
    // single horizontal phrase; the second line carries the brand
    // signature emphasis (italic + bold).
    <p
      className="text-center text-white"
      style={{ fontSize: "var(--text-tagline-sm)", lineHeight: 1.2, fontWeight: 300 }}
    >
      Just Software
      <br />
      <em className="italic font-bold">for humans.</em>
    </p>
  );
}

export function WhatWeDont() {
  return (
    <>
    <section
      id="what-we-dont"
      className="relative"
    >
      {/*
        NO aurora and NO rounded corners on this section. The dark
        gradient (and the rounded BOTTOM corners that mark the end of
        the dark panel) are provided by the SHARED `AuroraBackground`
        wrapping Hero + WhatWeDo + WhatWeDont in `page.tsx`. That way
        the gradient reads as one continuous panel with no visible
        cuts between the three dark sections. */}

      {/* Mobile fallback — single column, vertical stack.
          (`ClosingBlock` and `Tagline` were removed from this stack —
          ClosingBlock was redundant with WhatWeDo's own closing, and
          Tagline now lives in its own dedicated mobile section below
          so it reads as a quiet anchor moment, not a wrapped end-of-
          list item.)

          `SectionTitleRight` is wrapped in a sticky-pin container so
          "What we don´t" stays anchored at the top of the viewport
          while the user scrolls through the four items. Dark
          translucent bg + backdrop-blur keeps the title legible as
          item content slides underneath it. Sticky containing block
          ends when the items stack ends and the standalone Tagline
          mobile section below begins — the title releases there
          naturally. */}
      {/* MOBILE — sticky title pinned at `top-16` via native
          `position: sticky`. */}
      <div className="px-6 pt-16 pb-12 md:hidden">
        <h2
          className="sticky z-40 text-right font-semibold tracking-tight text-white"
          style={{
            fontSize: "var(--text-section-title)",
            margin: 0,
            lineHeight: 1,
            top: "88px",
          }}
        >
          What <em className="italic font-normal">we</em> don´t
        </h2>
        <ul className="mt-12 space-y-8">
          {items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 80}>
                <ItemBlock {...item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      {/*
        Desktop layout — SEQUENTIAL EXIT.

        Each panel lives in its OWN sub-scope (absolute div with a
        specific `top` and `height`). The sub-scope's `top` controls
        when the panel enters; its HEIGHT controls when it exits.
        Stagger ENDS so the TOP elements exit first and the BOTTOM
        element exits last.

        Exit order (after the closing block was removed):
          Title (top-right)  →  4 items  →  Tagline (bottom)

        All-visible window: scrollY ~60vh → ~200vh, with every panel
        on screen together (~140vh of scroll). */}
      <div
        className="hidden md:block"
        style={{ position: "relative", height: "330vh" }}
      >
        {/* 1) TITLE "What we don´t" — top-right, exits FIRST (0 → 200vh) */}
        <div
          className="absolute left-0 right-0"
          style={{ top: 0, height: "200vh" }}
        >
          <div
            className="sticky z-30 mx-auto pt-10"
            style={{ top: "100px", width: "80%" }}
          >
            <SectionTitleRight />
          </div>
        </div>

        {/* 2) ITEMS row (4 items) — bottom area, exits SECOND
            (40vh → 280vh). 4-column grid with each item at fixed 260px
            max and `justify-content: space-between` so the row spans
            the full 80% band evenly.

            Sticky top raised from `calc(100vh - 380px)` to
            `calc(100vh - 500px)` (items pinned 120px higher) so there's
            more breathing room between the bottom of the items column
            and the tagline anchored at `calc(100vh - 140px)`. Before
            this change the items' wrapped titles + multi-line bodies
            were ending only ~30px above the tagline, which read as
            cramped. With the new offset the gap is ~150px — visible
            air between the two anchor blocks. */}
        <div
          className="absolute left-0 right-0"
          style={{ top: "40vh", height: "240vh" }}
        >
          <div
            className="sticky mx-auto"
            style={{ top: "calc(100vh - 500px)", width: "80%" }}
          >
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(4, minmax(0, 260px))",
                justifyContent: "space-between",
              }}
            >
              {items.map((item) => (
                <ItemBlock key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* 3) TAGLINE "Just Software, for humans." — centered at the
            very bottom, exits LAST (70vh → 330vh). */}
        <div
          className="absolute left-0 right-0"
          style={{ top: "70vh", height: "260vh" }}
        >
          <div
            className="sticky mx-auto"
            style={{ top: "calc(100vh - 140px)", width: "80%" }}
          >
            <Tagline />
          </div>
        </div>
      </div>
    </section>

    {/* Mobile-only "Just Software, for humans." anchor moment. Lives
        OUTSIDE `<section id="what-we-dont">` (as a SIBLING) so that
        once the user scrolls past it, the WhatWeDont section is
        already over — the floating section title hands off directly
        to "Products" without flashing "What we don't" again on the
        way out.

        `id="wedont-tagline-mobile"` flags this div as a CHROME-FREE
        zone (see `useChromeFreeZone`). Same effect as the studio
        closing block in WhatWeDo: navbar elements + floating title
        fade out while the tagline is dominating the screen. */}
    {/* Mobile: the tagline is now an immersive zooming-photo beat.
        The wrapper keeps `id="wedont-tagline-mobile"` so the
        chrome-free-zone observer still hides the navbar while it
        dominates the screen. */}
    <JustSoftwareZoom id="wedont-tagline-mobile" className="md:hidden" />
    </>
  );
}
