"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/site";
import { AuroraBackground } from "../AuroraBackground";
import { MagneticLink } from "../MagneticLink";

type Project = {
  /** Display name (rendered uppercase in the row). */
  name: string;
  /** When true the row is a dimmed, non-expandable "Coming soon" slot. */
  comingSoon?: boolean;
  description?: string;
  url?: string;
  /** Banner image (desktop preview) — lives in /public. */
  image?: string;
  /** Square brand mark (mobile preview). */
  imageMobile?: string;
};

/**
 * The portfolio as an ACCORDION list (brand reference): each project is
 * one row — index number on the left, name centred, a "+" toggle on the
 * right. Clicking a real project expands its details (description,
 * preview, "Go to web"). Slots with no product yet read "Coming soon"
 * and are dimmed + non-interactive.
 */
// Map real products from /lib/site.ts; pad up to 3 rows with "Coming soon".
// Per-product preview images are looked up by name — drop a matching
// /public/<slug>-card.png to wire one up, otherwise the row renders with
// the tan placeholder backdrop.
const PRODUCT_IMAGES: Record<string, { image?: string; imageMobile?: string }> = {
  Shopledger: { image: "/shopledger-card.png", imageMobile: "/logo.png" },
};

const PROJECTS: Project[] = products.map((p) => ({
  name: p.name,
  description: p.description,
  url: p.url,
  image: PRODUCT_IMAGES[p.name]?.image,
  imageMobile: PRODUCT_IMAGES[p.name]?.imageMobile,
}));

while (PROJECTS.length < 3) {
  PROJECTS.push({ name: "Coming soon", comingSoon: true });
}

/** "+" that rotates 45° into an "×" when its row is open. */
function PlusToggle({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="relative inline-block"
      style={{
        width: 24,
        height: 24,
        transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        transform: open ? "rotate(45deg)" : "rotate(0deg)",
      }}
    >
      <span
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: "50%",
          height: 1.5,
          transform: "translateY(-50%)",
          backgroundColor: "#ffffff",
        }}
      />
      <span
        className="absolute"
        style={{
          top: 0,
          bottom: 0,
          left: "50%",
          width: 1.5,
          transform: "translateX(-50%)",
          backgroundColor: "#ffffff",
        }}
      />
    </span>
  );
}

