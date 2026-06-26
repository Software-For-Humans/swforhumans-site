import Link from "next/link";
import type { Metadata } from "next";
import { AuroraBackground } from "@/components/AuroraBackground";
import { LogoIsotype } from "@/components/LogoIsotype";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Branded 404 — mirrors the site's dark aurora aesthetic instead of the
 * framework default, with a clear path back home.
 */
export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <AuroraBackground noTopFade />

      <div className="relative z-10 flex flex-col items-center">
        <LogoIsotype className="mb-8 h-16 w-auto text-white" />

        <p
          className="font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(48px, 12vw, 96px)", lineHeight: 1 }}
        >
          404
        </p>
        <h1
          className="mt-4 font-medium tracking-tight text-white"
          style={{ fontSize: "clamp(20px, 5vw, 28px)" }}
        >
          This page wandered off.
        </h1>
        <p
          className="mt-3 max-w-sm font-light"
          style={{ color: "rgba(255, 255, 255, 0.7)", lineHeight: 1.5 }}
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>

        <Link
          href="/"
          className="link-underline mt-8 inline-flex items-center rounded-full px-7 py-3 font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.14)" }}
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
