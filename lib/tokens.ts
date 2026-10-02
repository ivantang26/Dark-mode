/**
 * Reads the colour tokens from app/globals.css (the single source of truth) and lists
 * every text/background pairing the site uses. Shared by scripts/check-contrast.ts and
 * the /design-system page, so the page shows exactly what the build checks.
 * Server-only (uses fs).
 */
import fs from "node:fs";
import path from "node:path";
import { syntax } from "./shiki-theme";

export function readTokens(): Record<string, string> {
  const css = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");
  const root = css.match(/:root,\s*\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const out: Record<string, string> = {};
  for (const m of root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[m[1]] = m[2].toLowerCase();
  return out;
}

export type Pair = { fg: string; bg: string; fgName: string; bgName: string; use: string; min: number };

/** 4.5:1 for text. 3:1 for non-text accents (borders, dots, icons) and large display text. */
export function pairings(): Pair[] {
  const t = readTokens();
  const pairs: Pair[] = [];
  const add = (fgName: string, bgName: string, use: string, min = 4.5, fg = t[fgName], bg = t[bgName]) => pairs.push({ fg, bg, fgName, bgName, use, min });

  for (const bg of ["bg", "surface-1", "surface-2"]) {
    add("text", bg, "Primary text");
    add("text-mute", bg, "Secondary text, labels");
    add("neon-cyan", bg, "Links");
    add("neon-lime", bg, "Success, 200 OK, keys");
    add("neon-violet-soft", bg, "Accent labels, step numbers");
    add("danger", bg, "Errors");
  }
  pairs.push({ fg: "#cfcfdb", bg: t.bg, fgName: "prose", bgName: "bg", use: "Docs body copy", min: 4.5 });
  add("on-light", "text", "Primary button label");
  add("neon-violet", "bg", "Accent borders, dots, glows (non-text)", 3);
  add("neon-violet", "surface-1", "Accent borders on cards (non-text)", 3);

  for (const [name, colour] of Object.entries(syntax)) {
    if (name === "background") continue;
    pairs.push({ fg: colour, bg: syntax.background, fgName: `syntax.${name}`, bgName: "surface-1", use: "Code token", min: 4.5 });
  }
  return pairs;
}
