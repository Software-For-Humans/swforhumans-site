"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "fade" | "from-left" | "from-right";

type Props = {
  children: React.ReactNode;
  /** ms delay before the reveal kicks in */
  delay?: number;
  /** Visible fraction needed to trigger (0..1) */
  threshold?: number;
  /** Animation variant */
  variant?: Variant;
  className?: string;
  as?: React.ElementType;
};

/**
 * Plays its children's entry animation the first time they enter the
 * viewport. Uses IntersectionObserver — no scroll listeners, no jank.
 */
export function Reveal({
  children,
  delay = 0,
  threshold = 0.15,
  variant = "up",
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If user prefers reduced motion, skip the observation entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One-time, conditional set (then bail) — not a cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -80px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const variantClass =
    variant === "fade"
      ? "reveal--fade"
      : variant === "from-left"
        ? "reveal--from-left"
        : variant === "from-right"
          ? "reveal--from-right"
          : "";

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={[
        "reveal",
        variantClass,
        visible ? "is-visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
