"use client";

type Blob = {
  background: string;
  top: string;
  left: string;
  width: string;
  height: string;
  animation: string;
};

/**
 * The brand's teal/sea-green aurora as a reusable, decorative background.
 * Drop it inside a `relative` parent (typically a section) and it fills
 * everything with the aurora + grain + vignette. The parent owns the
 * border-radius and overflow.
 */
// Matches the user-provided reference gradient:
//   - SOFT PINK / dusty rose tucked into the upper-LEFT corner
//   - LARGE ROYAL BLUE blob anchored in the lower-LEFT, climbing up the
//     side of the canvas
//   - MUTED TEAL dominating the middle (less saturated than the earlier
//     bright cyan — closer to a sea-green)
//   - SOFT PALE BLUE/LAVENDER wash in the upper-RIGHT
// The base color underneath is no longer pure black but a dark muted
// blue-teal so the colors don't read as neon over true black.
const blobs: Blob[] = [
  // 1. Dusty rose — concentrated in the upper-left corner only.
  {
    background:
      "radial-gradient(circle at 50% 50%, rgba(196, 112, 145, 0.75) 0%, rgba(196, 112, 145, 0) 65%)",
    top: "-20%",
    left: "-15%",
    width: "55%",
    height: "60%",
    animation: "aurora-1 32s ease-in-out infinite",
  },
  // 2. Royal blue — large, anchors the lower-left, runs up the left edge.
  {
    background:
      "radial-gradient(circle at 50% 50%, rgba(70, 95, 178, 0.9) 0%, rgba(70, 95, 178, 0) 65%)",
    top: "40%",
    left: "-20%",
    width: "85%",
    height: "95%",
    animation: "aurora-2 38s ease-in-out infinite",
  },
  // 3. Muted sea-green teal — dominant in the middle band.
  {
    background:
      "radial-gradient(ellipse 85% 65% at 50% 50%, rgba(58, 140, 142, 0.85) 0%, rgba(58, 140, 142, 0) 65%)",
    top: "15%",
    left: "5%",
    width: "100%",
    height: "85%",
    animation: "aurora-3 42s ease-in-out infinite",
  },
  // 4. Pale gray-blue highlight — upper-right, softens the corner.
  {
    background:
      "radial-gradient(circle at 50% 50%, rgba(180, 195, 220, 0.55) 0%, rgba(180, 195, 220, 0) 60%)",
    top: "-15%",
    left: "55%",
    width: "60%",
    height: "65%",
    animation: "aurora-4 36s ease-in-out infinite",
  },
];

type AuroraProps = {
  /** Same radius applied to all four corners (px). */
  rounded?: number;
  /** Overrides the top two corners (px). 0 = flat. */
  roundedTop?: number;
  /** Overrides the bottom two corners (px). 0 = flat. */
  roundedBottom?: number;
  /** If true, omit the dark top-to-transparent fade (use when the aurora
   *  joins another aurora at its top edge and the fade would create a
   *  visible dark band). */
  noTopFade?: boolean;
  /** If true, omit the dark "island" radial that sits in the upper area
   *  (centered ~60% horizontal, 15% vertical). Use when the aurora joins
   *  another at its top — the dark island would otherwise create a dark
   *  patch right at the seam. */
  noDarkIsland?: boolean;
};

export function AuroraBackground({
  rounded,
  roundedTop,
  roundedBottom,
  noTopFade,
  noDarkIsland,
}: AuroraProps) {
  const tl = roundedTop ?? rounded ?? 0;
  const tr = roundedTop ?? rounded ?? 0;
  const br = roundedBottom ?? rounded ?? 0;
  const bl = roundedBottom ?? rounded ?? 0;
  const hasRadius = tl || tr || br || bl;
  // clip-path inset shorthand: `round tl tr br bl`
  const clipPath = hasRadius
    ? `inset(0 round ${tl}px ${tr}px ${br}px ${bl}px)`
    : undefined;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        // CRITICAL: clip-path instead of `overflow: hidden`.
        // `overflow: hidden` would turn this wrapper into a scroll container,
        // which breaks `position: sticky` on its descendants (the sticky
        // would pin to this wrapper's top, but the wrapper doesn't scroll —
        // result: the aurora disappears as soon as the user scrolls into
        // the section). clip-path provides the rounded clipping WITHOUT
        // creating a scroll context.
        clipPath,
      }}
    >
      {/*
        Sticky inner layer that's exactly 100vh tall. The outer wrapper
        stretches the full section height (which can be 400vh+ for sections
        with sticky scroll choreography). Without this sticky layer, the
        aurora blobs — positioned at percentages of the parent — would be
        spread thinly across the entire section and barely visible. With
        sticky, the aurora always fills the visible viewport while the
        user scrolls through the section.

        Background-color lives here (not on the outer wrapper) so the black
        base also stays pinned with the visuals.
      */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        // Base is a dark muted blue-teal (not pure black) so the colors
        // sit on a related dark substrate rather than fighting black —
        // matches the reference where the darkest areas still read teal.
        //
        // Height: in TALL parents (Hero+WhatWeDo+WhatWeDont dark wrapper,
        // ~5285px) we want 100vh so the sticky inner pins to the viewport
        // and the gradient stays visible as the user scrolls through the
        // section. In SHORT parents (Footer ~698px) we want 100% of the
        // parent so the sticky inner doesn't overflow the parent — that
        // overflow used to contribute ~22px to the document's scrollHeight,
        // letting the user scroll past the footer into the dark canvas
        // (browser default with `color-scheme: dark`). `min(100%, 100vh)`
        // gives the smaller of the two: full viewport in tall parents,
        // exact parent height in short parents.
        style={{
          backgroundColor: "#152838",
          height: "min(100%, 100vh)",
        }}
      >
        {blobs.map((b, i) => (
          <div
            key={i}
            className="aurora-blob"
            style={{
              background: b.background,
              top: b.top,
              left: b.left,
              width: b.width,
              height: b.height,
              animation: b.animation,
              // `filter: blur()` and `mix-blend-mode: screen` live in the
              // `.aurora-blob` class so the mobile media query can lighten
              // the blur (inline styles would override it).
            }}
          />
        ))}

        {/* Dark "island" / vignette REMOVED to match the reference, which
            has no dark spot in the upper area and no corner vignette. Keep
            the noTopFade optional fade for sections that need contrast at
            their top (sections without a section header above the aurora). */}

        {!noDarkIsland && noDarkIsland !== undefined && null}

        {!noTopFade && (
          <div
            className="absolute inset-x-0 top-0 h-[30%]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)",
            }}
          />
        )}

        {/* Grain layers — opacities pushed up to match the reference, where
            the noise texture is heavily visible across the whole image. */}
        <div className="bg-noise absolute inset-0 opacity-[0.95] mix-blend-overlay" />
        <div className="bg-noise-coarse absolute inset-0 opacity-[0.7] mix-blend-soft-light" />
      </div>
    </div>
  );
}
