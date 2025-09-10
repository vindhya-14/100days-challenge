// src/utils/parser.js
export function parseSchema(input) {
  if (!input || !input.toString().trim()) {
    throw new Error("Schema cannot be empty.");
  }

  // Accepts: RelationName(a, b, c)
  const regex = /^\s*([A-Za-z]\w*)\s*\(\s*([^)]+?)\s*\)\s*$/;
  const m = input.toString().trim().match(regex);

  if (!m) {
    throw new Error(
      "Invalid format. Use: R(a,b,c) — relationName(attributes...)"
    );
  }

  const name = m[1];
  const rawAttrs = m[2]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (rawAttrs.length === 0) {
    throw new Error("No attributes found inside parentheses.");
  }

  // normalize attribute names (preserve case but trim duplicates)
  const attrs = [...new Set(rawAttrs)];

  if (attrs.length !== rawAttrs.length) {
    throw new Error("Duplicate attributes detected. Make attributes unique.");
  }

  return { name, attributes: attrs };
}
