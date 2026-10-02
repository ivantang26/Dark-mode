/**
 * Docs search index (FR-8): titles and headings read straight from the MDX files,
 * so the command palette never drifts from the pages. Server-only (uses fs).
 */
import fs from "node:fs";
import path from "node:path";
import { slugify } from "./slug";

export const DOCS = [
  { href: "/docs", dir: "", short: "Quickstart" },
  { href: "/docs/streaming", dir: "streaming", short: "Streaming" },
  { href: "/docs/function-calling", dir: "function-calling", short: "Function calling" },
  { href: "/docs/errors-and-limits", dir: "errors-and-limits", short: "Errors and rate limits" },
] as const;

export type SearchEntry = { title: string; href: string; group: string; kind: "page" | "doc" | "heading" };

export type DocOutline = { href: string; short: string; title: string; headings: { text: string; id: string }[] };

let cache: DocOutline[] | undefined;

export function getDocsOutline(): DocOutline[] {
  if (cache) return cache;
  cache = DOCS.map((d) => {
    const src = fs.readFileSync(path.join(process.cwd(), "app", "docs", d.dir, "page.mdx"), "utf8");
    const title = src.match(/^# (.+)$/m)?.[1]?.trim() ?? d.short;
    const headings = [...src.matchAll(/^## (.+)$/gm)].map((m) => {
      const text = m[1].trim().replace(/`/g, "");
      return { text, id: slugify(text) };
    });
    return { href: d.href, short: d.short, title, headings };
  });
  return cache;
}

const PAGES: SearchEntry[] = [
  { title: "Home", href: "/", group: "Pages", kind: "page" },
  { title: "Models", href: "/models", group: "Pages", kind: "page" },
  { title: "Pricing and cost calculator", href: "/pricing", group: "Pages", kind: "page" },
  { title: "Rate limits by tier", href: "/pricing#rate-limits", group: "Pages", kind: "page" },
  { title: "Enterprise, SOC 2 and data retention", href: "/enterprise", group: "Pages", kind: "page" },
  { title: "Changelog", href: "/changelog", group: "Pages", kind: "page" },
  { title: "Design system", href: "/design-system", group: "Pages", kind: "page" },
  { title: "Get an API key", href: "/signup", group: "Pages", kind: "page" },
];

export function getSearchIndex(): SearchEntry[] {
  const docs = getDocsOutline().flatMap((d) => [
    { title: d.title, href: d.href, group: "Docs", kind: "doc" as const },
    ...d.headings.map((h) => ({ title: h.text, href: `${d.href}#${h.id}`, group: d.short, kind: "heading" as const })),
  ]);
  return [...docs, ...PAGES];
}
