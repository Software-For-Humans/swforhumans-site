import Link from "next/link";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 font-medium tracking-tight ${className ?? ""}`}
      aria-label="Software For Humans home"
    >
      <span
        className="inline-block h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-300 group-hover:scale-125"
        aria-hidden="true"
      />
      <span className="text-foreground">
        Software <span className="text-muted">for</span> Humans
      </span>
    </Link>
  );
}
