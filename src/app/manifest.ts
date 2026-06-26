import type { MetadataRoute } from "next";

// Static export emits this as `out/manifest.webmanifest`.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Software For Humans",
    short_name: "SFH",
    description:
      "We build small, focused software that respects the people using it.",
    start_url: "/",
    display: "standalone",
    background_color: "#152838",
    theme_color: "#152838",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
