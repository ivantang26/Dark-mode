/**
 * Page-weight budget: Home must stay under 700KB on mobile, the grain texture under 10KB.
 * Measures what a first visit downloads (HTML, scripts, styles, fonts), gzipped.
 *
 *   npm run build && npm start      # in one terminal
 *   npm run check:budget            # in another (BASE_URL defaults to http://localhost:3000)
 */
import { gzipSync } from "node:zlib";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const BUDGET = 700 * 1024;
const GRAIN_BUDGET = 10 * 1024;
const UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36";

async function get(url) {
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const html = await get(`${BASE}/`);
const text = html.toString("utf8");
const urls = new Set();
for (const m of text.matchAll(/<script[^>]+src="([^"]+)"/g)) urls.add(m[1]);
for (const m of text.matchAll(/<link[^>]+href="([^"]+\.(?:css|woff2))[^"]*"/g)) urls.add(m[1]);

const rows = [["/ (html)", gzipSync(html).length]];
let grain = 0;
for (const u of urls) {
  const body = await get(new URL(u, BASE).href);
  // Fonts are already compressed; count them as-is.
  rows.push([u, u.endsWith(".woff2") ? body.length : gzipSync(body).length]);
  if (u.endsWith(".css")) {
    const m = body.toString("utf8").match(/\.grain\{[^}]*url\("?(data:[^")]+)/);
    if (m) grain = Math.max(grain, m[1].length);
  }
}

const total = rows.reduce((n, [, b]) => n + b, 0);
const kb = (b) => `${(b / 1024).toFixed(1)}KB`.padStart(9);
for (const [u, b] of rows.sort((a, b) => b[1] - a[1])) console.log(`${kb(b)}  ${u}`);
console.log(`\nHome total: ${kb(total)} of ${kb(BUDGET)} budget`);
console.log(`Grain texture: ${grain ? kb(grain) : "not found"} of ${kb(GRAIN_BUDGET)} budget`);

if (total > BUDGET || grain > GRAIN_BUDGET) {
  console.error("Over budget.");
  process.exit(1);
}
console.log("Within budget.");
