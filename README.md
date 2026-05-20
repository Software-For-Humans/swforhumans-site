# swforhumans.com

Marketing site for **Software For Humans**.

Single-file bilingual (EN/ES) static site. Hosted on the same DigitalOcean
droplet as `shopledger.app`, using identical nginx + Let's Encrypt + GitHub
Actions deploy patterns.

---

## Stack

- **Static HTML** — one file, `index.html`. No build step.
- **Nginx** — serves it (same droplet as shopledger.app).
- **Let's Encrypt** via certbot — TLS certs.
- **GitHub Actions** — auto-deploy on push to `main`.
- **Atomic deploys** — releases dir + symlink swap (matches shopledger pattern).

---

## Repo structure

```
swforhumans-site/
├── index.html                          ← the entire site
├── deploy/
│   ├── nginx.conf                      ← copy to /etc/nginx/sites-available/
│   └── setup-droplet.sh                ← one-time droplet setup
├── .github/
│   └── workflows/
│       └── deploy.yml                  ← auto-deploy on push to main
├── README.md
└── .gitignore
```

---

## First-time setup

### 1. Initialize and push the repo

In GitHub Desktop:
- File → Add Local Repository → select this folder
- "Create a Repository" → Publish to GitHub (private)

Or in PowerShell / Git Bash:
```bash
git init -b main
git add .
git commit -m "Initial commit — swforhumans.com bilingual site"
gh repo create swforhumans-site --private --source=. --remote=origin --push
```

### 2. Set GitHub Actions secrets

In the repo on GitHub → Settings → Secrets and variables → Actions:

- `DROPLET_IP` — your droplet's IP address (same one shopledger.app uses)
- `DEPLOY_SSH_KEY` — the private key for the `deploy` user (same one already
  set up for shopledger.app)

These are the same secrets you already have on the shopledger repo —
you can copy them across.

### 3. SSH to the droplet — one-time setup

```bash
ssh root@DROPLET_IP 'bash -s' < deploy/setup-droplet.sh
```

This creates `/var/www/swforhumans.com/{releases,current}` with the
right ownership, drops a temporary HTTP-only nginx config so Let's
Encrypt can validate the domain, and lists the remaining manual steps.

### 4. Point DNS at the droplet

At your registrar (or Cloudflare):

- `A` record `swforhumans.com` → droplet IP
- `A` record `www.swforhumans.com` → droplet IP

If using Cloudflare, set both to **DNS only** (grey cloud) for the initial
cert issuance. You can switch to proxied afterward.

### 5. Get the TLS cert

Once DNS resolves (check with `dig swforhumans.com +short`), SSH to the
droplet and run:

```bash
certbot --nginx -d swforhumans.com -d www.swforhumans.com
```

Then swap in the full nginx config:

```bash
# (from your local machine, after pushing this repo to the droplet
#  via the deploy workflow at least once)
scp deploy/nginx.conf deploy@DROPLET_IP:/tmp/swforhumans.conf
ssh deploy@DROPLET_IP "sudo mv /tmp/swforhumans.conf /etc/nginx/sites-available/swforhumans.com && sudo nginx -t && sudo systemctl reload nginx"
```

### 6. Push to main → live

After the first push to `main`, the GitHub Action will:

1. Tar the `index.html`
2. SSH to the droplet, extract to `/var/www/swforhumans.com/releases/<SHA>/`
3. Atomically swap the `current` symlink to point at the new release
4. Prune all but the last 5 releases

You'll see "Deployed `<SHA>` successfully" in the Actions log when it's done.

---

## Day-to-day editing

1. Edit `index.html`
2. Commit + push to `main`
3. Wait ~30 seconds — site updates automatically

---

## Notes matching the shopledger pattern

- **Same droplet, same deploy user, same SSH key.** swforhumans.com lives
  alongside shopledger.app at `/var/www/swforhumans.com/` with its own
  releases dir.
- **Same nginx pattern.** Releases + `current` symlink. SSL configured
  identically.
- **Same cache strategy.** Long cache for `/assets/*`, no-cache for HTML,
  short cache for favicon-style root files.
- **No build step needed.** Unlike shopledger (Vite), this site is one
  static file. The workflow just packages and ships.
