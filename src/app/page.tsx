import { AuroraBackground } from "@/components/AuroraBackground";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { MobileNav } from "@/components/MobileNav";
import { Hero } from "@/components/sections/Hero";
import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { WhatWeDont } from "@/components/sections/WhatWeDont";
import { Products } from "@/components/sections/Products";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <main id="main-content" className="flex-1">
        {/*
          ============================================================
          DARK PANEL — Hero + WhatWeDo + WhatWeDont share ONE aurora.
          ============================================================
          The outer light-gray wrapper paints the page bg behind the
          panel so the rounded-bottom corner cutouts show the same
          light gray as the Products section below (not the body's
          dark gray).

          The inner `relative` wrapper hosts a SINGLE AuroraBackground
          that covers all three sections continuously. The aurora's
          sticky-pinned inner stays at viewport top for the entire
          ~738vh of dark content — no per-section auroras to release
          and re-pin, so the gradient reads as one uninterrupted panel.
        */}
        <div style={{ backgroundColor: "#B0B0B0" }}>
          {/* `isolate` creates a stacking context on this wrapper. Without
              it, the AuroraBackground's `z-index: -10` would push the
              aurora behind the light-gray wrapper above, making the
              gradient invisible. With isolation, -10 stays scoped to
              THIS wrapper so the aurora sits behind the section content
              but above the page's light-gray bg. */}
          <div className="relative isolate">
            {/* Light-gray backdrop sitting BEHIND the aurora (at
                `-z-20`, vs the aurora's `-z-10`). Defensive against
                any potential transparent gap inside the dark panel. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-20"
              style={{ backgroundColor: "#B0B0B0" }}
            />
            {/* AuroraBackground is SHARP again — clip-path rounding on
                this tall sticky element repainted inconsistently on
                scroll (rounded one direction, square the other). The
                rounded dark→light transition is now done with two
                static "inverted corner" overlays at the bottom corners
                of this panel (see `RoundedBottomCutout` below): solid
                light-gray concave corners that sit ON TOP of the aurora
                and reveal the gray Products panel underneath the curve.
                Static elements → always rounded, no scroll repaint bug. */}
            <AuroraBackground noTopFade />

            <Hero />

            {/*
              Floating nav for the DARK panel. Negative margin lifts it
              into the Hero's bottom area at scrollY=0; then it sticks
              at top:16 throughout the dark panel.

              `hidden md:block` — on mobile the HamburgerMenu (fixed
              top-right, always visible) provides primary navigation,
              so this floating nav would only repeat content and the
              four links don't fit comfortably on a 375px viewport.
            */}
            <div
              className="hidden md:block sticky z-50"
              style={{ top: "16px", marginTop: "-80px" }}
            >
              <Nav variant="floating" />
            </div>

            {/* MOBILE floating nav — same behaviour as the desktop one:
                lifted into the Hero's bottom at scrollY=0, then pinned
                just below the top navbar (`top: 56px`) throughout the
                dark panel. White text, no background. */}
            <div
              className="md:hidden sticky z-50"
              style={{ top: "56px", marginTop: "-64px" }}
            >
              <MobileNav />
            </div>

            <WhatWeDo />
            {/* Buffer between WhatWeDo and WhatWeDont — lets WhatWeDo's
                sticky principles finish their exit before WhatWeDont's
                sticky title/closing/items start entering. Transparent
                so the shared aurora flows through it uninterrupted.

                MOBILE: collapsed to 0 because the mobile fallbacks are
                simple stacks (no sticky choreography), and the
                sections' own `py-24` padding already provides ample
                vertical space between them. */}
            <div
              aria-hidden="true"
              className="h-0 md:h-[60vh]"
            />
            <WhatWeDont />
            {/* Tail buffer at the end of the dark panel — gives
                WhatWeDont's sticky elements room to fully exit before
                the dark wrapper ends and the light Products section
                begins. The aurora's rounded bottom corners sit at the
                BOTTOM of this buffer (i.e. at the bottom of the dark
                wrapper as a whole).

                MOBILE: small 5vh tail so the dark→light transition
                still has a hint of bottom padding before the rounded
                corners, without the 40vh of empty dark space the
                desktop layout needs for sticky release. */}
            {/* Tail buffer. On MOBILE collapsed to 0 so the rounded
                dark→light transition (created by the LIGHT panel's
                rounded TOP corners + `-mt-10` overlap) sits RIGHT at
                the end of the WhatWeDont tagline section, with no
                dead dark space between them. */}
            <div
              aria-hidden="true"
              className="h-0 md:h-[40vh]"
            />

            {/*
              ROUNDED-BOTTOM transition — two static "inverted corner"
              overlays pinned to the bottom corners of the dark panel.
              Each is a 40px light-gray square with a transparent
              quarter-circle bitten out of its INNER corner (radial
              gradient). Sitting ON TOP of the aurora at the panel's
              bottom, they make the gradient read as having rounded
              bottom corners, with the light gray showing through the
              curve — the same gray as the Products panel directly
              below, so the curve blends seamlessly into it.

              Why this instead of clip-path on the aurora: clip-path on
              the tall sticky aurora repainted inconsistently while
              scrolling (rounded one way, square the other). These are
              plain positioned divs with a static gradient — always
              rounded, no repaint bug. `z-[5]` sits above the aurora
              (`-z-10`) but below the floating nav (`z-50`).
            */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 z-[5] h-10 w-10"
              style={{
                background:
                  "radial-gradient(circle 40px at top right, transparent 39.5px, #B0B0B0 40.5px)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 z-[5] h-10 w-10"
              style={{
                background:
                  "radial-gradient(circle 40px at top left, transparent 39.5px, #B0B0B0 40.5px)",
              }}
            />
          </div>
        </div>

        {/*
          ============================================================
          LIGHT BLOCK — Products + About + Contact share one light bg.
          ============================================================
          A SECOND Nav lives at the start of this block so the floating
          nav stays visible after the dark panel's containing-block
          ends. The two Navs are visually identical and the user reads
          them as one continuous element across the page.

          Each LIGHT section is separated from the next by a transparent
          buffer so the previous section's sticky elements finish their
          exit before the next section's sticky entry begins.
        */}
        {/* LIGHT panel — now FLAT-topped. The rounded dark→light
            transition is owned by the gradient panel above (its aurora
            has a rounded BOTTOM that reveals this panel's light gray in
            the corners). So this wrapper just sits flat directly below,
            same `#B0B0B0` so the gradient's rounded-corner reveal blends
            seamlessly into it. */}
        <div
          className="relative z-10"
          style={{
            backgroundColor: "#B0B0B0",
          }}
        >
          {/* `hidden md:block` — same reasoning as the dark-panel
              floating nav: mobile uses the HamburgerMenu and a fourth
              link would push this row off-screen on narrow viewports. */}
          <div
            className="hidden md:block sticky z-50"
            style={{ top: "16px", marginTop: "-80px" }}
          >
            {/*
              `theme="light"` (white text) for BOTH floating navs — the
              user requested visual consistency: the dark-panel nav and
              the light-panel nav should look identical (both white).
              Yes, this gives the nav lower contrast against the light
              `#C0C0C0` background, but it matches the brand intent of
              one continuous, quietly-floating navigation across the
              whole page.
            */}
            <Nav variant="floating" theme="light" />
          </div>

          {/* MOBILE floating nav — second instance so it keeps pinning
              after the dark panel's sticky containing block ends (same
              two-instance approach as the desktop nav). */}
          <div
            className="md:hidden sticky z-50"
            style={{ top: "56px", marginTop: "-64px" }}
          >
            <MobileNav />
          </div>

          <Products />
          {/* Buffers between LIGHT sections — large on desktop so each
              section's sticky elements can fully exit before the next
              section's sticky entry. Collapsed on mobile (no sticky
              choreography, sections own their padding). */}
          <div aria-hidden="true" className="h-0 md:h-[60vh]" />
          <About />
          <div aria-hidden="true" className="h-0 md:h-[60vh]" />
          <Contact />
          {/* Tail buffer at the end of the light block — gives Contact's
              sticky tagline + items room to fully exit before Footer's
              rounded-top panel emerges. */}
          <div aria-hidden="true" className="h-[5vh] md:h-[40vh]" />
        </div>
      </main>

      {/*
        Light-gray wrapper around the Footer so the rounded TOP corner
        cutouts show the same light gray as Contact above (not the
        body's dark gray).
      */}
      <div style={{ backgroundColor: "#B0B0B0" }}>
        <Footer />
      </div>
    </>
  );
}
