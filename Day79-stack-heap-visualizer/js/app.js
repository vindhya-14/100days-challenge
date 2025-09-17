let steps = [];
let currentStep = 0;
let interval = null;

// Load code and generate simulation steps
function loadCode() {
  const code = document.getElementById("code").value;
  steps = simulate(code);
  currentStep = 0;
  renderStep();
}

// Auto play simulation
function playSimulation() {
  if (interval) return;
  interval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      renderStep();
    } else {
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
}

// Step-by-step simulation
function stepSimulation() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep();
  }
}

// Pause simulation
function pauseSimulation() {
  clearInterval(interval);
  interval = null;
}

// Reset simulation to the beginning
function resetSimulation() {
  currentStep = 0;
  renderStep();
  pauseSimulation();
}

// Render the current step (stack, heap, globals)
function renderStep() {
  const step = steps[currentStep];
  document.getElementById("stack-content").innerHTML = step.stack
    .map((f) => renderFrame(f))
    .join("");
  document.getElementById("heap-content").innerHTML = step.heap
    .map((h) => renderHeapObject(h))
    .join("");
  document.getElementById("globals-content").innerHTML = step.globals
    .map((g) => renderGlobal(g))
    .join("");
}

// Render stack frame
function renderFrame(frame) {
  return `<div class="frame"><strong>${frame.function}</strong>${frame.vars
    .map((v) => `<div class="var">${v.name} = ${v.value}</div>`)
    .join("")}</div>`;
}

// Render heap object
function renderHeapObject(obj) {
  return `<div class="heap-object"><strong>Addr ${obj.address}</strong>: ${obj.value}</div>`;
}

// Render global variable
function renderGlobal(g) {
  return `<div class="global-var"><strong>${g.name}</strong> = ${g.value}</div>`;
}

// Simple dummy simulation for demonstration
function simulate(code) {
  return [
    { stack: [], heap: [], globals: [] },
    {
      stack: [{ function: "main", vars: [{ name: "x", value: 10 }] }],
      heap: [],
      globals: [],
    },
    {
      stack: [
        {
          function: "main",
          vars: [
            { name: "x", value: 10 },
            { name: "p", value: "0x1" },
          ],
        },
      ],
      heap: [{ address: "0x1", value: 20 }],
      globals: [],
    },
    {
      stack: [
        {
          function: "main",
          vars: [
            { name: "x", value: 10 },
            { name: "p", value: "0x1" },
          ],
        },
        {
          function: "foo",
          vars: [
            { name: "y", value: 10 },
            { name: "z", value: 11 },
          ],
        },
      ],
      heap: [{ address: "0x1", value: 20 }],
      globals: [],
    },
    {
      stack: [
        {
          function: "main",
          vars: [
            { name: "x", value: 10 },
            { name: "p", value: "0x1" },
          ],
        },
      ],
      heap: [],
      globals: [],
    },
  ];
}

// Initialize default state
window.onload = () => {
  loadCode();
};
