import type { MetadataRoute } from "next";

// Static export emits this as `out/sitemap.xml`.
export const dynamic = "force-static";

const BASE = "https://swforhumans.com";

// Public, indexable routes only â€” the internal `/preview/*` design pages
// are intentionally excluded.
const ROUTES = [
  "",
  "/legal/terms",
  "/legal/privacy",
  "/legal/acceptable-use",
  "/legal/dmca",
  "/legal/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : 0.4,
  }));
}
