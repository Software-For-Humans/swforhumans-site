import { site } from "@/lib/site";
import { Reveal } from "../Reveal";

type Item = {
  label: string;
  body: React.ReactNode;
  /** Right-align label + body (the brand book mockup right-aligns the
   *  "Mailing address" column so its block sits against the page's
   *  right edge). */
  align?: "left" | "right";
};

/**
 * Contact section — final light-gray panel of the page, per brand book
 * page 26.
 *
 * Layout:
 *   - Center-RIGHT tagline "Get in touch." with description below.
 *   - Bottom row, 3 columns evenly distributed: Email / General /
 *     Mailing address. ALL TEXT IS WHITE (user request: previously the
 *     dt labels and description were muted gray; the user prefers a
 *     uniform white treatment matching the rest of the dark sections'
 *     copy treatment).
 *
 * Section is 160vh tall on desktop to give each sticky sub-scope its
 * own scroll travel: the heading lives in the upper 70vh sub-scope and
 * the items in the lower 90vh sub-scope so they exit cleanly on scroll
 * without colliding with each other.
 *
 * NO ENTRY ANIMATION. The previous scroll-driven stagger fade-in on
 * the dl items was removed at the user's request — items are visible
 * the moment the section enters view, no useEffect, no class toggling,
 * no `.contact-item` selector. This also means the component no longer
 * needs `"use client"` since there's no client-side behaviour left.
 */
export function Contact() {
  const items: Item[] = [
    {
      label: "Email",
      body: (
        <a
          href={`mailto:${site.email.admin}`}
          className="link-underline text-[#ffffff] transition-opacity hover:opacity-90"
        >
          {site.email.admin}
        </a>
      ),
    },
    {
      label: "General",
      body: (
        <a
          href={`mailto:${site.email.hello}`}
          className="link-underline text-[#ffffff] transition-opacity hover:opacity-90"
        >
          {site.email.hello}
        </a>
      ),
    },
    {
      label: "Mailing address",
      align: "right",
      body: (
        <div className="text-[#ffffff]">
          <div>{site.legalName}</div>
          <div>{site.address.line1}</div>
          <div>{site.address.line2}</div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="contact"
      className="relative"
      style={{ backgroundColor: "#B0B0B0" }}
      aria-labelledby="contact-heading"
    >
      {/* ============================================================
          MOBILE — taller-than-viewport panel, LEFT-aligned (matches
          the About mobile composition the user approved).

          `min-h-[130vh]` matches About's mobile height so Contact
          OCCUPIES MORE vertical real estate (user request: both
          sections should be more spacious individually and read as
          more separated from each other). `pt-40 pb-40` adds extra
          breathing room top and bottom — together with About's
          matching padding this creates a generous gap at the
          About→Contact handover even though both sections share the
          same `#B0B0B0` background.

          - "Get in touch." headline + description anchored at the TOP
          - dl items (Email / General / Mailing address) stacked
            LEFT-aligned, anchored toward the BOTTOM with substantial
            space-y so each row reads as its own block
          - `flex-1` spacer pushes the heading top and the items
            bottom apart so the section spans the full 130vh
          ============================================================ */}
      <div className="flex min-h-[104vh] flex-col px-6 pt-40 pb-40 md:hidden">
        <Reveal>
          <div>
            <h2
              id="contact-heading"
              className="text-left tracking-tight"
              style={{
                fontSize: "var(--text-tagline-xl)",
                lineHeight: 1.05,
                color: "#ffffff",
              }}
            >
              <span style={{ fontWeight: 300 }}>Get in </span>
              <span style={{ fontWeight: 700 }}>touch.</span>
            </h2>
            <p
              className="mt-3 max-w-md font-light"
              style={{
                fontSize: "var(--text-body)",
                lineHeight: 1.45,
                color: "rgba(255, 255, 255, 0.85)",
              }}
            >
              Press, partnerships, product feedback, or just to say hello — we
              read every message.
            </p>
          </div>
        </Reveal>

        <div className="flex-1" />

        <dl
          className="space-y-7 text-left"
          style={{ fontSize: "var(--text-body)", lineHeight: 1.45 }}
        >
          {items.map((item, i) => (
            <Reveal key={item.label} delay={i * 100}>
              <div>
                <dt
                  className="text-[#ffffff]"
                  style={{ fontWeight: 500 }}
                >
                  {item.label}
                </dt>
                {/* Mobile: left-aligned. Overrides the `text-right` the
                    "Mailing address" item carries for the desktop layout. */}
                <dd className="mt-1 [&_*]:!text-left">{item.body}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>

      {/* ============================================================
          DESKTOP — original sticky choreography preserved.
          ============================================================ */}
      <div
        className="relative hidden md:block"
        style={{ height: "160vh" }}
      >
        {/* Heading sub-scope — tagline + description, pinned center-right. */}
        <div className="relative" style={{ height: "70vh", zIndex: 10 }}>
          <div
            className="sticky mx-auto"
            style={{ top: "40vh", width: "80%" }}
          >
            <div className="ml-auto max-w-2xl text-right">
              <h2
                className="tracking-tight"
                style={{
                  fontSize: "var(--text-tagline-xl)",
                  lineHeight: 1.05,
                  color: "#ffffff",
                }}
              >
                <span style={{ fontWeight: 300 }}>Get in </span>
                <span style={{ fontWeight: 700 }}>touch.</span>
              </h2>
              <p
                className="ml-auto mt-3 max-w-md font-light"
                style={{
                  fontSize: "var(--text-body)",
                  lineHeight: 1.45,
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                Press, partnerships, product feedback, or just to say hello —
                we read every message.
              </p>
            </div>
          </div>
        </div>

        {/* Items sub-scope — three columns pinned to the bottom. */}
        <div className="relative" style={{ height: "90vh" }}>
          <div
            className="sticky mx-auto"
            style={{ top: "calc(100vh - 180px)", width: "80%" }}
          >
            {/* `--text-body` instead of the previous hardcoded 18px,
                so the dl values participate in the design-token scale
                like every other body text on the site. */}
            <dl
              className="grid grid-cols-3 gap-12"
              style={{ fontSize: "var(--text-body)", lineHeight: 1.45 }}
            >
              {items.map((item) => (
                <div
                  key={item.label}
                  className={`justify-self-center ${
                    item.align === "right" ? "text-right" : ""
                  }`}
                >
                  {/* `dt` labels — dark, matching the gray-panel text. */}
                  <dt
                    className="text-[#ffffff]"
                    style={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </dt>
                  <dd className="mt-1">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
