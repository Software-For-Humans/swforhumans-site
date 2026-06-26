import type { Metadata } from "next";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import { MobileBrandMark } from "@/components/MobileBrandMark";
import { MobileNavBackdrop } from "@/components/MobileNavBackdrop";
import { PageLoader } from "@/components/PageLoader";
import "./globals.css";

// Brand fonts loaded via @fontsource-style imports below in globals.css.
// We expose the same CSS variable names so existing class usage stays valid.

export const metadata: Metadata = {
  metadataBase: new URL("https://swforhumans.com"),
  title: {
    default: "Software For Humans â€” Small, focused software studio",
    template: "%s Â· Software For Humans",
  },
  description:
    "Software For Humans builds small, focused software that respects the people using it. A studio based in Virginia. Maker of Shopledger.",
  keywords: [
    "software studio",
    "Virginia",
    "Shopledger",
    "humane software",
    "small software",
  ],
  authors: [{ name: "Software For Humans, LLC" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Software For Humans â€” Small, focused software studio",
    description:
      "We build small, focused software that respects the people using it.",
    url: "https://swforhumans.com",
    siteName: "Software For Humans",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Software For Humans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software For Humans â€” Small, focused software studio",
    description:
      "We build small, focused software that respects the people using it.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Organization structured data â€” helps search engines and social
            platforms understand the brand. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Software For Humans, LLC",
              alternateName: "Software For Humans",
              url: "https://swforhumans.com",
              logo: "https://swforhumans.com/icon.png",
              image: "https://swforhumans.com/og-image.png",
              description:
                "We build small, focused software that respects the people using it.",
              email: "hello@swforhumans.com",
              foundingLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressRegion: "VA",
                  addressCountry: "US",
                },
              },
            }),
          }}
        />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {/*
          Full-screen page loader. Renders curtains + animated isotype
          while fonts load, then opens the curtains to reveal the page.
          Its logo is positioned to match the Hero's logo exactly so the
          handoff feels like a single, continuous element.
        */}
        {/*
          MOBILE NAVBAR STACK (rendered in z-index order from back to
          front):
            1. `MobileNavBackdrop` (z-[89])  â€” blurred strip behind
               the brand mark + button, so section text passing
               underneath is softened and doesn't visually clash with
               the white nav elements.
            2. `MobileBrandMark`  (z-[90])  â€” isotype + "Software for
               Humans" wordmark, fixed top-LEFT, fades in once the
               user scrolls past the Hero.
            3. `HamburgerMenu`    (z-[110]) â€” button on top-RIGHT,
               fades in with the brand mark; opens the side panel
               (z-[100]) with the page-dim backdrop (z-[95]).
            All three respect the same 50vh scroll threshold so they
            appear together as one cohesive navbar reveal.
        */}
        <PageLoader />
        <MobileNavBackdrop />
        <MobileBrandMark />
        {/* `MobileSectionTitle` was removed: each section now renders
            its OWN `<h2 className="sticky top-16 ...">` inline so the
            title scrolls with the section's natural flow and the
            browser handles the sticky pin (no JS scroll handler, no
            perceived float). The navbar backdrop was shrunk so the
            sticky titles sit BELOW its blur band â€” see
            `MobileNavBackdrop`. */}
        <HamburgerMenu />
        {children}
      </body>
    </html>
  );
}
