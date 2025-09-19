const BUFFER_SIZE = 5;
const DISK_SIZE = 12;

let bufferPool = [];
let diskPages = [];
let logEl = document.getElementById("log");

function init() {
  const bufferSlots = document.getElementById("bufferSlots");
  const diskSlots = document.getElementById("diskPages");

  for (let i = 0; i < BUFFER_SIZE; i++) {
    bufferPool.push({ id: null, dirty: false, status: "empty" });
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.status = "Empty";
    slot.id = `buffer-${i}`;
    bufferSlots.appendChild(slot);
  }

  for (let i = 1; i <= DISK_SIZE; i++) {
    diskPages.push(i);
    const slot = document.createElement("div");
    slot.className = "slot clean";
    slot.textContent = i;
    slot.dataset.status = "Clean";
    slot.id = `disk-${i}`;
    document.getElementById("diskPages").appendChild(slot);
  }

  log("Simulation initialized.", "success");
}

function log(message, type = "") {
  const entry = document.createElement("li");
  entry.textContent = message;
  if (type) entry.classList.add(type);
  logEl.prepend(entry);
}

function findInBuffer(pageId) {
  return bufferPool.findIndex((p) => p.id === pageId);
}

function updateBufferUI() {
  bufferPool.forEach((page, idx) => {
    const slot = document.getElementById(`buffer-${idx}`);
    slot.textContent = page.id ?? "";
    slot.dataset.status =
      page.status.charAt(0).toUpperCase() + page.status.slice(1);

    slot.className = "slot";
    if (page.status === "dirty") slot.classList.add("dirty");
    else if (page.status === "clean") slot.classList.add("clean");
    else if (page.status === "evicted") slot.classList.add("evicted");
  });
}

function requestPage() {
  const pageId = Math.floor(Math.random() * DISK_SIZE) + 1;
  const index = findInBuffer(pageId);

  if (index !== -1) {
    log(`Page ${pageId} found in buffer (HIT).`, "success");
    if (Math.random() < 0.5) {
      bufferPool[index].dirty = true;
      bufferPool[index].status = "dirty";
      log(`Page ${pageId} modified → marked DIRTY.`, "warning");
    }
  } else {
    log(`Page ${pageId} not in buffer (MISS). Loading...`, "error");
    let evictIndex = bufferPool.findIndex((p) => p.id === null);
    if (evictIndex === -1) {
      evictIndex = 0;
      const evicted = bufferPool[evictIndex];
      if (evicted.id !== null) {
        if (evicted.status === "dirty") {
          log(
            `Evicting dirty page ${evicted.id} → flushing to disk.`,
            "warning"
          );
          const diskSlot = document.getElementById(`disk-${evicted.id}`);
          if (diskSlot) {
            diskSlot.classList.remove("dirty");
            diskSlot.classList.add("clean");
            diskSlot.dataset.status = "Clean";
          }
        } else {
          log(`Evicting clean page ${evicted.id}.`, "warning");
        }
      }
    }
    bufferPool[evictIndex] = { id: pageId, dirty: false, status: "clean" };
    log(`Page ${pageId} loaded into buffer slot ${evictIndex}.`, "success");
  }

  updateBufferUI();
}

function flushDirtyPages() {
  bufferPool.forEach((page, idx) => {
    if (page.status === "dirty") {
      log(`Flushing page ${page.id} from buffer to disk.`, "success");
      page.status = "clean";
      page.dirty = false;

      const diskSlot = document.getElementById(`disk-${page.id}`);
      if (diskSlot) {
        diskSlot.classList.remove("dirty");
        diskSlot.classList.add("clean");
        diskSlot.dataset.status = "Clean";
      }
    }
  });
  updateBufferUI();
}

document
  .getElementById("requestPageBtn")
  .addEventListener("click", requestPage);
document.getElementById("flushBtn").addEventListener("click", flushDirtyPages);

init();
