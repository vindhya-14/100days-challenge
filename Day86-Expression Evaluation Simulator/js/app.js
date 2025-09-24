class ExpressionEvaluator {
  constructor() {
    // Initialize properties first
    this.history = JSON.parse(localStorage.getItem("expressionHistory")) || [];
    this.isPlaying = false;
    this.animationInterval = null;
    this.speed = 1;
    this.currentStep = 0;
    this.simulationSteps = [];
    this.evaluationSteps = null;
    this.postfix = null;
    this.finalResult = null;

    // Then initialize DOM elements and events
    this.initializeElements();
    this.bindEvents();
    this.loadHistory();
  }

  initializeElements() {
    // Input elements
    this.expressionInput = document.getElementById("expression");
    this.convertBtn = document.getElementById("convertBtn");
    this.stepBtn = document.getElementById("stepBtn");
    this.pauseBtn = document.getElementById("pauseBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.speedSlider = document.getElementById("speed");
    this.speedValue = document.getElementById("speedValue");

    // Display elements
    this.stepsLog = document.getElementById("stepsLog");
    this.operatorStack = document.getElementById("operatorStack");
    this.valueStack = document.getElementById("valueStack");
    this.postfixExpr = document.getElementById("postfixExpr");
    this.resultDisplay = document.getElementById("result");
    this.infixTokens = document.getElementById("infixTokens");
    this.postfixTokens = document.getElementById("postfixTokens");
    this.historyContainer = document.getElementById("history");

    // Example buttons
    this.exampleButtons = document.querySelectorAll(".example-btn");
  }

  bindEvents() {
    this.convertBtn.addEventListener("click", () => this.startConversion());
    this.stepBtn.addEventListener("click", () => this.stepForward());
    this.pauseBtn.addEventListener("click", () => this.pauseAnimation());
    this.resetBtn.addEventListener("click", () => this.reset());
    this.speedSlider.addEventListener("input", () => this.updateSpeed());

    this.expressionInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.startConversion();
    });

    this.exampleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.expressionInput.value = btn.dataset.expr;
        this.expressionInput.focus();
      });
    });

    // Initialize speed display
    this.updateSpeed();
  }

  updateSpeed() {
    this.speed = parseFloat(this.speedSlider.value);
    this.speedValue.textContent = this.speed + "x";

    if (this.isPlaying) {
      this.pauseAnimation();
      this.startAnimation();
    }
  }

  log(message, type = "info") {
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `
            <div class="log-time">${new Date().toLocaleTimeString()}</div>
            <div class="log-message">${message}</div>
        `;
    this.stepsLog.prepend(logEntry);

    // Auto-scroll to top
    this.stepsLog.scrollTop = 0;
  }

  tokenize(expression) {
    // Remove all spaces
    expression = expression.replace(/\s+/g, "");

    // Validate expression
    if (!expression) {
      throw new Error("Expression cannot be empty");
    }

    // Check for invalid characters
    if (!/^[0-9+\-*/().^]+$/.test(expression)) {
      throw new Error("Expression contains invalid characters");
    }

    const tokens = [];
    let currentNumber = "";
    let i = 0;

    while (i < expression.length) {
      const char = expression[i];

      // Handle numbers (including multi-digit and negative numbers)
      if (
        this.isDigit(char) ||
        (char === "-" && (i === 0 || expression[i - 1] === "("))
      ) {
        currentNumber += char;
        i++;
        // Continue reading digits
        while (i < expression.length && this.isDigit(expression[i])) {
          currentNumber += expression[i];
          i++;
        }
        tokens.push({ type: "number", value: currentNumber });
        currentNumber = "";
      }
      // Handle operators and parentheses
      else if (this.isOperator(char) || char === "(" || char === ")") {
        if (currentNumber) {
          tokens.push({ type: "number", value: currentNumber });
          currentNumber = "";
        }
        tokens.push({ type: this.getTokenType(char), value: char });
        i++;
      }
      // Skip any other characters (though validation should catch these)
      else {
        i++;
      }
    }

    // Push any remaining number
    if (currentNumber) {
      tokens.push({ type: "number", value: currentNumber });
    }

    return tokens;
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  isOperator(char) {
    return /[+\-*/^]/.test(char);
  }

  getTokenType(char) {
    if (this.isOperator(char)) return "operator";
    if (char === "(" || char === ")") return "parenthesis";
    return "unknown";
  }

  getPrecedence(operator) {
    const precedences = {
      "^": 4,
      "*": 3,
      "/": 3,
      "+": 2,
      "-": 2,
    };
    return precedences[operator] || 0;
  }

  isRightAssociative(operator) {
    return operator === "^";
  }

  infixToPostfix(tokens) {
    const output = [];
    const stack = [];
    const steps = [];

    steps.push({
      action: "init",
      tokens: JSON.parse(JSON.stringify(tokens)),
      output: [...output],
      stack: [...stack],
      description: "Starting infix to postfix conversion",
    });

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token.type === "number") {
        output.push(token.value);
        steps.push({
          action: "output_number",
          token: token.value,
          output: [...output],
          stack: [...stack],
          description: `Number ${token.value} added to output`,
        });
      } else if (token.value === "(") {
        stack.push(token.value);
        steps.push({
          action: "push_parenthesis",
          token: token.value,
          output: [...output],
          stack: [...stack],
          description: "Opening parenthesis pushed to stack",
        });
      } else if (token.value === ")") {
        // Pop until we find the matching '('
        while (stack.length > 0 && stack[stack.length - 1] !== "(") {
          const op = stack.pop();
          output.push(op);
          steps.push({
            action: "pop_operator",
            token: op,
            output: [...output],
            stack: [...stack],
            description: `Operator ${op} popped from stack to output`,
          });
        }

        if (stack.length === 0) {
          throw new Error("Mismatched parentheses");
        }

        // Remove the '('
        stack.pop();
        steps.push({
          action: "pop_parenthesis",
          token: "(",
          output: [...output],
          stack: [...stack],
          description: "Opening parenthesis removed from stack",
        });
      } else if (token.type === "operator") {
        while (
          stack.length > 0 &&
          stack[stack.length - 1] !== "(" &&
          (this.getPrecedence(stack[stack.length - 1]) >
            this.getPrecedence(token.value) ||
            (this.getPrecedence(stack[stack.length - 1]) ===
              this.getPrecedence(token.value) &&
              !this.isRightAssociative(token.value)))
        ) {
          const op = stack.pop();
          output.push(op);
          steps.push({
            action: "pop_operator_precedence",
            token: op,
            output: [...output],
            stack: [...stack],
            description: `Operator ${op} popped due to higher precedence`,
          });
        }
        stack.push(token.value);
        steps.push({
          action: "push_operator",
          token: token.value,
          output: [...output],
          stack: [...stack],
          description: `Operator ${token.value} pushed to stack`,
        });
      }
    }

    // Pop all remaining operators from the stack
    while (stack.length > 0) {
      const op = stack.pop();
      if (op === "(") {
        throw new Error("Mismatched parentheses");
      }
      output.push(op);
      steps.push({
        action: "pop_remaining",
        token: op,
        output: [...output],
        stack: [...stack],
        description: `Remaining operator ${op} popped to output`,
      });
    }

    steps.push({
      action: "complete",
      output: [...output],
      stack: [],
      description: "Infix to postfix conversion completed",
    });

    return { postfix: output, steps };
  }

  evaluatePostfix(postfix) {
    const stack = [];
    const steps = [];

    steps.push({
      action: "eval_start",
      stack: [...stack],
      postfix: [...postfix],
      description: "Starting postfix evaluation",
    });

    for (let i = 0; i < postfix.length; i++) {
      const token = postfix[i];

      if (!isNaN(token) && token !== "") {
        // It's a number
        stack.push(parseFloat(token));
        steps.push({
          action: "push_value",
          token: token,
          stack: [...stack],
          description: `Value ${token} pushed to evaluation stack`,
        });
      } else {
        // It's an operator - need at least 2 operands
        if (stack.length < 2) {
          throw new Error("Invalid postfix expression: not enough operands");
        }

        const b = stack.pop();
        const a = stack.pop();

        steps.push({
          action: "pop_operands",
          token: `${a} and ${b}`,
          stack: [...stack],
          description: `Popped operands ${a} and ${b} for operation`,
        });

        let result;
        switch (token) {
          case "+":
            result = a + b;
            break;
          case "-":
            result = a - b;
            break;
          case "*":
            result = a * b;
            break;
          case "/":
            if (b === 0) throw new Error("Division by zero");
            result = a / b;
            break;
          case "^":
            result = Math.pow(a, b);
            break;
          default:
            throw new Error(`Unknown operator: ${token}`);
        }

        stack.push(result);
        steps.push({
          action: "push_result",
          token: result,
          stack: [...stack],
          description: `Computed ${a} ${token} ${b} = ${result}`,
        });
      }
    }

    if (stack.length !== 1) {
      throw new Error("Invalid expression: too many operands");
    }

    const finalResult = stack[0];
    steps.push({
      action: "eval_complete",
      stack: [...stack],
      description: `Evaluation completed. Result: ${finalResult}`,
    });

    return { result: finalResult, steps };
  }

  renderTokens(container, tokens, activeIndex = -1) {
    container.innerHTML = "";
    tokens.forEach((token, index) => {
      const tokenEl = document.createElement("div");
      const tokenType = this.getTokenType(token);
      tokenEl.className = `token ${tokenType} ${
        index === activeIndex ? "active" : ""
      }`;
      tokenEl.textContent = token;
      container.appendChild(tokenEl);
    });
  }

  renderStack(container, items, type = "operator") {
    container.innerHTML = "";

    // Show items from bottom to top (reverse order for visual stack)
    items
      .slice()
      .reverse()
      .forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = `stack-item ${type}`;
        itemEl.textContent = item;
        container.appendChild(itemEl);
      });
  }

  startConversion() {
    const expression = this.expressionInput.value.trim();
    if (!expression) {
      this.log("Please enter an expression", "error");
      this.expressionInput.focus();
      return;
    }

    this.reset();
    this.addToHistory(expression);

    try {
      this.log(`Processing expression: ${expression}`, "info");

      const tokens = this.tokenize(expression);
      this.renderTokens(
        this.infixTokens,
        tokens.map((t) => t.value)
      );

      const conversion = this.infixToPostfix(tokens);
      this.postfix = conversion.postfix;
      this.simulationSteps = conversion.steps;

      this.postfixExpr.textContent = this.postfix.join(" ");
      this.renderTokens(this.postfixTokens, this.postfix);

      this.log(`Postfix expression: ${this.postfix.join(" ")}`, "success");
      this.log("Conversion ready. Starting animation...", "info");

      this.startAnimation();
    } catch (error) {
      this.log(`Error: ${error.message}`, "error");
      console.error("Conversion error:", error);
    }
  }

  startAnimation() {
    if (this.simulationSteps.length === 0) {
      this.log(
        "No steps to animate. Please convert an expression first.",
        "warning"
      );
      return;
    }

    this.isPlaying = true;
    this.convertBtn.style.display = "none";
    this.pauseBtn.style.display = "flex";
    this.stepBtn.disabled = true;

    this.animationInterval = setInterval(() => {
      this.stepForward();
    }, 1000 / this.speed);
  }

  pauseAnimation() {
    this.isPlaying = false;
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    this.convertBtn.style.display = "flex";
    this.pauseBtn.style.display = "none";
    this.stepBtn.disabled = false;
  }

  stepForward() {
    // If we've finished conversion, start evaluation
    if (
      this.currentStep >= this.simulationSteps.length &&
      !this.evaluationSteps
    ) {
      this.startEvaluation();
      return;
    }

    // If we've finished evaluation, stop
    if (
      this.evaluationSteps &&
      this.currentStep >=
        this.simulationSteps.length + this.evaluationSteps.length
    ) {
      this.pauseAnimation();
      this.log("Animation completed!", "success");
      return;
    }

    let step;
    if (this.currentStep < this.simulationSteps.length) {
      step = this.simulationSteps[this.currentStep];
    } else {
      step =
        this.evaluationSteps[this.currentStep - this.simulationSteps.length];
    }

    this.renderStep(step);
    this.currentStep++;

    // If this was the last conversion step, prepare for evaluation
    if (
      this.currentStep === this.simulationSteps.length &&
      !this.evaluationSteps
    ) {
      setTimeout(() => {
        this.startEvaluation();
      }, 500 / this.speed);
    }
  }

  startEvaluation() {
    if (!this.postfix) return;

    try {
      this.log("Starting evaluation of postfix expression...", "info");
      const evaluation = this.evaluatePostfix(this.postfix);
      this.evaluationSteps = evaluation.steps;
      this.finalResult = evaluation.result;

      // Render the first evaluation step
      if (this.evaluationSteps.length > 0) {
        this.renderStep(this.evaluationSteps[0]);
        this.currentStep = this.simulationSteps.length + 1;
      }
    } catch (error) {
      this.log(`Evaluation error: ${error.message}`, "error");
      this.pauseAnimation();
    }
  }

  renderStep(step) {
    this.log(step.description, this.getStepType(step.action));

    if (step.stack !== undefined) {
      this.renderStack(this.operatorStack, step.stack, "operator");
    }

    if (step.output !== undefined) {
      this.renderTokens(this.postfixTokens, step.output);
    }

    if (step.action === "eval_complete" && this.finalResult !== null) {
      this.resultDisplay.textContent = this.finalResult;
      this.resultDisplay.style.animation = "pulse 0.5s ease-in-out";
      setTimeout(() => {
        this.resultDisplay.style.animation = "";
      }, 500);
    }
  }

  getStepType(action) {
    const typeMap = {
      init: "info",
      complete: "success",
      eval_start: "info",
      eval_complete: "success",
      error: "error",
    };
    return typeMap[action] || "info";
  }

  reset() {
    this.pauseAnimation();
    this.currentStep = 0;
    this.simulationSteps = [];
    this.evaluationSteps = null;
    this.postfix = null;
    this.finalResult = null;

    // Clear displays
    this.stepsLog.innerHTML = "";
    this.operatorStack.innerHTML = "";
    this.valueStack.innerHTML = "";
    this.postfixExpr.textContent = "—";
    this.resultDisplay.textContent = "—";
    this.infixTokens.innerHTML = "";
    this.postfixTokens.innerHTML = "";

    // Reset button states
    this.convertBtn.style.display = "flex";
    this.pauseBtn.style.display = "none";
    this.stepBtn.disabled = false;

    this.log("System reset. Ready for new expression.", "info");
  }

  addToHistory(expression) {
    if (!this.history.includes(expression)) {
      this.history.unshift(expression);
      this.history = this.history.slice(0, 10); // Keep last 10
      localStorage.setItem("expressionHistory", JSON.stringify(this.history));
      this.loadHistory();
    }
  }

  loadHistory() {
    if (!this.historyContainer) return;

    this.historyContainer.innerHTML = "";

    if (this.history.length === 0) {
      this.historyContainer.innerHTML =
        '<div class="history-empty">No history yet</div>';
      return;
    }

    this.history.forEach((expr) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.textContent = expr;
      item.addEventListener("click", () => {
        this.expressionInput.value = expr;
        this.startConversion();
      });
      this.historyContainer.appendChild(item);
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ExpressionEvaluator();
});

// Add CSS animation for result pulse
const style = document.createElement("style");
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
