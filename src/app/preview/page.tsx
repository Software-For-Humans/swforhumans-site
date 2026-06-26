/**
 * Preview index — the hub for iterating on each section in isolation
 * against the new brand book.
 *
 * Each card opens a full-bleed preview of one section so we can polish
 * it without the rest of the page distracting. When all sections are
 * approved we wire them back into `/` and retire this folder.
 */
import Link from "next/link";

type PreviewLink = {
  slug: string;
  title: string;
  blurb: string;
  status: "current" | "brand-pass" | "todo";
};

const SECTIONS: PreviewLink[] = [
  {
    slug: "hero",
    title: "Hero",
    blurb:
      "Logo + lockup centered. Mission statement bottom-right. Brand gradient bg.",
    status: "brand-pass",
  },
  {
    slug: "what-we-do",
    title: "What we do",
    blurb:
      "Three studio principles, sticky scroll choreography. Closing studio note.",
    status: "current",
  },
  {
    slug: "what-we-dont",
    title: "What we don't",
    blurb:
      "Four negatives (no investors / no growth hacks / etc.). Italic+bold accents.",
    status: "current",
  },
  {
    slug: "products",
    title: "Products",
    blurb:
      "Shopledger card + ghosted upcoming products. Light gray bg per brand book.",
    status: "current",
  },
  {
    slug: "about",
    title: "About",
    blurb:
      "“Built in Virginia, Made for humans.” Light gray bg per brand book.",
    status: "current",
  },
  {
    slug: "contact",
    title: "Contact",
    blurb:
      "“Get in touch.” Email + general + mailing address. Light gray bg.",
    status: "current",
  },
  {
    slug: "footer",
    title: "Footer",
    blurb: "Giant wordmark + newsletter + columns over the brand gradient.",
    status: "current",
  },
];

const STATUS_LABEL: Record<PreviewLink["status"], string> = {
  current: "Current",
  "brand-pass": "Brand pass",
  todo: "Todo",
};

const STATUS_COLOR: Record<PreviewLink["status"], string> = {
  current: "bg-white/10 text-white/70",
  "brand-pass": "bg-[var(--accent)]/20 text-[var(--accent)]",
  todo: "bg-[var(--accent-magenta)]/20 text-[var(--accent-magenta)]",
};

export default function PreviewIndex() {
  return (
    <main className="min-h-screen px-6 py-24 md:px-12 md:py-32">
      <header className="mx-auto max-w-5xl">
        <p
          className="text-xs uppercase tracking-[0.2em] text-white/45"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Section workshop
        </p>
        <h1
          className="mt-2 font-semibold tracking-tight text-white"
          style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
        >
          Software For Humans —{" "}
          <em
            className="italic font-normal"
            style={{ color: "var(--accent)" }}
          >
            section by section.
          </em>
        </h1>
        <p
          className="mt-4 max-w-2xl text-white/65"
          style={{ fontSize: "15px", lineHeight: 1.6 }}
        >
          Each card opens that section in isolation so we can iterate against
          the brand book without breaking the rest of the page. Approved
          sections get wired back into the main page at the end.
        </p>
      </header>

      <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/preview/${s.slug}`}
              className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-white"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {s.title}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${STATUS_COLOR[s.status]}`}
                >
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
              <p
                className="mt-2 text-white/55"
                style={{ fontSize: "13px", lineHeight: 1.5 }}
              >
                {s.blurb}
              </p>
              <span
                className="mt-4 inline-flex items-center gap-1 text-xs text-white/45 transition group-hover:text-white"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Open preview →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mx-auto mt-16 max-w-5xl border-t border-white/10 pt-6">
        <Link
          href="/"
          className="text-xs text-white/45 transition hover:text-white"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          ← Back to the full assembled page
        </Link>
      </footer>
    </main>
  );
}
