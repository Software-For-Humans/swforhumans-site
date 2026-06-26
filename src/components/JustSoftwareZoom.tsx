"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Forwarded to the wrapper so `useChromeFreeZone` can still observe
   *  this block by id (`#wedont-tagline-mobile`). */
  id?: string;
  className?: string;
  /** Total scroll travel of the pinned section. Taller = slower zoom. */
  height?: string;
};

/**
 * "Just Software, for humans." — immersive closing beat.
 *
 * A pinned (sticky) full-bleed photo that ZOOMS as the user scrolls.
 * The tagline is hidden while you scroll IN (you only see the photo),
 * then fades in once the photo is centered and filling the section,
 * and fades back out as the section scrolls away — handing off to the
 * next panel cleanly.
 *
 * Driven by a single scroll handler computing 0→1 progress from the
 * wrapper's position, the same lightweight pattern as `StickyZoomText`:
 *   - `scale`   : 1.0 → 1.28 across the whole travel (continuous zoom)
 *   - tagline   : opacity ramps in over progress 0.32→0.50, holds to
 *                 0.82, then ramps out by 1.0
 *   - scrim     : a dark radial vignette that fades in WITH the tagline
 *                 so white type stays legible over the bright laptop
 *                 screen in the photo
 *
 * Respects `prefers-reduced-motion`: the photo sits at a gentle fixed
 * zoom and the tagline is shown immediately, no scroll animation.
 */
export function JustSoftwareZoom({
  id,
  className = "",
  height = "250vh",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    const text = textRef.current;
    const scrim = scrimRef.current;
    if (!wrapper || !img || !text) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      img.style.transform = "scale(1.1)";
      text.style.opacity = "1";
      if (scrim) scrim.style.opacity = "0.85";
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));

      // Continuous zoom across the whole pinned travel.
      const scale = 1.0 + 0.28 * progress;
      img.style.transform = `scale(${scale.toFixed(4)})`;

      // Tagline: in over 0.32→0.50 (photo now filling the section),
      // hold, then out over 0.82→1.0.
      let t = 0;
      if (progress < 0.32) t = 0;
      else if (progress < 0.5) t = (progress - 0.32) / 0.18;
      else if (progress < 0.82) t = 1;
      else t = Math.max(0, 1 - (progress - 0.82) / 0.18);

      text.style.opacity = t.toFixed(3);
      if (scrim) scrim.style.opacity = (t * 0.85).toFixed(3);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={`relative ${className}`}
      style={{ height }}
    >
      {/* NO background here — the pinned panel is transparent so the
          SAME shared aurora that paints WhatWeDo/WhatWeDont shows
          through continuously. (A previous version painted its own
          gradient, but its darker top edge read as a "darkened card"
          seam against the aurora above — removed so the gradient
          background stays one continuous field with no visible band.)

          `px-4 py-32` insets the rounded photo card so a GENEROUS band
          of the continuous aurora frames it top and bottom (thin band
          at the sides). That gradient frame — sitting in the colourful
          centre of the aurora viewport — is the breathing room between
          the photo and both neighbours (the items above and the light
          Products panel below), all in gradient, never a dark band. */}
      <div className="sticky top-0 flex h-screen items-center justify-center px-4 py-32">
        {/* Rounded photo card — `overflow-hidden` clips the zooming
            image (and the scrim + tagline) to the rounded silhouette. */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
          {/* Zooming photo — fills the card, scaled from center. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src="/just-software-bg.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transformOrigin: "center", willChange: "transform" }}
          />

          {/* Legibility scrim — fades in with the tagline. */}
          <div
            ref={scrimRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: 0,
              background:
                "radial-gradient(75% 65% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.7) 100%)",
            }}
          />

          {/* Tagline — same wording/treatment as the rest of the site. */}
          <div
            ref={textRef}
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
            style={{ opacity: 0, willChange: "opacity" }}
          >
            <p
              className="text-center text-white"
              style={{ fontSize: "var(--text-tagline-sm)", lineHeight: 1.2, fontWeight: 300 }}
            >
              Just Software
              <br />
              <em className="italic font-bold">for humans.</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
