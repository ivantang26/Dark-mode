import { highlight } from "@/lib/highlight";
import { SDK_LANGS, type Snippet } from "@/lib/snippets";
import CodeTabsClient from "./CodeTabsClient";

/**
 * The same call in each SDK language (FR-1). Highlighting happens here on the
 * server; the client part only switches between pre-rendered panels.
 */
export default async function CodeTabs({ snippet, title, where = "code-tabs" }: { snippet: Snippet; title?: string; where?: string }) {
  const panels = await Promise.all(
    SDK_LANGS.map(async (l) => ({ id: l.id, label: l.label, code: snippet[l.id].replace(/\n$/, ""), html: await highlight(snippet[l.id], l.shiki) })),
  );
  return <CodeTabsClient panels={panels} title={title} where={where} />;
}
