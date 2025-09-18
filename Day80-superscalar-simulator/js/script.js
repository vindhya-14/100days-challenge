const instructions = [];
let cycle = 0;

const stages = ["fetch", "decode", "execute", "writeback"];

// Random instruction generator
function createInstruction() {
  const registers = ["R1", "R2", "R3", "R4", "R5"];
  const opcodes = ["ADD", "MUL", "SUB", "DIV", "LOAD", "STORE"];
  const op = opcodes[Math.floor(Math.random() * opcodes.length)];
  const dest = registers[Math.floor(Math.random() * registers.length)];
  const src1 = registers[Math.floor(Math.random() * registers.length)];
  const src2 = registers[Math.floor(Math.random() * registers.length)];
  return {
    id: instructions.length + 1,
    op,
    dest,
    src: [src1, src2],
    timeline: [],
  };
}

// Add instruction
document.getElementById("addInstruction").addEventListener("click", () => {
  instructions.push(createInstruction());
  render();
});

// Simulate cycle
document.getElementById("nextCycle").addEventListener("click", () => {
  cycle++;
  instructions.forEach((instr) => {
    if (instr.timeline.length < stages.length) {
      instr.timeline.push(stages[instr.timeline.length]);
    }
  });
  render();
});

// Reset
document.getElementById("reset").addEventListener("click", () => {
  instructions.length = 0;
  cycle = 0;
  render();
});

// Detect hazards
function detectHazards() {
  let hazards = [];
  for (let i = 0; i < instructions.length; i++) {
    for (let j = i + 1; j < instructions.length; j++) {
      const a = instructions[i];
      const b = instructions[j];
      // RAW
      if (b.src.includes(a.dest))
        hazards.push({ type: "RAW", from: a.id, to: b.id });
      // WAR
      if (a.src.includes(b.dest))
        hazards.push({ type: "WAR", from: a.id, to: b.id });
      // WAW
      if (a.dest === b.dest)
        hazards.push({ type: "WAW", from: a.id, to: b.id });
    }
  }
  return hazards;
}

// Render pipeline
function render() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  const hazards = detectHazards();

  instructions.forEach((instr) => {
    const row = document.createElement("div");
    row.classList.add("instruction");
    row.innerHTML = `<strong>I${instr.id}: ${instr.op} ${
      instr.dest
    }, ${instr.src.join(", ")}</strong>`;

    instr.timeline.forEach((stage) => {
      const stageDiv = document.createElement("div");
      stageDiv.classList.add("stage", stage);
      stageDiv.textContent = stage.toUpperCase();
      row.appendChild(stageDiv);
    });

    // Attach hazards
    hazards
      .filter((h) => h.from === instr.id || h.to === instr.id)
      .forEach((h) => {
        const hazardSpan = document.createElement("span");
        hazardSpan.classList.add("hazard", h.type.toLowerCase());
        hazardSpan.title = `${h.type} Hazard between I${h.from} and I${h.to}`;
        row.appendChild(hazardSpan);
      });

    container.appendChild(row);
  });
}
