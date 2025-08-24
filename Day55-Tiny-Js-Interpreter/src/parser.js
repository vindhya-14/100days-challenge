export function parse(tokens) {
  let pos = 0;

  function peek() {
    return tokens[pos];
  }

  function consume(expected) {
    const token = tokens[pos];
    if (expected && token !== expected) {
      throw new Error(`Expected '${expected}', got '${token}'`);
    }
    pos++;
    return token;
  }

  function parsePrimary() {
    const token = peek();

    if (!token) throw new Error("Unexpected end of input");

    if (/^\d+$/.test(token)) {
      // number
      consume();
      return { type: "NumberLiteral", value: Number(token) };
    }

    if (/^[A-Za-z_]\w*$/.test(token)) {
      // variable
      consume();
      return { type: "Identifier", name: token };
    }

    if (token === "(") {
      // parenthesized expr
      consume("(");
      const expr = parseExpression();
      consume(")");
      return expr;
    }

    throw new Error(`Unexpected token: ${token}`);
  }

  function parseMultiplicative() {
    let node = parsePrimary();
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const right = parsePrimary();
      node = { type: "BinaryExpression", operator: op, left: node, right };
    }
    return node;
  }

  function parseAdditive() {
    let node = parseMultiplicative();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseMultiplicative();
      node = { type: "BinaryExpression", operator: op, left: node, right };
    }
    return node;
  }

  function parseAssignment() {
    const expr = parseAdditive();
    if (expr.type === "Identifier" && peek() === "=") {
      consume("=");
      const value = parseAssignment();
      return { type: "AssignmentExpression", name: expr.name, value };
    }
    return expr;
  }

  function parseExpression() {
    return parseAssignment();
  }

  const ast = parseExpression();
  if (pos < tokens.length) {
    throw new Error(`Unexpected token: ${peek()}`);
  }
  return ast;
}
