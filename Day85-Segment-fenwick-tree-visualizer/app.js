class TreeVisualizer {
  constructor() {
    this.array = [];
    this.segTree = [];
    this.fenwickTree = [];
    this.stats = {
      segTree: { updates: 0, queries: 0 },
      fenwickTree: { updates: 0, queries: 0 },
    };
    this.animationSpeed = 5;
    this.initEventListeners();
    this.generateArray(8);
  }

  initEventListeners() {
    document.getElementById("generateArray").addEventListener("click", () => {
      const size = parseInt(document.getElementById("arraySize").value) || 8;
      this.generateArray(size);
    });

    document.getElementById("updateBtn").addEventListener("click", () => {
      this.handleUpdate();
    });

    document.getElementById("queryBtn").addEventListener("click", () => {
      this.handleQuery();
    });

    document.getElementById("arrayType").addEventListener("change", (e) => {
      this.toggleCustomInput(e.target.value === "custom");
    });

    document.getElementById("animationSpeed").addEventListener("input", (e) => {
      this.animationSpeed = parseInt(e.target.value);
    });

    document.getElementById("showIndices").addEventListener("change", () => {
      this.renderArray();
    });
  }

  toggleCustomInput(show) {
    const customInput = document.getElementById("customArrayInput");
    customInput.classList.toggle("hidden", !show);
  }

  generateArray(size) {
    const arrayType = document.getElementById("arrayType").value;

    switch (arrayType) {
      case "random":
        this.array = Array.from(
          { length: size },
          () => Math.floor(Math.random() * 50) + 1
        );
        break;
      case "sequential":
        this.array = Array.from({ length: size }, (_, i) => i + 1);
        break;
      case "custom":
        const customValues = document.getElementById("customValues").value;
        if (customValues) {
          this.array = customValues
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n));
        } else {
          this.array = Array.from({ length: size }, () => 1);
        }
        break;
    }

    this.buildSegmentTree();
    this.buildFenwickTree();
    this.renderAll();
    this.log("Array generated successfully!", "success");
  }

  buildSegmentTree() {
    const n = this.array.length;
    this.segTree = Array(2 * n).fill(0);

    for (let i = 0; i < n; i++) {
      this.segTree[n + i] = this.array[i];
    }

    for (let i = n - 1; i > 0; --i) {
      this.segTree[i] = this.segTree[i << 1] + this.segTree[(i << 1) | 1];
    }
  }

  buildFenwickTree() {
    const n = this.array.length;
    this.fenwickTree = Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
      this.addFenwick(i, this.array[i]);
    }
  }

  async updateArray(index, value) {
    if (index < 0 || index >= this.array.length) {
      this.log("Invalid index!", "warning");
      return;
    }

    const oldValue = this.array[index];
    this.array[index] = value;

    // Update Segment Tree
    this.updateSegmentTree(index, value);
    this.stats.segTree.updates++;

    // Update Fenwick Tree
    this.updateFenwick(index, value);
    this.stats.fenwickTree.updates++;

    await this.highlightUpdate(index);
    this.renderAll();
    this.updateStats();
    this.log(`Updated index ${index}: ${oldValue} → ${value}`, "success");
  }

  updateSegmentTree(index, value) {
    const n = this.array.length;
    let i = index + n;
    this.segTree[i] = value;

    while (i > 1) {
      i >>= 1;
      this.segTree[i] = this.segTree[i << 1] + this.segTree[(i << 1) | 1];
    }
  }

  addFenwick(idx, val) {
    idx++;
    while (idx < this.fenwickTree.length) {
      this.fenwickTree[idx] += val;
      idx += idx & -idx;
    }
  }

  updateFenwick(index, value) {
    const diff = value - this.array[index];
    this.addFenwick(index, diff);
  }

  async queryRange(l, r) {
    if (l < 0 || r >= this.array.length || l > r) {
      this.log("Invalid query range!", "warning");
      return;
    }

    this.stats.segTree.queries++;
    this.stats.fenwickTree.queries++;

    const segSum = await this.querySegmentTree(l, r);
    const fenwickSum = this.rangeQueryFenwick(l, r);

    this.renderArray(Array.from({ length: r - l + 1 }, (_, i) => i + l));
    this.updateStats();

    this.log(
      `Query [${l}, ${r}]: Segment Tree = ${segSum}, Fenwick Tree = ${fenwickSum}`,
      "info"
    );
  }

  async querySegmentTree(l, r) {
    const n = this.array.length;
    l += n;
    r += n;
    let sum = 0;
    const highlightNodes = [];

    while (l <= r) {
      if (l % 2 === 1) {
        sum += this.segTree[l];
        highlightNodes.push(l);
        l++;
      }
      if (r % 2 === 0) {
        sum += this.segTree[r];
        highlightNodes.push(r);
        r--;
      }
      l >>= 1;
      r >>= 1;
    }

    await this.highlightNodes("segmentTreeContainer", highlightNodes);
    return sum;
  }

  rangeQueryFenwick(l, r) {
    return this.queryFenwick(r) - (l > 0 ? this.queryFenwick(l - 1) : 0);
  }

  queryFenwick(idx) {
    idx++;
    let sum = 0;
    while (idx > 0) {
      sum += this.fenwickTree[idx];
      idx -= idx & -idx;
    }
    return sum;
  }

  async highlightUpdate(index) {
    const elements = document.querySelectorAll(
      `.array-element[data-index="${index}"]`
    );
    elements.forEach((el) => el.classList.add("highlight"));

    await this.delay();

    elements.forEach((el) => el.classList.remove("highlight"));
  }

  async highlightNodes(containerId, nodes) {
    const container = document.getElementById(containerId);
    const elements = container.querySelectorAll(".tree-node");

    // Highlight nodes
    nodes.forEach((nodeIndex) => {
      if (elements[nodeIndex]) {
        elements[nodeIndex].classList.add("highlight");
      }
    });

    await this.delay(2000 / this.animationSpeed);

    // Remove highlight
    elements.forEach((el) => el.classList.remove("highlight"));
  }

  delay(ms) {
    const baseDelay = 500 / this.animationSpeed;
    return new Promise((resolve) => setTimeout(resolve, ms || baseDelay));
  }

  renderAll() {
    this.renderArray();
    this.renderSegmentTree();
    this.renderFenwickTree();
  }

  renderArray(highlightIndices = []) {
    const container = document.getElementById("arrayContainer");
    const showIndices = document.getElementById("showIndices").checked;

    container.innerHTML = "";

    this.array.forEach((val, idx) => {
      const element = document.createElement("div");
      element.className = "array-element";
      element.setAttribute("data-index", idx);

      if (showIndices) {
        element.innerHTML = `
                    <span class="index">${idx}</span>
                    <span class="value">${val}</span>
                `;
      } else {
        element.textContent = val;
      }

      if (highlightIndices.includes(idx)) {
        element.classList.add("highlight");
      }

      container.appendChild(element);
    });
  }

  renderSegmentTree() {
    const container = document.getElementById("segmentTreeContainer");
    container.innerHTML = "";

    this.segTree.forEach((val, idx) => {
      const node = document.createElement("div");
      node.className = "tree-node segment";
      node.innerHTML = `
                <span class="node-value">${val}</span>
                <span class="node-index">${idx}</span>
            `;
      container.appendChild(node);
    });
  }

  renderFenwickTree() {
    const container = document.getElementById("fenwickTreeContainer");
    container.innerHTML = "";

    this.fenwickTree.slice(1).forEach((val, idx) => {
      const node = document.createElement("div");
      node.className = "tree-node fenwick";
      node.innerHTML = `
                <span class="node-value">${val}</span>
                <span class="node-index">${idx + 1}</span>
            `;
      container.appendChild(node);
    });
  }

  handleUpdate() {
    const index = parseInt(document.getElementById("updateIndex").value);
    const value = parseInt(document.getElementById("updateValue").value);

    if (isNaN(index) || isNaN(value)) {
      this.log("Please enter valid index and value!", "warning");
      return;
    }

    this.updateArray(index, value);
  }

  handleQuery() {
    const l = parseInt(document.getElementById("queryLeft").value);
    const r = parseInt(document.getElementById("queryRight").value);

    if (isNaN(l) || isNaN(r)) {
      this.log("Please enter valid range values!", "warning");
      return;
    }

    this.queryRange(l, r);
  }

  log(message, type = "info") {
    const output = document.getElementById("output");
    const logEntry = document.createElement("div");
    logEntry.className = `log-entry ${type}`;

    const icon =
      type === "success"
        ? "fa-check-circle"
        : type === "warning"
        ? "fa-exclamation-triangle"
        : "fa-info-circle";

    logEntry.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${new Date().toLocaleTimeString()} - ${message}</span>
        `;

    output.appendChild(logEntry);
    output.scrollTop = output.scrollHeight;
  }

  updateStats() {
    document.getElementById(
      "segTreeStats"
    ).textContent = `${this.stats.segTree.updates} updates, ${this.stats.segTree.queries} queries`;

    document.getElementById(
      "fenwickTreeStats"
    ).textContent = `${this.stats.fenwickTree.updates} updates, ${this.stats.fenwickTree.queries} queries`;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TreeVisualizer();
});
