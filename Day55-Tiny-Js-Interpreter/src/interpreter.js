export class Interpreter {
  constructor() {
    this.env = {}; 
  }

  eval(node) {
    switch (node.type) {
      case "NumberLiteral":
        return node.value;

      case "Identifier":
        if (!(node.name in this.env)) {
          throw new Error(`Undefined variable: ${node.name}`);
        }
        return this.env[node.name];

      case "BinaryExpression": {
        const left = this.eval(node.left);
        const right = this.eval(node.right);
        switch (node.operator) {
          case "+":
            return left + right;
          case "-":
            return left - right;
          case "*":
            return left * right;
          case "/":
            return left / right;
        }
        throw new Error(`Unknown operator: ${node.operator}`);
      }

      case "AssignmentExpression": {
        const value = this.eval(node.value);
        this.env[node.name] = value;
        return value;
      }

      default:
        throw new Error(`Unknown AST node type: ${node.type}`);
    }
  }
}
