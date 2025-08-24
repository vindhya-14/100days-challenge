import readline from "readline";
import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";
import { Interpreter } from "./interpreter.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "tiny-js> ",
});

console.log(
  "Tiny JS Interpreter (numbers, +, -, *, /, variables, parentheses)"
);

const interpreter = new Interpreter();

rl.prompt();

rl.on("line", (line) => {
  try {
    const tokens = tokenize(line);
    const ast = parse(tokens);
    const result = interpreter.eval(ast);
    console.log(result);
  } catch (err) {
    console.error("Error:", err.message);
  }
  rl.prompt();
});
