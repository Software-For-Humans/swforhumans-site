"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Max pixel offset at the cursor's farthest reach */
  strength?: number;
};

/**
 * Magnetic CTA: the button drifts toward the cursor when hovered,
 * snapping smoothly back to rest on leave. Pure transform — no layout shift.
 */
export function MagneticLink({
  href,
  children,
  className = "",
  style,
  strength = 14,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let active = false;

    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      // keep ticking while we're not yet at rest
      if (active || Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy =
        (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      tx = dx * strength;
      ty = dy * strength;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      active = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      active = false;
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <Link
      ref={ref}
      href={href}
      className={`magnetic ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}
