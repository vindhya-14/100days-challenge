export function tokenize(input) {
  const tokens = [];
  const regex = /\s*([A-Za-z_]\w*|\d+|==|=|[+\-*/()]|\S)\s*/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
    tokens.push(match[1]);
  }

  return tokens;
}
