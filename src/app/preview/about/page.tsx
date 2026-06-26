import { About } from "@/components/sections/About";
import { Nav } from "@/components/Nav";

/**
 * About preview — "Built in Virginia, Made for humans." with the company
 * description sitting top-left and the big tagline anchoring the bottom.
 *
 * Per the brand book (pages 24-25), this section sits on a LIGHT GRAY
 * background. Brand pass still pending.
 */
export default function AboutPreview() {
  return (
    <main>
      <div className="sticky z-50" style={{ top: "16px" }}>
        <Nav variant="floating" />
      </div>
      <div style={{ height: "30vh" }} />
      <About />
      <div style={{ height: "100vh" }} />
    </main>
  );
}
