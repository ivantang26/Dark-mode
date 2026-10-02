export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[`'’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Flattens React children (as MDX passes them) to plain text. */
export function textOf(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in (node as object)) return textOf((node as { props: { children?: unknown } }).props.children);
  return "";
}
