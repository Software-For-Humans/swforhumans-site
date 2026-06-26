"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ContactForm } from "./ContactForm";
import { useChromeFreeZone } from "./useChromeFreeZone";

const navItems = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Side hamburger menu with animated entry, staggered link reveal,
 * Google-Material-style hover lines, and a built-in "Get in touch"
 * trigger that opens the ContactForm modal.
 *
 * Three pieces:
 *   1. The fixed hamburger BUTTON in the top-right corner — its bars
 *      morph into an X when the menu is open.
 *   2. The BACKDROP (fades in) + the SIDE PANEL (slides in from the
 *      right) — clicking outside or pressing Escape closes both.
 *   3. The CONTACT BUTTON inside the panel — opens the ContactForm
 *      and closes the menu.
 */
export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  /**
   * `scrolled` mirrors the `MobileBrandMark`'s scroll-triggered
   * visibility — true once the user is past 50vh of scroll, i.e. once
   * the Hero's big centred logo has moved off-screen. The button
   * stays HIDDEN during the Hero (so the page header reads clean) and
   * fades IN together with the brand mark to form the persistent
   * navbar for the rest of the page.
   *
   * EXCEPTION: when the menu is OPEN the button becomes the X-close
   * affordance and MUST stay visible regardless of scroll position
   * (otherwise the user couldn't dismiss the menu they just opened
   * from a scrolled-back-to-top page).
   */
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // When the menu opens: move focus into the panel, trap Tab inside it,
  // and return focus to the hamburger button when it closes.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = btnRef.current;
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // Return focus to the trigger when the menu closes (skip if a
      // contact form is taking over focus).
      if (!contactOpen) trigger?.focus();
    };
  }, [open, contactOpen]);

  // Lock body scroll while either the menu or the contact form is open.
  useEffect(() => {
    const locked = open || contactOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, contactOpen]);

  // Escape to close.
  useEffect(() => {
    if (!open && !contactOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (contactOpen) setContactOpen(false);
        else if (open) setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, contactOpen]);

  // Track scroll position so the button can fade in once the user has
  // scrolled past the Hero. 50vh matches the threshold used by
  // `MobileBrandMark`, so the brand mark and the menu button appear
  // together as a single navbar reveal.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /** Hides the button when the user is in a chrome-free zone
   *  (Footer, "We are a STUDIO" anchor) so the composition takes the
   *  full screen — UNLESS the menu is open, in which case the button
   *  has to stay visible as the X close affordance. */
  const inChromeFreeZone = useChromeFreeZone();

  /** Button visible if the menu is OPEN (X close, can't be hidden),
   *  OR the user has scrolled past the Hero AND not in a chrome-
   *  free zone. Hidden otherwise. */
  const buttonVisible = open || (scrolled && !inChromeFreeZone);

  return (
    <>
      {/* Hamburger button. Fixed top-right.

          Position:
            - `top-12` (48px) on mobile → sits below the Hero marquee
              band (which lives at `top: 0` of the Hero with ~36px of
              height). Earlier `top-5` (20px) had it overlapping the
              marquee text.
            - `md:top-5` (20px) on desktop → no marquee collision; the
              compact original top position back.

          Style:
            - NO background circle. The user wanted three bare white
              lines floating against the page, so the previous
              `bg-black/45 backdrop-blur-md rounded-full` is removed.
              The lines stay legible against the dark aurora thanks
              to a subtle drop-shadow on each bar.
            - When OPEN, a very faint `bg-white/10` overlay returns so
              the X morph still reads against the side panel's dark
              gradient (otherwise white-on-deep-navy at the panel edge
              washes out).

          Hidden when the side panel is open (the panel's own close
          button takes over). */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-hidden={!buttonVisible}
        tabIndex={buttonVisible ? 0 : -1}
        className={`hamburger-btn fixed top-4 right-6 z-[110] flex h-12 w-12 flex-col items-center justify-center gap-[6px] rounded-full hover:scale-105 md:top-5 ${
          open ? "bg-white/10 backdrop-blur-md" : ""
        }`}
        style={{
          opacity: buttonVisible ? 1 : 0,
          transform: buttonVisible ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: buttonVisible ? "auto" : "none",
          transition:
            "opacity 0.35s ease-out, transform 0.35s ease-out, background-color 0.3s ease-out",
        }}
      >
        <span
          aria-hidden="true"
          className="block h-[2px] w-6 bg-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            transform: open
              ? "translateY(8px) rotate(45deg)"
              : "translateY(0) rotate(0)",
          }}
        />
        <span
          aria-hidden="true"
          className="block h-[2px] w-6 bg-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-all duration-200"
          style={{ opacity: open ? 0 : 1 }}
        />
        <span
          aria-hidden="true"
          className="block h-[2px] w-6 bg-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{
            transform: open
              ? "translateY(-8px) rotate(-45deg)"
              : "translateY(0) rotate(0)",
          }}
        />
      </button>

      {/* Backdrop. Fades in. Click closes the menu. */}
      <div
        className="fixed inset-0 z-[95] bg-black/55 backdrop-blur-[2px] transition-opacity duration-500"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Side panel. Slides in from the right. `inert` when closed so the
          off-screen links are removed from the tab order and the
          accessibility tree (and can't be reached behind the page). */}
      <aside
        ref={panelRef}
        className="fixed top-0 right-0 z-[100] h-full w-full max-w-md shadow-2xl"
        style={{
          backgroundColor: "#152838",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
        inert={!open}
        aria-label="Site menu"
      >
        {/* Aurora-style decorative gradient inside the panel. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: 0.5 }}
        >
          <div
            className="absolute -top-32 -right-20 h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(176,80,152,0.35) 0%, rgba(176,80,152,0) 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,255,133,0.28) 0%, rgba(0,255,133,0) 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        {/* Nav links — staggered fade-in from the right when menu opens. */}
        <nav className="relative flex h-full flex-col justify-between px-10 py-24 md:px-14 md:py-28">
          <ul className="space-y-2">
            {navItems.map((item, i) => (
              <li
                key={item.href}
                className="menu-item"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(40px)",
                  transition: open
                    ? `opacity 0.5s ease-out ${200 + i * 70}ms, transform 0.5s ease-out ${200 + i * 70}ms`
                    : `opacity 0.2s ease-out, transform 0.2s ease-out`,
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="menu-link group relative flex items-center py-3"
                >
                  {/* Sliding underline (Material-style). */}
                  <span
                    aria-hidden="true"
                    className="menu-link-line absolute left-0 bottom-0 h-[1px] w-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:w-full"
                  />
                  <span
                    className="menu-link-label text-white"
                    style={{
                      fontSize: "var(--text-tagline-sm)",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact CTA at the bottom of the panel. */}
          <div
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(20px)",
              transition: open
                ? `opacity 0.6s ease-out ${200 + navItems.length * 70 + 100}ms, transform 0.6s ease-out ${200 + navItems.length * 70 + 100}ms`
                : "opacity 0.2s, transform 0.2s",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTimeout(() => setContactOpen(true), 300);
              }}
              className="menu-cta group relative w-full overflow-hidden rounded-full border border-white/20 px-8 py-4 text-left transition-all duration-300 hover:border-white/40"
            >
              {/* Sliding accent fill on hover. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
              />
              <span className="relative flex items-center justify-between text-white">
                <span style={{ fontSize: "var(--text-body)", fontWeight: 500 }}>
                  Get in touch
                </span>
                <span
                  className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Contact form modal — rendered only when open so its entry
          animation plays cleanly each time. */}
      {contactOpen && <ContactForm onClose={() => setContactOpen(false)} />}
    </>
  );
}