/** Expanded panel revealed under a project row. */
function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="pb-12 pt-2 md:pb-16">
      <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
        {/* Preview — square brand mark on mobile, wide banner on desktop. */}
        <div
          className="aspect-[4/5] w-full rounded-3xl bg-center bg-no-repeat md:hidden"
          style={{
            backgroundImage: project.imageMobile
              ? `url('${project.imageMobile}')`
              : undefined,
            backgroundSize: "65% auto",
            backgroundColor: "#F2EAD0",
          }}
          role="img"
          aria-label={`${project.name} brand mark`}
        />
        <div
          className="hidden aspect-[16/9] w-full rounded-3xl bg-center bg-cover md:block"
          style={{
            backgroundImage: project.image
              ? `url('${project.image}')`
              : undefined,
            backgroundColor: "#F2EAD0",
          }}
          role="img"
          aria-label={`${project.name} preview`}
        />

        {/* Copy + CTA. */}
        <div className="text-center md:text-left">
          <p
            className="mx-auto max-w-md font-light md:mx-0"
            style={{
              fontSize: "var(--text-body)",
              lineHeight: 1.5,
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            {project.description}
          </p>
          {project.url && (
            <MagneticLink
              href={project.url}
              className="mt-8 inline-flex items-center justify-center rounded-full px-9 py-3 font-medium transition-opacity hover:opacity-90"
              style={{
                fontSize: "var(--text-body-sm)",
                backgroundColor: "rgba(65, 64, 66, 0.55)",
                color: "#fff",
              }}
            >
              Go to web
            </MagneticLink>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  open,
  onToggle,
}: {
  project: Project;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const num = String(index + 1).padStart(2, "0");
  const interactive = !project.comingSoon;

  return (
    <div className="border-t" style={{ borderColor: "rgba(255, 255, 255, 0.22)" }}>
      <button
        type="button"
        onClick={interactive ? onToggle : undefined}
        aria-expanded={interactive ? open : undefined}
        disabled={!interactive}
        className="grid w-full items-center gap-4 py-7 text-left transition-opacity md:py-9"
        style={{
          gridTemplateColumns: "2.5rem 1fr 1.5rem",
          cursor: interactive ? "pointer" : "default",
          opacity: interactive ? 1 : 0.4,
        }}
      >
        {/* Index number. */}
        <span
          style={{
            color: "rgba(255, 255, 255, 0.45)",
            fontVariantNumeric: "tabular-nums",
            fontSize: "clamp(13px, 3vw, 16px)",
          }}
        >
          {num}
        </span>

        {/* Name — centred, uppercase. */}
        <span
          className="text-center font-semibold uppercase tracking-tight"
          style={{
            fontSize: "clamp(17px, 4.6vw, 30px)",
            lineHeight: 1.1,
            color: "#ffffff",
          }}
        >
          {project.name}
        </span>

        {/* Toggle (only on real projects). */}
        <span className="justify-self-end">
          {interactive && <PlusToggle open={open} />}
        </span>
      </button>

      {/* Expandable details — animated via the grid-rows 0fr→1fr trick. */}
      {interactive && (
        <div
          style={{
            display: "grid",
            gridTemplateRows: open ? "1fr" : "0fr",
            transition: "grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <ProjectDetails project={project} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Products section — accordion list of the portfolio on the light-gray
 * panel, followed by the "New ideas coming soon" teaser. One layout for
 * both breakpoints (the previous mobile-stack + desktop horizontal-pin
 * showcase was replaced by this accordion at the user's request).
 */
export function Products() {
  // Single-open accordion, all rows CLOSED by default — the user opens
  // a project by tapping its row.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <section
        id="products"
        className="relative px-6 pb-24 pt-40 md:px-12 md:pt-28"
        style={{ backgroundColor: "#B0B0B0" }}
        aria-label="Products"
      >
        <div className="mx-auto max-w-5xl">
          {/* Section title — pinned at the navbar line, matching the
              other sections. On mobile it coincides with the floating
              MobileSectionTitle "Products" at the same y, reading as one. */}
          <h2
            className="sticky z-40 mb-10 text-right font-semibold tracking-tight text-white"
            style={{
              fontSize: "var(--text-section-title)",
              lineHeight: 1,
              top: "88px",
            }}
          >
            Products
          </h2>

          {PROJECTS.map((project, i) => (
            <ProjectRow
              key={i}
              project={project}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
          {/* Closing rule under the last row so the list reads as a
              bounded table, matching the reference. */}
          <div
            className="border-t"
            style={{ borderColor: "rgba(255, 255, 255, 0.22)" }}
          />
        </div>
      </section>

      <NewIdeasPanel />
    </>
  );
}

/**
 * "New ideas coming soon" — dark gradient panel that floats inside the
 * light-gray Products area, with a scroll-driven zoom animation on the
 * text. As the user scrolls through the section's height, the text
 * scales up and fades in/out at the edges.
 */
function NewIdeasPanel() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      inner.style.transform = "scale(1)";
      inner.style.opacity = "1";
      return;
    }

    let raf = 0;
    const scaleFrom = 0.85;

    const update = () => {
      raf = 0;
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / total));

      const scaleTo = window.innerWidth < 768 ? 1.15 : 1.5;
      const scale = scaleFrom + (scaleTo - scaleFrom) * progress;

      let opacity = 1;
      if (progress < 0.15) opacity = progress / 0.15;
      else if (progress > 0.78)
        opacity = Math.max(0, 1 - (progress - 0.78) / 0.22);

      inner.style.transform = `scale(${scale.toFixed(4)})`;
      inner.style.opacity = opacity.toFixed(3);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="new-ideas"
      ref={wrapperRef}
      className="relative h-[220vh] md:h-[360vh]"
      style={{ backgroundColor: "#B0B0B0" }}
    >
      <div
        className="sticky top-0 px-6 py-12 md:px-12 md:py-16"
        style={{ height: "100vh" }}
      >
        <div
          className="relative h-full overflow-hidden"
          style={{ borderRadius: 40 }}
        >
          <AuroraBackground rounded={40} />
          <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
            <h2
              ref={innerRef}
              className="text-center text-white"
              style={{
                fontSize: "var(--text-tagline-md)",
                fontWeight: 400,
                lineHeight: 1.2,
                transformOrigin: "center",
                willChange: "transform, opacity",
                opacity: 0,
              }}
            >
              New <span style={{ fontWeight: 700 }}>ideas</span> coming soon
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
