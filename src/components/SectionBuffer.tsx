/**
 * Opaque vertical spacer that sits between two sticky-heavy sections.
 *
 * Its job is to give the previous section's sticky elements room to scroll
 * cleanly out of the viewport BEFORE the next section's sticky elements
 * scroll in — otherwise the two sets briefly overlap during the transition.
 *
 * Default 80vh ≈ a full viewport of breathing room.
 */
export function SectionBuffer({
  height = "100vh",
}: {
  height?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative z-20 bg-black"
      style={{ height }}
    />
  );
}
