import { Contact } from "@/components/sections/Contact";
import { Nav } from "@/components/Nav";

/**
 * Contact preview — "Get in touch." plus email / general / mailing address
 * triplet at the bottom.
 *
 * Per the brand book (page 26), this section sits on a LIGHT GRAY
 * background. Brand pass still pending.
 */
export default function ContactPreview() {
  return (
    <main>
      <div className="sticky z-50" style={{ top: "16px" }}>
        <Nav variant="floating" />
      </div>
      <div style={{ height: "30vh" }} />
      <Contact />
      <div style={{ height: "60vh" }} />
    </main>
  );
}
