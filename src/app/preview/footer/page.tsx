import { Footer } from "@/components/Footer";

/**
 * Footer preview — newsletter + columns + giant "SOFTWARE FOR HUMANS"
 * wordmark over the brand gradient.
 *
 * Reference: brand book page 27.
 */
export default function FooterPreview() {
  return (
    <main>
      {/* Tall spacer above so the Footer's "shutter" reveal triggers
          naturally as you scroll into it. */}
      <div style={{ height: "120vh" }} />
      <Footer />
    </main>
  );
}
