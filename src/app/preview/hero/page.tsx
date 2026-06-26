import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/Nav";

/**
 * Hero preview — renders the Hero section in isolation, plus the floating
 * Nav since the Nav visually lives inside the Hero (it's positioned in flow
 * after the Hero with `marginTop: -80px` to lift it into the hero's bottom
 * area). Without the Nav the hero's bottom would feel empty.
 *
 * Reference: brand book pages 19 (home) + 15 (tablet mockup).
 */
export default function HeroPreview() {
  return (
    <main>
      <Hero />
      <div
        className="sticky z-50"
        style={{ top: "16px", marginTop: "-80px" }}
      >
        <Nav variant="floating" />
      </div>
      {/* Tail so you can scroll a bit past the hero and see the bottom
          edge transitioning into nothing — useful for judging the seam. */}
      <div style={{ height: "60vh" }} />
    </main>
  );
}
