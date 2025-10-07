class AlgorithmVisualizer {
  constructor() {
    this.processBtn = document.getElementById("processBtn");
    this.inputString = document.getElementById("inputString");
    this.pattern = document.getElementById("pattern");

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.processBtn.addEventListener("click", () => this.processAll());

    // Process on Enter key
    this.inputString.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.processAll();
    });

    this.pattern.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.processAll();
    });
  }

  async processAll() {
    const input = this.inputString.value;
    const pattern = this.pattern.value;

    if (!input) {
      alert("Please enter an input string");
      return;
    }

    // Clear previous results
    this.clearVisualizations();

    // Process all algorithms
    await this.processRLE(input);
    await this.processKMP(input, pattern);
    await this.processLZW(input);

    this.updateComparisonChart();
  }

  clearVisualizations() {
    // Clear RLE
    document.getElementById("rle-input").innerHTML = "";
    document.getElementById("rle-process").innerHTML = "";
    document.getElementById("rle-output").innerHTML = "";
    document.getElementById("rle-ratio").textContent = "-";
    document.getElementById("rle-time").textContent = "-";

    // Clear KMP
    document.getElementById("kmp-input").innerHTML = "";
    document.getElementById("kmp-process").innerHTML = "";
    document.getElementById("kmp-output").innerHTML = "";
    document.getElementById("kmp-positions").textContent = "-";
    document.getElementById("kmp-time").textContent = "-";

    // Clear LZW
    document.getElementById("lzw-input").innerHTML = "";
    document.getElementById("lzw-process").innerHTML = "";
    document.getElementById("lzw-output").innerHTML = "";
    document.getElementById("lzw-ratio").textContent = "-";
    document.getElementById("lzw-time").textContent = "-";
  }

  async processRLE(input) {
    const startTime = performance.now();

    // Display input
    this.displayInput("rle-input", input, "char-input");

    let output = "";
    let processSteps = "";
    let i = 0;

    while (i < input.length) {
      let count = 1;
      let currentChar = input[i];

      // Highlight current character being processed
      await this.highlightCharacter(
        "rle-process",
        currentChar,
        "char-processing"
      );

      while (i + 1 < input.length && input[i] === input[i + 1]) {
        count++;
        i++;
        processSteps += this.createCharBox(input[i], "char-processing");
      }

      output += currentChar + count;
      this.displayOutput("rle-output", output, "char-output");

      i++;
      await this.delay(500);
    }

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);

    // Calculate compression ratio
    const originalSize = input.length;
    const compressedSize = output.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    document.getElementById("rle-ratio").textContent = `${ratio}%`;
    document.getElementById("rle-time").textContent = timeTaken;

    return { time: parseFloat(timeTaken), ratio: parseFloat(ratio) };
  }

  async processKMP(text, pattern) {
    const startTime = performance.now();

    if (!pattern) {
      document.getElementById("kmp-output").textContent = "No pattern provided";
      return { time: 0, matches: 0 };
    }

    // Display input and pattern
    this.displayInput("kmp-input", text, "char-input");
    document.getElementById(
      "kmp-process"
    ).innerHTML = `Pattern: ${this.createPatternBox(pattern)}`;

    // Build LPS array
    const lps = this.buildLPS(pattern);
    const positions = [];
    let i = 0,
      j = 0;

    while (i < text.length) {
      // Visualize current comparison
      await this.visualizeKMPComparison(text, pattern, i, j);

      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        positions.push(i - j);
        j = lps[j - 1];
        // Highlight found pattern
        await this.highlightPattern(text, i - pattern.length, pattern.length);
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }

      await this.delay(600);
    }

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);

    document.getElementById("kmp-positions").textContent =
      positions.length > 0 ? positions.join(", ") : "Not found";
    document.getElementById("kmp-time").textContent = timeTaken;

    return { time: parseFloat(timeTaken), matches: positions.length };
  }

  buildLPS(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }

  async visualizeKMPComparison(text, pattern, textIndex, patternIndex) {
    const processDiv = document.getElementById("kmp-process");
    let visualization = "";

    // Show text with current position
    for (let i = 0; i < text.length; i++) {
      let className = "char-input";
      if (i === textIndex) className = "char-processing";
      visualization += this.createCharBox(text[i], className);
    }

    visualization += "<br>Pattern: ";
    for (let i = 0; i < pattern.length; i++) {
      let className = "char-input";
      if (i === patternIndex) className = "char-processing";
      visualization += this.createCharBox(pattern[i], className);
    }

    processDiv.innerHTML = visualization;
  }

  async highlightPattern(text, start, length) {
    const outputDiv = document.getElementById("kmp-output");
    let output = "Matches at: ";

    for (let i = 0; i < text.length; i++) {
      if (i >= start && i < start + length) {
        output += this.createCharBox(text[i], "char-match");
      } else {
        output += this.createCharBox(text[i], "char-input");
      }
    }

    outputDiv.innerHTML = output;
  }

  async processLZW(input) {
    const startTime = performance.now();

    // Display input
    this.displayInput("lzw-input", input, "char-input");

    const dictionary = {};
    let dictSize = 256;

    // Initialize dictionary with ASCII characters
    for (let i = 0; i < 256; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }

    let current = "";
    const output = [];
    let processSteps = "";

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const combined = current + char;

      // Visualize current processing
      await this.highlightCharacter("lzw-process", combined, "char-processing");

      if (dictionary.hasOwnProperty(combined)) {
        current = combined;
      } else {
        output.push(dictionary[current]);
        dictionary[combined] = dictSize++;
        processSteps += `"${combined}" → ${dictionary[combined]}<br>`;
        document.getElementById("lzw-process").innerHTML = processSteps;
        current = char;
      }

      this.displayOutput("lzw-output", output.join(" "), "char-output");
      await this.delay(400);
    }

    if (current !== "") {
      output.push(dictionary[current]);
      this.displayOutput("lzw-output", output.join(" "), "char-output");
    }

    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);

    // Calculate compression ratio
    const originalSize = input.length * 8; // Assuming 8 bits per character
    const compressedSize = output.length * 12; // Assuming 12 bits per code
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

    document.getElementById("lzw-ratio").textContent = `${ratio}%`;
    document.getElementById("lzw-time").textContent = timeTaken;

    return { time: parseFloat(timeTaken), ratio: parseFloat(ratio) };
  }

  displayInput(elementId, text, className) {
    const element = document.getElementById(elementId);
    element.innerHTML = text
      .split("")
      .map((char) => this.createCharBox(char, className))
      .join("");
  }

  displayOutput(elementId, text, className) {
    const element = document.getElementById(elementId);
    element.innerHTML = text
      .split("")
      .map((char) => this.createCharBox(char, className))
      .join("");
  }

  async highlightCharacter(elementId, text, className) {
    const element = document.getElementById(elementId);
    element.innerHTML = this.createCharBox(text, className);
  }

  createCharBox(char, className) {
    return `<span class="char-box ${className}">${char}</span>`;
  }

  createPatternBox(pattern) {
    return pattern
      .split("")
      .map((char) => this.createCharBox(char, "char-processing"))
      .join("");
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  updateComparisonChart() {
    const rleTime =
      parseFloat(document.getElementById("rle-time").textContent) || 0;
    const kmpTime =
      parseFloat(document.getElementById("kmp-time").textContent) || 0;
    const lzwTime =
      parseFloat(document.getElementById("lzw-time").textContent) || 0;

    const maxTime = Math.max(rleTime, kmpTime, lzwTime, 1);

    // Update bar widths
    document.querySelector("#rle-bar .bar").style.width = `${
      (1 - rleTime / maxTime) * 100
    }%`;
    document
      .querySelector("#rle-bar .bar")
      .setAttribute("data-value", `${rleTime}ms`);

    document.querySelector("#kmp-bar .bar").style.width = `${
      (1 - kmpTime / maxTime) * 100
    }%`;
    document
      .querySelector("#kmp-bar .bar")
      .setAttribute("data-value", `${kmpTime}ms`);

    document.querySelector("#lzw-bar .bar").style.width = `${
      (1 - lzwTime / maxTime) * 100
    }%`;
    document
      .querySelector("#lzw-bar .bar")
      .setAttribute("data-value", `${lzwTime}ms`);
  }
}

// Initialize the visualizer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new AlgorithmVisualizer();
});
