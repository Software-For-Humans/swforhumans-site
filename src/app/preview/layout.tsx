/**
 * Preview layout — wraps every /preview/* page with a tiny floating
 * back-link to the preview index so you can ping between sections
 * while iterating without typing URLs by hand.
 *
 * Kept intentionally minimal: no nav, no footer, no fonts override.
 * The root layout provides those. This is purely scaffolding while
 * we redesign section-by-section against the new brand book.
 */
import Link from "next/link";
import type { Metadata } from "next";

// Internal design-preview pages — keep them out of search indexes even
// though they ship in the static export.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Floating back-link, top-left. Pointer-events: auto so it stays
          clickable even when overlapping sticky section headers. */}
      <Link
        href="/preview"
        className="fixed left-4 top-4 z-[200] rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/75"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        ← All sections
      </Link>
      {children}
    </>
  );
}
