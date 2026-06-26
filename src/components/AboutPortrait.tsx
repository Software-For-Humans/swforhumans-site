"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Portrait image for the About section.
 *
 * Lives in its own client component so the surrounding About section
 * can stay a server component. Renders the silhouette on the right
 * side, sticky-pinned to viewport center while the user scrolls
 * through the section, with TWO stacked image layers (one blurred
 * for the soft halo, one sharp for the silhouette).
 *
 * ENTRANCE ANIMATION:
 *   Fades in smoothly when the section first enters the viewport.
 *   Uses an IntersectionObserver to flip a `visible` state, which
 *   the inner wrapper transitions from
 *     opacity 0  + translateY(24px) + scale(0.96)
 *   to
 *     opacity 1  + translateY(0)    + scale(1)
 *   over ~1.6s with an ease-out-expo curve so it feels atmospheric
 *   rather than abrupt. The observer disconnects after the first
 *   reveal so the animation only plays once per page load.
 *
 *   Respects `prefers-reduced-motion`: users with reduced motion
 *   skip the animation and the image is shown immediately at full
 *   opacity.
 *
 * STICKY CORRECTNESS:
 *   - Outer div is `position: absolute` spanning the section's full
 *     height (gives the inner sticky room to travel).
 *   - Middle div is `position: sticky` — pins the image to viewport
 *     while the section scrolls behind it.
 *   - Innermost wrapper carries the entrance animation transforms.
 *     `transform` on a sticky DESCENDANT is safe — it doesn't break
 *     the sticky pin above it.
 *   - The two `<img>` are absolute children of the transformed
 *     wrapper, so they're contained inside its transform context.
 */
export function AboutPortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion users see the image immediately, no animation.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // One-time, conditional set (then bail) — not a cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      {
        // Trigger when the section is meaningfully in view — top of
        // the absolute wrapper has crossed about 85% of the viewport.
        threshold: 0.05,
        rootMargin: "0px 0px -15% 0px",
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden md:block"
      style={{ zIndex: 0, width: "42%" }}
    >
      <div className="sticky" style={{ top: "15vh", height: "75vh" }}>
        <div
          className="relative h-full w-full"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : "translateY(24px) scale(0.96)",
            transition:
              "opacity 1.6s cubic-bezier(0.22, 1, 0.36, 1), transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
            // Hint to the browser that opacity + transform will animate
            // so it composites on the GPU and the fade stays buttery.
            willChange: visible ? "auto" : "opacity, transform",
          }}
        >
          {/* Soft halo — blurred copy creates a mist around the silhouette.
              Plain <img> is intentional: static export disables the
              next/image optimizer, and this is a small decorative asset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about-portrait.png"
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              opacity: 0.35,
              filter: "blur(16px)",
            }}
          />
          {/* Sharp silhouette on top of the halo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/about-portrait.png"
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            style={{ opacity: 0.55 }}
          />
        </div>
      </div>
    </div>
  );
}
