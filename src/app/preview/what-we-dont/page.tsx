import { WhatWeDont } from "@/components/sections/WhatWeDont";
import { Nav } from "@/components/Nav";

/**
 * What We Don't preview — the four negatives ("No grow hacks", "No
 * retargeting pixels", "No investors", "No dark patterns") plus the
 * closing "Just Software, for humans." line.
 *
 * Reference: brand book page 21.
 */
export default function WhatWeDontPreview() {
  return (
    <main>
      <div className="sticky z-50" style={{ top: "16px" }}>
        <Nav variant="floating" />
      </div>
      <div style={{ height: "30vh" }} />
      <WhatWeDont />
      <div style={{ height: "100vh" }} />
    </main>
  );
}
