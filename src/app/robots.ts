import type { MetadataRoute } from "next";

// Static export emits this as `out/robots.txt`.
export const dynamic = "force-static";

const BASE = "https://swforhumans.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal design-preview routes â€” not for crawlers.
      disallow: "/preview/",
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
