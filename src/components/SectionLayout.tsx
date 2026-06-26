import type { CSSProperties, ReactNode } from "react";

/**
 * Layout primitives that enforce the site's section convention.
 *
 *   <SectionOuter>      ← max-w 1200px, centered. Anchor corner elements
 *                         (sticky section header, bottom-left closing).
 *     <SectionCentral>  ← max-w 844px, centered inside the outer frame.
 *                         Each section's MAIN content lives here.
 *       …
 *     </SectionCentral>
 *   </SectionOuter>
 *
 * The widths are driven by `--section-outer-width` / `--section-central-width`
 * in globals.css so they can be changed in one place.
 *
 * Sections that need a different horizontal treatment (the Hero is the
 * only current exception — it's full-bleed) skip these helpers and
 * write their own container.
 */

type ContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function SectionOuter({ children, className = "", style }: ContainerProps) {
  return (
    <div
      className={`mx-auto px-12 ${className}`}
      style={{ maxWidth: "var(--section-outer-width)", ...style }}
    >
      {children}
    </div>
  );
}

export function SectionCentral({ children, className = "", style }: ContainerProps) {
  return (
    <div
      className={`mx-auto ${className}`}
      style={{ maxWidth: "var(--section-central-width)", ...style }}
    >
      {children}
    </div>
  );
}
