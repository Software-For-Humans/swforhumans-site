import { Reveal } from "../Reveal";

type Principle = {
  n: string;
  prefix: string;
  highlight: string;
  suffix: string;
  body: string;
};

const principles: Principle[] = [
  {
    n: "1",
    prefix: "Small on ",
    highlight: "purpose",
    suffix: "",
    body: "Each product solves one problem completely, rather than ten problems halfway. The team stays small so the work stays sharp.",
  },
  {
    n: "2",
    prefix: "Plain ",
    highlight: "language",
    suffix: "",
    body: "No jargon, no dark patterns, no growth tricks. The interface should explain itself. The pricing should fit on a postcard.",
  },
  {
    n: "3",
    prefix: "L",
    highlight: "ong-term",
    suffix: " tools",
    body: "We design software that's still useful five years from now. Boring stacks, careful releases, durable formats your data can leave with.",
  },
];

// Each principle pins at its own staircased vertical position INSIDE
// the middle zone of the viewport (the section is split into 3 clear
// zones: top = header at ~10vh, middle = principles at 27-47vh,
// bottom = closing block anchored to viewport bottom).
//
// The staircase is intentionally TIGHTER than the previous (27/43/59vh)
// so all three principles fit comfortably inside the middle zone and
// don't bleed into the bottom zone where the closing block lives.
//   - P1 → 27vh (top of middle zone, left side of 80% band)
//   - P2 → 37vh (centre of middle zone, centre of 80% band)
//   - P3 → 47vh (bottom of middle zone, right side of 80% band)
const STICKY_TOPS = ["27vh", "37vh", "47vh"];

// SEQUENTIAL ENTRY + SEQUENTIAL EXIT.
//
// Each element lives in its OWN sub-scope (an `absolute` div with a
// specific `top` and `height` inside the section). The sub-scope's
// `top` controls WHEN the element first appears (sequential entry,
// each item enters a few dozen vh after the previous one). The sub-
// scope's HEIGHT controls how long the element stays pinned — when
// the sub-scope ends, the sticky inside releases and the item exits.
//
// By staggering both starts and ends, items enter in order
// (header → P1 → P2 → P3 → closing) AND exit in the same order
// (header out first, closing out last). In between there's a window
// (~87→200vh of scroll) where all five are visible simultaneously,
// matching the brand-book "all together" composition.
const SCOPE_STARTS = ["0vh", "30vh", "60vh", "90vh", "120vh"];
const SCOPE_HEIGHTS = ["228vh", "257vh", "283vh", "309vh", "363vh"];

function PrincipleBlock({ n, prefix, highlight, suffix, body }: Principle) {
  return (
    <div className="flex gap-4">
      <div
        className="font-light leading-none text-white"
        style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
      >
        {n}
      </div>
      <div className="pt-2">
        <h3 className="text-white" style={{ fontSize: "var(--text-block-title)" }}>
          {prefix}
          {/* Highlights kept in WHITE (italic + bold only — no accent
              colour). The brand-book teal treatment was tried and then
              reverted per the user's preference for a uniform white
              type colour, letting weight + italic carry emphasis. */}
          <em className="italic font-bold text-white">
            {highlight}
          </em>
          {suffix}
        </h3>
        <p
          className="mt-3 font-light text-white/55"
          style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.45 }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

function ClosingBlock() {
  return (
    <div className="max-w-xl">
      <h3
        className="text-white"
        style={{ fontSize: "var(--text-block-title-lg)", lineHeight: 1.1 }}
      >
        We are a <span className="font-bold uppercase">STUDIO</span>, not a
        single product.
      </h3>
      {/* `--text-body-sm` (was `--text-body`) so the closing paragraph
          matches the size of the principles' body text above. Title +
          body now share the same scale across all four block units
          (P1, P2, P3, closing). */}
      <p
        className="mt-3 font-light text-white/55"
        style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.45 }}
      >
        Software For Humans is the parent studio behind a growing portfolio of
        focused tools. Every product shares the same philosophy — but each one
        stands on its own, with its own brand, pricing, and audience.
      </p>
    </div>
  );
}

