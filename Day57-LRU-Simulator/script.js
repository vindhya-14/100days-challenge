document.getElementById("startBtn").addEventListener("click", runSimulation);

function runSimulation() {
  const sequenceInput = document.getElementById("sequence").value.trim();
  const cacheSize = parseInt(document.getElementById("cacheSize").value, 10);
  const sequence = sequenceInput.split(/\s+/).map(Number);

  const memoryDiv = document.getElementById("memory");
  const cacheDiv = document.getElementById("cache");
  const logDiv = document.getElementById("log");

  memoryDiv.innerHTML = "";
  cacheDiv.innerHTML = "";
  logDiv.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const box = document.createElement("div");
    box.className = "box";
    box.textContent = i;
    memoryDiv.appendChild(box);
  }

  let cache = [];
  let hits = 0,
    misses = 0;

  sequence.forEach((addr, idx) => {
    setTimeout(() => {
      let status = "";

      if (cache.includes(addr)) {
        hits++;
        status = `Hit: Address ${addr} already in cache.`;
        cache = cache.filter((x) => x !== addr);
        cache.unshift(addr);
      } else {
        misses++;
        status = `Miss: Address ${addr} fetched from memory.`;
        if (cache.length >= cacheSize) {
          cache.pop();
        }
        cache.unshift(addr);
      }

      cacheDiv.innerHTML = "";
      for (let val of cache) {
        const box = document.createElement("div");
        box.className = "box";
        box.textContent = val;
        cacheDiv.appendChild(box);
      }

      const memBoxes = memoryDiv.querySelectorAll(".box");
      memBoxes.forEach((box) => {
        box.classList.remove("hit", "miss");
        if (parseInt(box.textContent) === addr) {
          box.classList.add(cache.includes(addr) ? "hit" : "miss");
        }
      });

      const logEntry = document.createElement("div");
      logEntry.textContent = `Step ${idx + 1}: ${status}`;
      logDiv.appendChild(logEntry);

      logDiv.scrollTop = logDiv.scrollHeight;

      if (idx === sequence.length - 1) {
        const result = document.createElement("div");
        result.innerHTML = `<b>Hits:</b> ${hits}, <b>Misses:</b> ${misses}`;
        logDiv.appendChild(result);
      }
    }, idx * 800);
  });
}
