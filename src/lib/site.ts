export const site = {
  name: "Software For Humans",
  legalName: "Software For Humans, LLC",
  tagline: "We build small, focused software that respects the people using it.",
  mission:
    "We build small, focused software that respects the people using it.",
  domains: {
    primary: "swforhumans.com",
    short: "swforhumans.com",
  },
  email: {
    admin: "admin@swforhumans.com",
    hello: "hello@swforhumans.com",
  },
  address: {
    line1: "Registered Agent â€” to be confirmed",
    line2: "Virginia, USA",
  },
  foundedIn: "Virginia",
  year: new Date().getFullYear(),
} as const;

export type Product = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  status: "live" | "beta" | "soon";
};

export const products: Product[] = [
  {
    name: "Shopledger",
    tagline: "Honest bookkeeping for small shops.",
    description:
      "Plain-language accounting built for the people actually running the business â€” not the people auditing it.",
    url: "https://shopledger.app",
    status: "live",
  },
];

export const navLinks = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const legalLinks = [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Acceptable Use", href: "/legal/acceptable-use" },
  { label: "DMCA Policy", href: "/legal/dmca" },
  { label: "Cookie Notice", href: "/legal/cookies" },
] as const;
