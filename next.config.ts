import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static HTML export — the whole site is static (every route
   * prerenders, no API routes, no server rendering), so `next build`
   * emits a plain `out/` folder of HTML/CSS/JS that any static host
   * (Netlify, drag-and-drop, etc.) can serve directly. No Node server
   * needed.
   */
  output: "export",
  /**
   * Allowed dev-server origins for HMR / dev resources.
   *
   * Next.js 16 added a cross-origin protection that blocks dev
   * resource requests (HMR, _next/static, etc.) from any host other
   * than `localhost`. When the Wi-Fi router gives the PC a new IP and
   * a phone on the same network tries to load the dev server, the
   * phone hits the network IP — which is now blocked by default, and
   * the page fails to load.
   *
   * We allow:
   *   - Common private LAN subnets (10.x, 172.16-31.x, 192.168.x) so
   *     whatever IP the router hands out is covered without having to
   *     touch this file every time the IP changes.
   *   - `.local` mDNS hostnames in case anyone uses `<hostname>.local`
   *     instead of an IP.
   *
   * The protection only matters in dev. Production builds aren't
   * affected.
   */
  allowedDevOrigins: [
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.20.*.*",
    "172.21.*.*",
    "172.22.*.*",
    "172.23.*.*",
    "172.24.*.*",
    "172.25.*.*",
    "172.26.*.*",
    "172.27.*.*",
    "172.28.*.*",
    "172.29.*.*",
    "172.30.*.*",
    "172.31.*.*",
    "192.168.*.*",
    "*.local",
  ],
};

export default nextConfig;
