import { Products } from "@/components/sections/Products";
import { Nav } from "@/components/Nav";

/**
 * Products preview — Shopledger card (current product) + ghosted
 * upcoming products + the "New ideas coming soon" sticky-zoom moment.
 *
 * Per the brand book (page 22), this section sits on a LIGHT GRAY
 * background once we do the brand pass. Right now it still uses the
 * dark scheme.
 */
export default function ProductsPreview() {
  return (
    <main>
      <div className="sticky z-50" style={{ top: "16px" }}>
        <Nav variant="floating" />
      </div>
      <div style={{ height: "30vh" }} />
      <Products />
      <div style={{ height: "100vh" }} />
    </main>
  );
}
