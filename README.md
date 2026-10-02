# Synapse

A fictional AI inference API, built as a portfolio piece for the **dark mode / neon** style: near-black canvas, glowing violet-to-cyan gradients, film grain, grid lines and monospace details. The style stays out of the way of the content. A working code sample and live latency numbers sit above the fold, and every code and text colour passes 4.5:1.

```bash
npm install
npm run dev          # http://localhost:3000
```

## What's here

| Page | What it does |
| --- | --- |
| `/` | Hero with a typing terminal (FR-2), live metrics strip (FR-3), code tabs in four languages (FR-1), feature grid with spotlight hover (FR-6), model teaser, calculator teaser, placeholder logos, final CTA |
| `/models` | Catalogue with modality, context and price filters, and sorting by price, speed or context (FR-5) |
| `/pricing` | Per-model price table (cards on phones, fewer columns on tablets), free tier, rate limits by tier, and the full cost calculator with a shareable URL (FR-4) |
| `/docs` | MDX quickstart in three steps with copyable code, plus Streaming, Function calling, and Errors and rate limits |
| `/signup`, `/login` | Sign-up with the model carried in from `?model=` (FR-7). Demo: issues a fake `syn_demo_…` key and shows time from landing to key |
| `/enterprise` | SOC 2, data retention, regions, SSO, and a contact form (demo) |
| `/changelog`, `/design-system` | Release notes; tokens, live contrast table, type, components and motion rules |
| `/api/status` | The public status JSON the metrics strip polls. `?fail=1` returns a 503 |

Press **⌘K / Ctrl K** anywhere for docs search (FR-8, brought forward from v1.1). It indexes doc titles and `##` headings straight from the MDX files.

## How it's built

- **Next.js 16 (App Router) + MDX + Tailwind CSS 4.** Semantic tokens (`--bg`, `--surface-1`, `--neon-cyan`…) live on `:root` in `app/globals.css` and Tailwind reads them via `@theme inline`. A light theme only has to redefine those variables under `[data-theme="light"]`. Component CSS sits in `@layer components`, so utility classes always win.
- **Shiki at build time** with a custom `synapse-neon` theme (`lib/shiki-theme.ts`) and the JavaScript regex engine. Pages ship plain highlighted HTML; no highlighter reaches the browser. `CodeTabs` highlights every language on the server and the client part just switches panels.
- **One pricing file.** `data/pricing.json` feeds the table, the catalogue and the calculator through `lib/pricing.ts`, so they can't disagree.
- **Session state** (`lib/session-store.ts`): the code-tab language and the chosen model are kept in `sessionStorage` with `useSyncExternalStore`, so every tab group on every page stays in step, and "Get API key" carries the last-chosen model.
- **Effects with one listener each** (`components/Effects.tsx`): the spotlight border position for every `.spotlight` card, and the 300ms clip-path heading reveal. Cards and headings stay server components.
- **Texture**: grain is a 0.3KB inline SVG turbulence tile at 4%. The aurora animates `transform` only. Grid lines are hidden on phones, 48px on tablets and 64px on desktop.
- **Analytics hooks** (`lib/analytics.ts`) for the success metrics: copy events, calculator use and shares, quickstart steps reached, sign-up completion with time to key. They log to `window.__synapseEvents`; swap in a real client.

## Checks

```bash
npm run check:contrast   # every text and syntax colour vs its surface (runs before build)
npm run check:budget     # Home page weight on mobile, with `npm start` running
npm run typecheck
```

Measured on the production build: Home is about **250KB** gzipped (budget 700KB), and every text and syntax pairing passes. The lowest text pair is 6.5:1; neon violet, at 4.5:1, is only used for borders and glows. At 360px no page scrolls sideways; code blocks scroll inside themselves.

## Not real

The company, models, numbers, domains (`*.synapse.example`) and SDK package names are made up. Sign-up, log-in and the enterprise form don't send anything. `/api/status` generates plausible numbers that drift each minute.

## Open questions from the brief

- **Live latency on the public site?** Built both ways. Set `NEXT_PUBLIC_METRICS_MODE=sla` to show the published SLA figures instead of live numbers.
- **Light theme for enterprise buyers?** Not in v1, but the tokens are ready for one, and there's already a print stylesheet that renders pages light, without texture, for printing or PDFs.
