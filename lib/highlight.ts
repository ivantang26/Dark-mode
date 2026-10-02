/**
 * Server-only syntax highlighting. Pages are statically rendered, so this runs at
 * build time and ships plain HTML spans: no highlighter in the client bundle.
 */
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { neonTheme } from "./shiki-theme";

export type Lang = "python" | "javascript" | "typescript" | "go" | "bash" | "json";

const ALIASES: Record<string, Lang> = {
  py: "python",
  python: "python",
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  go: "go",
  sh: "bash",
  shell: "bash",
  bash: "bash",
  curl: "bash",
  json: "json",
};

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [neonTheme],
    langs: [
      import("shiki/langs/python.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/go.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/json.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const hl = await getHighlighter();
  const resolved = ALIASES[lang.toLowerCase()];
  return hl.codeToHtml(code.replace(/\n$/, ""), {
    lang: resolved ?? "text",
    theme: neonTheme.name,
  });
}