export function SectionHeader({
  subtitle,
  className = "",
  align = "left",
}: {
  subtitle?: string;
  className?: string;
  align?: "left" | "right";
}) {
  const alignClass = align === "right" ? "text-right" : "text-left";
  return (
    // LogoIsotype removed — the user prefers the section title to read
    // as bare type ("What we do") without an accompanying mark. The
    // global brand mark in the mobile navbar (top-left) carries the
    // isotype for the whole page, so repeating it on each section
    // header was redundant.
    <div className={`${alignClass} ${className}`}>
      <div>
        <h2
          className="font-semibold tracking-tight text-white"
          style={{ fontSize: "var(--text-section-title)" }}
        >
          What{" "}
          {/*
            "we" stays italic but WHITE (matching the brand book mockup).
            Only the principles' highlights ("purpose", "language",
            "Long-term") carry the accent color — that keeps the eye
            travelling to the keywords, not to the section header.
          */}
          <em className="italic font-normal">we</em> do
        </h2>
        {subtitle && (
          <p
            className="-mt-1 italic text-white/85"
            style={{ fontSize: "var(--text-block-title-fluid)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export function WhatWeDo() {
  return (
    <>
    <section
      id="what-we-do"
      className="relative"
    >
      {/*
        NO aurora in this section. The dark gradient is provided by a
        SHARED `AuroraBackground` that wraps Hero + WhatWeDo + WhatWeDont
        together (set up in `page.tsx`). This keeps the gradient
        continuous across the three dark sections with no visible cut
        between them.
      */}

      {/* Mobile fallback — title + the three principles only.
          (The `ClosingBlock` that used to wrap the bottom of this
          stack now lives in its own dedicated mobile-only section
          below — see the next div — so it reads as a standalone
          "we are a studio" anchor moment instead of as the tail
          of the principles list.)

          The section title is wrapped in a sticky-pin container so
          it stays anchored at the top of the viewport while the
          user scrolls through the three principles. Subtle dark
          translucent bg + backdrop-blur keeps the title legible
          when content slides underneath it. When the principles
          stack ends (and the standalone "We are a STUDIO" mobile
          section below begins) the sticky containing block ends
          and the title releases naturally. */}
      {/* Section title via global `MobileSectionTitle`. `pt-32`
          reserves the top for the floating title overlay. Each
          principle is wrapped in a `<Reveal>` so it fades + slides
          up as it enters the viewport (with a staggered delay so
          they cascade in rather than all popping at once). */}
      {/* MOBILE — section now renders its OWN sticky title at the
          top of the content flow. The title sits at `top-16` (= 64px
          from the viewport top, just below the navbar backdrop strip)
          and `position: sticky` lets the browser pin it natively as
          the user scrolls. No JS scroll handler, no body-level fixed
          element, no perceived "float" — the title behaves as a
          normal heading that the browser locks in place while its
          section is on screen. The `pt-16` parent padding means the
          heading starts AT the pin position when the section first
          reaches the top of the viewport (section.top = 0 → title at
          y=64), so there's no jump between "scrolling in flow" and
          "pinned at navbar". */}
      <div className="px-6 pt-16 pb-24 md:hidden">
        <h2
          className="sticky z-40 text-right font-semibold tracking-tight text-white"
          style={{
            fontSize: "var(--text-section-title)",
            margin: 0,
            lineHeight: 1,
            top: "88px",
          }}
        >
          What <em className="italic font-normal">we</em> do
        </h2>
        <div className="mt-12 space-y-16">
          {principles.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <PrincipleBlock {...p} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Desktop choreography — FIVE independent sub-scopes so that
          each element enters AND exits in strict order, matching the
          user's request:

            Entry order:  header → P1 → P2 → P3 → closing
            Exit  order:  header → P1 → P2 → P3 → closing
            All-visible window: ~scrollY 87→200vh (113vh of scroll
            where every element sits on screen together).

          See SCOPE_STARTS and SCOPE_HEIGHTS at the top of the file for
          the exact numbers. Each principle sits in its own 5-column
          grid so its horizontal position lands at col 2 / 3 / 4 of the
          80% band — the same staircase positions they would have in a
          single shared grid, but split across separate sticky scopes
          so each can exit independently. */}
      <div
        className="hidden md:block"
        style={{ position: "relative", height: "500vh" }}
      >
        {/* 1) HEADER sub-scope — enters first, exits first */}
        <div
          className="absolute"
          style={{
            top: SCOPE_STARTS[0],
            height: SCOPE_HEIGHTS[0],
            left: "10%",
            right: "10%",
          }}
        >
          <div
            className="sticky pt-10"
            style={{ top: "100px" }}
          >
            <SectionHeader />
          </div>
        </div>

        {/* 2-4) PRINCIPLES — each in its OWN sub-scope so its entry and
            exit can be timed independently. Each sub-scope spans the
            80% band directly (`left: 10%; right: 10%`).

            HORIZONTAL LAYOUT — three equal 1fr columns spanning the
            full 80% band. Each principle is placed in its own column
            (P1 → col 1, P2 → col 2, P3 → col 3) and then anchored
            INSIDE the column with `justifySelf`:

              P1 → justify-self: start  → flush with LEFT edge of band
              P2 → justify-self: center → centred in the middle column
              P3 → justify-self: end    → flush with RIGHT edge of band

            That way the three principles span the FULL width of the
            80% band (left edge, centre, right edge) instead of
            clustering near the centre as they did with the old
            `1fr 260px 260px 260px 1fr` grid. The horizontal staircase
            now spans 80% of the page; the vertical staircase
            (STICKY_TOPS) keeps the brand-book ladder feel. */}
        {principles.map((p, i) => {
          const justify =
            i === 0 ? "start" : i === 1 ? "center" : "end";
          return (
            <div
              key={p.n}
              className="absolute"
              style={{
                top: SCOPE_STARTS[i + 1],
                height: SCOPE_HEIGHTS[i + 1],
                left: "10%",
                right: "10%",
              }}
            >
              <div
                className="sticky"
                style={{ top: STICKY_TOPS[i] }}
              >
                <div
                  className="grid gap-x-8"
                  style={{
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  }}
                >
                  <div
                    style={{
                      gridColumnStart: i + 1,
                      justifySelf: justify,
                      maxWidth: "340px",
                    }}
                  >
                    <PrincipleBlock {...p} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 5) CLOSING sub-scope — enters last, exits last.

            Anchored to the BOTTOM of the viewport with
            `top: calc(100vh - 280px)`. The 280px bottom margin
            reserves enough room for the closing block's full content:

              - h3 "We are a STUDIO, not a single product."  (~96px,
                wraps to two lines at 40px font-size inside max-w-xl)
              - mt-3 spacer  (12px)
              - p (3-4 lines of body at 16px / line-height 1.6)
                (~100px)
              - ~70px breathing room below the paragraph

            Total ≈ 280px. Previous value (200px) was too tight and
            the last 1-2 lines of the paragraph were being clipped at
            the bottom of the viewport.

            On viewports ≥ 900px this still leaves a healthy gap
            (~40-140px depending on screen) between the bottom of P3
            (sticky at 47vh + ~150px of content) and the top of the
            closing block, so the three-zone composition stays clean. */}
        <div
          className="absolute"
          style={{
            top: SCOPE_STARTS[4],
            height: SCOPE_HEIGHTS[4],
            left: "10%",
            right: "10%",
          }}
        >
          <div
            className="sticky"
            style={{ top: "calc(100vh - 280px)" }}
          >
            <ClosingBlock />
          </div>
        </div>
      </div>
    </section>

    {/* Mobile-only "We are a STUDIO, not a single product." anchor
        moment. Lives OUTSIDE the `<section id="what-we-do">` (as a
        SIBLING) so that once the user scrolls past it, the WhatWeDo
        section is already over — the floating section title can hand
        off directly to "What we don't" without flashing "What we do"
        again on the way out.

        `id="studio-closing-mobile"` flags this div as a CHROME-FREE
        zone (see `useChromeFreeZone`). Every floating mobile navbar
        element (backdrop blur, brand mark, hamburger, section title)
        fades out while the block is dominating the viewport. */}
    <div
      id="studio-closing-mobile"
      className="my-32 flex min-h-[80vh] items-center px-6 md:hidden"
    >
      <Reveal>
        <ClosingBlock />
      </Reveal>
    </div>
    </>
  );
}
