import { WhatWeDo } from "@/components/sections/WhatWeDo";
import { Nav } from "@/components/Nav";

/**
 * What We Do preview — section with the brand aurora and the three
 * sticky principles (1 Small on purpose / 2 Plain language / 3 Long-term
 * tools), plus the closing "We are a STUDIO" block.
 *
 * Includes the floating Nav at the top because the section's sticky
 * header coexists with it visually. Adds top + bottom spacers so you
 * can scroll into and out of the section to test the sticky behavior.
 *
 * Reference: brand book page 20.
 */
export default function WhatWeDoPreview() {
  return (
    <main>
      <div
        className="sticky z-50"
        style={{ top: "16px" }}
      >
        <Nav variant="floating" />
      </div>
      {/* Spacer above so we can see what happens as the section enters. */}
      <div style={{ height: "30vh" }} />
      <WhatWeDo />
      <div style={{ height: "100vh" }} />
    </main>
  );
}
