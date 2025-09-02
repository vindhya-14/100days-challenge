
const STAGES = ["IF", "ID", "EX", "MEM", "WB"];



function makeInstruction(
  id,
  text,
  type,
  rd = null,
  rs1 = null,
  rs2 = null,
  taken = false
) {
  return { id, text, type, rd, rs1, rs2, taken };
}

const demoInstructions = [
  makeInstruction(1, "LD R1, 0(R2)", "load", "R1", "R2", null),
  makeInstruction(2, "ADD R3, R1, R4", "alu", "R3", "R1", "R4"),
  makeInstruction(3, "SUB R5, R3, R6", "alu", "R5", "R3", "R6"),
  makeInstruction(4, "ST R5, 4(R2)", "store", null, "R5", "R2"),
  makeInstruction(5, "BEQ R5, R0, label", "branch", null, "R5", "R0", true),
  makeInstruction(6, "ADD R7, R8, R9", "alu", "R7", "R8", "R9"),
];

// initial state factory
function initialState() {
  // pipelineSlots: array for each stage containing instruction or null & stage metadata
  const pipelineSlots = STAGES.map((s) => ({ stage: s, instr: null }));
  // instruction queue (IF fetch queue)
  const instrQueue = demoInstructions.map((i) => ({ ...i }));
  return {
    cycle: 0,
    pipelineSlots,
    instrQueue,
    completed: [],
    forwarding: true,
    history: [],
  };
}



function willCauseLoadUse(prevInstr, curInstr) {
  if (!prevInstr || !curInstr) return false;
  if (prevInstr.type !== "load") return false;
  if (!prevInstr.rd) return false;
  const rd = prevInstr.rd;
  return curInstr.rs1 === rd || curInstr.rs2 === rd;
}

function hasRAW(producer, consumer) {
  if (!producer || !producer.rd) return false;
  if (!consumer) return false;
  return consumer.rs1 === producer.rd || consumer.rs2 === producer.rd;
}

function detectDataHazard(state, idxOfID) {
  // idxOfID is pipeline index for ID
  const slots = state.pipelineSlots;
  const idSlot = slots[idxOfID];
  const instr = idSlot.instr;
  if (!instr) return null;
  // look at older instructions ahead (EX, MEM, WB)
  for (let aheadIdx = idxOfID + 1; aheadIdx < slots.length; aheadIdx++) {
    const aheadInstr = slots[aheadIdx].instr;
    if (!aheadInstr) continue;
    if (hasRAW(aheadInstr, instr)) {
      return {
        type: "RAW",
        producer: aheadInstr,
        location: slots[aheadIdx].stage,
      };
    }
  }
  return null;
}

function step(state) {
  const slots = state.pipelineSlots.map((s) => ({ ...s })); // shallow copy
  const queue = state.instrQueue.slice();
  const completed = state.completed.slice();
  const cycle = state.cycle + 1;
  const forwarding = state.forwarding;

  // We'll attempt to move from WB backward to IF.
  // Keep a 'willOccupy' to know if MEM will be free.
  let memDesiredThisCycle = false;
  // 1) Move WB -> complete
  const wbIdx = slots.length - 1;
  if (slots[wbIdx].instr) {
    completed.push({ ...slots[wbIdx].instr, completedAt: cycle });
    slots[wbIdx].instr = null;
  }

  // 2) Move MEM -> WB if possible
  for (let i = slots.length - 2; i >= 0; i--) {
    const destIdx = i + 1;
    const instr = slots[i].instr;
    if (!instr) continue;
    // structural hazard: ensure destination is free
    if (slots[destIdx].instr === null) {
      // check: if destination stage is MEM and another instruction also wants MEM at same cycle, block younger later
      if (slots[destIdx].stage === "MEM") {
        if (!memDesiredThisCycle) {
          slots[destIdx].instr = instr;
          slots[i].instr = null;
          memDesiredThisCycle = true;
        } else {
          // cannot move into MEM due to structural hazard -> stall here
          // keep in place
        }
      } else {
        slots[destIdx].instr = instr;
        slots[i].instr = null;
      }
    } else {
      // destination occupied -> stall
    }
  }

  // 3) Handle ID stage hazards (stall conditions before allowing IF->ID or ID->EX)
  const idIdx = 1; // IF=0, ID=1, EX=2, MEM=3, WB=4
  const idInstr = slots[idIdx].instr;
  let stallID = false;
  let stallReason = null;

  if (idInstr) {
    // data hazard detection: check producers in EX, MEM, WB
    const hazard = detectDataHazard({ pipelineSlots: slots }, idIdx);
    if (hazard) {
      // if it's a load-use hazard specifically (producer is load in EX or MEM), and producer in EX or MEM,
      const producer = hazard.producer;
      const producerStage = hazard.location;
      if (
        producer.type === "load" &&
        (producerStage === "EX" || producerStage === "MEM")
      ) {
        // load-use hazard -> one-cycle stall even when forwarding enabled
        stallID = true;
        stallReason = "load-use";
      } else {
        // RAW hazard - if forwarding disabled, stall; if enabled allow
        if (!forwarding) {
          stallID = true;
          stallReason = "RAW (no forwarding)";
        } else {
          // forwarding resolves RAW (we let it proceed)
          stallID = false;
        }
      }
    }
  }

  // 4) If ID can move to EX, we should have already attempted earlier. But because we moved top-down we may need to
  // ensure id -> ex move if ex is free and no stall
  const exIdx = 2;
  if (!stallID && slots[idIdx].instr && !slots[exIdx].instr) {
    // move ID->EX
    slots[exIdx].instr = slots[idIdx].instr;
    slots[idIdx].instr = null;
  }

  // 5) Fetch stage: if IF free and queue has instruction AND ID is free (can't fetch into ID if ID is occupied)
  const ifIdx = 0;
  if (
    slots[ifIdx].instr === null &&
    queue.length > 0 &&
    slots[idIdx].instr === null
  ) {
    // fetch next
    const next = queue.shift();
    slots[ifIdx].instr = next;
  }

  // 6) Advance IF->ID if ID free and IF has instr AND not stalled by ID hazard
  if (!stallID && slots[ifIdx].instr && slots[idIdx].instr === null) {
    slots[idIdx].instr = slots[ifIdx].instr;
    slots[ifIdx].instr = null;
  }

  // 7) Branch handling: if an instruction in EX is branch and taken, flush IF (set IF slot to null) and drop queue entries
  // locate EX
  const exInstr = slots[exIdx].instr;
  if (exInstr && exInstr.type === "branch" && exInstr.taken) {
    // flush IF and clear a next queued instruction to simulate pipeline flush and refetch after branch
    if (slots[ifIdx].instr) {
      // drop the fetched instruction - flushed
      slots[ifIdx].instr = null;
    }
    // clear the entire fetch queue (simple model) to let user reinsert or continue
    // In a real CPU you'd fetch from branch target; here we'll just stop fetch for 1 cycle for clarity
    // We'll not lose EX/MEM/WB pipeline contents except IF
    // Optionally, we could add a bubble (null in ID next cycle)
  }

  const historyEntry = {
    cycle,
    slots: slots.map((s) => ({ ...s, instr: s.instr ? { ...s.instr } : null })),
    stallID,
    stallReason,
    queueLen: queue.length,
  };

  return {
    ...state,
    cycle,
    pipelineSlots: slots,
    instrQueue: queue,
    completed,
    history: [...state.history, historyEntry],
  };
}

export default {
  initialState,
  step,
};
