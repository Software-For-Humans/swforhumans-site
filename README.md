# Software For Humans — Website

Marketing site for **Software For Humans, LLC** (Virginia). Built with
Next.js 16 (App Router) + Tailwind CSS, exported as a fully **static**
site (no server required) — deployable to Netlify, Vercel, or any static
host.

---

## Requirements

- **Node.js 18.18+** (or 20+)
- npm

## Run locally

```bash
npm install        # install dependencies (first time only)
npm run dev        # start the dev server → http://localhost:3000
```

## Build for production

```bash
npm run build      # outputs the static site to the `out/` folder
```

The `out/` folder is the complete, self-contained website (HTML/CSS/JS).
Upload it to any static host.

## Deploy

### Netlify (recommended)
- **Drag & drop:** run `npm run build`, then drag the `out/` folder onto
  https://app.netlify.com/drop
- **Git / CI:** connect the repo in Netlify. The included `netlify.toml`
  already sets the build command (`npm run build`) and publish dir (`out`).

---

## Contact form

The "Get in touch" form submits via **Web3Forms** when configured,
otherwise it falls back to opening the visitor's email client.

To enable real submissions:
1. Create a free access key at https://web3forms.com
2. Set the environment variable (e.g. in Netlify → Site config → Env vars):
   ```
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-key-here
   ```
3. Re-deploy. Messages will be delivered to the email tied to that key.

---

## Where to edit common content

| What | File |
|------|------|
| Company name, emails, **mailing address**, domains, product list | `src/lib/site.ts` |
| Hero copy | `src/components/sections/Hero.tsx` |
| "What we do" / "What we don't" | `src/components/sections/WhatWeDo.tsx`, `WhatWeDont.tsx` |
| Products (accordion) | `src/components/sections/Products.tsx` |
| About / Contact | `src/components/sections/About.tsx`, `Contact.tsx` |
| Footer | `src/components/Footer.tsx` |
| Legal pages | `src/app/legal/*/page.tsx` |
| Brand colors / fonts / type scale | `src/app/globals.css` |
| Open Graph share image | `public/og-image.png` |
| Favicon / app icons | `src/app/icon.png`, `src/app/apple-icon.png`, `public/favicon.ico` |

---

## Before going live (checklist)

- [ ] Replace the **mailing address** placeholder ("Registered Agent — to
      be confirmed") in `src/lib/site.ts`.
- [ ] Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` for the contact form.
- [ ] Have the **legal pages** (Terms, Privacy, DMCA, Acceptable Use,
      Cookies) reviewed by a Virginia attorney and update the dates — they
      currently carry a "draft" notice.

---

## Project structure

```
src/
  app/            routes (App Router) + global styles, SEO (robots, sitemap, manifest)
  components/     UI components
    sections/     the homepage sections
  lib/            site data + small utilities
public/           static assets (images, favicon)
```
