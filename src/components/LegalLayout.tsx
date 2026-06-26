import Link from "next/link";
import { Container } from "./Container";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { legalLinks } from "@/lib/site";

export function LegalLayout({
  title,
  intro,
  effectiveDate,
  children,
}: {
  title: string;
  intro?: string;
  effectiveDate?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-12 pb-24">
        <Container className="max-w-3xl">
          <div className="mb-6 flex items-center gap-2 text-xs text-muted">
            <Link
              href="/"
              className="font-mono uppercase tracking-widest transition-colors hover:text-foreground"
            >
              ← Home
            </Link>
            <span aria-hidden>·</span>
            <span className="font-mono uppercase tracking-widest">Legal</span>
          </div>

          <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>

          {effectiveDate && (
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
              Effective {effectiveDate}
            </p>
          )}

          {intro && (
            <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>
          )}

          <div
            role="note"
            className="mt-8 rounded-xl border border-subtle bg-surface px-5 py-4 text-sm text-muted"
          >
            <strong className="font-medium text-foreground">
              Draft — pending legal review.
            </strong>{" "}
            This page is a structural placeholder. The final text must be
            reviewed and approved by a Virginia-licensed attorney before
            publication. Informational reference only — not legal advice.
          </div>

          <article className="prose-legal mt-12 space-y-8 text-foreground/85 leading-relaxed">
            {children}
          </article>

          <nav
            className="mt-16 border-t border-subtle pt-6"
            aria-label="Other legal documents"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
              Other documents
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-foreground/85">{children}</div>
    </section>
  );
}
