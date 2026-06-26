import Link from "next/link";
import { AuroraBackground } from "./AuroraBackground";
import { legalLinks, site } from "@/lib/site";

/**
 * Footer — dark gradient panel that closes the page, per brand book
 * page 27.
 *
 * Layout:
 *   - Rounded TOP corners (40px) so the panel reads as a card sliding
 *     up from underneath the light-gray Contact section above.
 *   - Three contact columns up top, evenly distributed across the
 *     content width (Email / General / Mailing address — same data as
 *     the Contact section).
 *   - Giant "Software for HUMANS" wordmark dominating the center.
 *   - A short studio descriptor below the wordmark.
 *   - A discreet legal/copyright bar at the very bottom.
 */
export function Footer() {
  return (
    <footer
      // `isolate` creates a stacking context on the footer so the
      // AuroraBackground's `z-index: -10` stays scoped here. Without it,
      // -10 would push the aurora behind the page's light-gray wrapper
      // above the footer, making the gradient invisible.
      className="relative isolate"
      style={{ borderRadius: "40px 40px 0 0" }}
      aria-labelledby="footer-wordmark"
    >
      {/* Aurora is SQUARE — clip-path rounding repainted inconsistently
          while scrolling (rounded one direction, square the other), the
          same bug as the dark→light transition above. The rounded TOP
          corners are instead drawn with two static "inverted corner"
          overlays below: light-gray concave corners that sit ON TOP of
          the aurora and reveal the gray wrapper above. Static elements →
          always rounded, no scroll repaint bug. */}
      <AuroraBackground noDarkIsland noTopFade />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[5] h-10 w-10"
        style={{
          background:
            "radial-gradient(circle 40px at bottom right, transparent 39.5px, #B0B0B0 40.5px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-[5] h-10 w-10"
        style={{
          background:
            "radial-gradient(circle 40px at bottom left, transparent 39.5px, #B0B0B0 40.5px)",
        }}
      />

      {/* On mobile we widen the content band (90% instead of 80%) so the
          single-column contact info doesn't get squeezed, and the giant
          wordmark has more horizontal room before it has to wrap. */}
      <div
        className="relative z-10 mx-auto w-[90%] pt-20 pb-10 md:w-[80%] md:pt-24 md:pb-12"
      >
        {/* Top row — contact info.
              MOBILE  → single-column stack with generous `gap-y-7`
                       between Email / General / Mailing address. The
                       previous 2-column layout was causing the
                       multi-line Mailing address (3 stacked lines:
                       legal name + address line 1 + address line 2)
                       to overflow into the same row as Email's
                       single-line link, producing visible overlap on
                       small viewports. A vertical stack guarantees
                       each block reads as its own row with no
                       collision.
              DESKTOP → 3 equidistant columns (unchanged). */}
        <dl
          className="flex flex-col gap-y-7 md:grid md:grid-cols-3 md:gap-12"
          style={{
            // Smaller mobile body size — was `--text-body-sm` (16px),
            // now `--text-xs` (~13px) so the contact column reads as
            // quiet footer copy, not as primary content. Desktop keeps
            // the original size via the inline media-query-free
            // override below.
            fontSize: "var(--text-xs)",
            lineHeight: 1.45,
          }}
        >
          <ContactColumn
            label="Email"
            href={`mailto:${site.email.admin}`}
            text={site.email.admin}
          />
          <ContactColumn
            label="General"
            href={`mailto:${site.email.hello}`}
            text={site.email.hello}
            justify="center"
          />
          {/* Mailing address — left-aligned on mobile (matches the
              vertical stack rhythm), right-aligned on desktop where it
              sits as the 3rd grid column. */}
          <div className="md:justify-self-center md:text-right">
            <dt
              style={{
                color: "rgba(255, 255, 255, 0.75)",
                fontWeight: 500,
              }}
            >
              Mailing address
            </dt>
            <dd className="mt-1 text-white">
              <div>{site.legalName}</div>
              <div>{site.address.line1}</div>
              <div>{site.address.line2}</div>
            </dd>
          </div>
        </dl>

        {/* Center — giant "Software for HUMANS" wordmark.

            Desktop: `whitespace-nowrap` keeps it on a single line; the
            8.5vw fluid size is tuned against a 1280px viewport.

            Mobile: `whitespace-normal` allows the wordmark to wrap to
            two lines ("Software for" / "HUMANS") if the single-line
            width exceeds the 90% content band. This is the desired
            behaviour on small viewports (≤ 380px) where the fluid
            font-size hits its clamp minimum and a single line would
            still clip; on slightly wider mobiles it stays on one
            line naturally. */}
        <div className="mt-20 select-none overflow-hidden md:mt-28">
          <h2
            id="footer-wordmark"
            aria-label="Software For Humans"
            className="block whitespace-normal text-center text-white md:whitespace-nowrap"
            style={{
              fontSize: "var(--text-wordmark)",
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontWeight: 300 }}>Software for </span>
            <span style={{ fontWeight: 900 }}>Humans</span>
          </h2>
        </div>

        {/* Descriptor paragraph — short studio statement, centered.
            `--text-xs` on mobile (was `--text-body`) so the footer
            descriptor sits in the quiet "support copy" tier alongside
            the contact columns above, not competing with the wordmark. */}
        <p
          className="mx-auto mt-10 max-w-xl font-light text-center md:mt-16"
          style={{
            fontSize: "var(--text-xs)",
            lineHeight: 1.5,
            color: "rgba(255, 255, 255, 0.85)",
          }}
        >
          Software For Humans is the parent studio behind a growing portfolio
          of focused tools. Every product shares the same philosophy — but
          each one stands on its own, with its own brand, pricing, and
          audience.
        </p>

        {/* Bottom bar — legal links + copyright. Kept low-contrast and
            small so it doesn't compete with the wordmark above. */}
        <div className="mt-20 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p
              className="text-center md:text-left"
              style={{
                fontSize: "var(--text-micro)",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              © {site.year} {site.legalName} · {site.domains.primary}
            </p>
            {/* `--text-micro` (11px) — was a hardcoded 11px; now uses
                the design-token alias so a future change to the micro
                primitive cascades here too. */}
            <ul
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
              style={{ fontSize: "var(--text-micro)" }}
            >
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-opacity hover:opacity-80"
                    style={{ color: "rgba(255, 255, 255, 0.5)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactColumn({
  label,
  href,
  text,
  justify = "center",
}: {
  label: string;
  href: string;
  text: string;
  justify?: "center";
}) {
  void justify;
  return (
    <div className="md:justify-self-center">
      <dt
        style={{
          color: "rgba(255, 255, 255, 0.75)",
          fontWeight: 500,
        }}
      >
        {label}
      </dt>
      <dd className="mt-1">
        <a
          href={href}
          className="link-underline text-white transition-opacity hover:opacity-90"
        >
          {text}
        </a>
      </dd>
    </div>
  );
}
