/**
 * "Synapse Neon": the build-time Shiki theme. Every colour here is checked against
 * --surface-1 at 4.5:1 by scripts/check-contrast.ts (acceptance criterion 1).
 */
export const syntax = {
  background: "#0e0e15",
  foreground: "#ededf2",
  comment: "#9a9aaf",
  keyword: "#b79cff",
  string: "#a3e635",
  func: "#22d3ee",
  constant: "#f0abfc",
  property: "#a5f3fc",
  type: "#c4b5fd",
  punctuation: "#b4b4c7",
} as const;

export const neonTheme = {
  name: "synapse-neon",
  type: "dark" as const,
  colors: {
    "editor.background": syntax.background,
    "editor.foreground": syntax.foreground,
  },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: syntax.comment, fontStyle: "italic" } },
    {
      scope: ["keyword", "storage", "storage.type", "storage.modifier", "keyword.operator.new", "keyword.control", "variable.language.this"],
      settings: { foreground: syntax.keyword },
    },
    { scope: ["keyword.operator", "punctuation", "meta.brace", "punctuation.separator"], settings: { foreground: syntax.punctuation } },
    { scope: ["string", "string.quoted", "string.template", "punctuation.definition.string"], settings: { foreground: syntax.string } },
    { scope: ["constant.character.escape", "constant.other.placeholder"], settings: { foreground: syntax.property } },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call.generic", "variable.function", "meta.function-call entity.name.function"],
      settings: { foreground: syntax.func },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.language.boolean", "support.constant", "variable.other.constant"],
      settings: { foreground: syntax.constant },
    },
    {
      scope: [
        "support.type.property-name",
        "meta.object-literal.key",
        "variable.other.property",
        "variable.other.object.property",
        "variable.parameter.function.keyword",
        "entity.other.attribute-name",
        "variable.parameter.option",
        "constant.other.option",
      ],
      settings: { foreground: syntax.property },
    },
    { scope: ["entity.name.type", "support.type", "support.class", "entity.name.class", "entity.name.package", "entity.name.import"], settings: { foreground: syntax.type } },
    { scope: ["variable", "variable.other.readwrite", "meta.definition.variable"], settings: { foreground: syntax.foreground } },
    { scope: ["variable.other.normal.shell", "punctuation.definition.variable.shell"], settings: { foreground: syntax.constant } },
  ],
};
