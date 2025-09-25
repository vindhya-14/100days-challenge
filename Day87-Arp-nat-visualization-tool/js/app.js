// References
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const tableArp = document.getElementById("arpTable");
const tableNat = document.getElementById("natTable");
const svg = document.getElementById("net");

// State
let step = 0;
let packet;

// Reset everything
function reset() {
  step = 0;
  tableArp.innerHTML = "";
  tableNat.innerHTML = "";
  if (packet) {
    packet.remove();
    packet = null;
  }
  const bc = svg.querySelector(".broadcast");
  bc.classList.add("hidden");
}
reset();

// Start sequence
function start() {
  if (step === 0) {
    broadcastARP();
  } else if (step === 1) {
    receiveARP();
  } else if (step === 2) {
    natTranslate();
  }
  step++;
}

// ARP broadcast
function broadcastARP() {
  const bc = svg.querySelector(".broadcast");
  bc.classList.remove("hidden");
  bc.classList.add("broadcast-anim");
  setTimeout(() => {
    bc.classList.remove("broadcast-anim");
  }, 1600);
}

// ARP reply and table update
function receiveARP() {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>10.0.0.2</td><td>AA:BB:CC:DD:EE:02</td>`;
  tableArp.appendChild(tr);

  packet = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  packet.setAttribute("r", 8);
  packet.setAttribute("class", "packet packet-move");
  svg.appendChild(packet);

  // Start position (host1)
  packet.setAttribute("cx", 90);
  packet.setAttribute("cy", 180);

  setTimeout(() => {
    packet.setAttribute("transform", "translate(200,0)");
  }, 100);
}

// NAT translation
function natTranslate() {
  const tr = document.createElement("tr");
  tr.innerHTML = `<td>10.0.0.2</td><td>203.0.113.10</td>`;
  tableNat.appendChild(tr);

  if (packet) {
    setTimeout(() => {
      packet.setAttribute("transform", "translate(400,0)");
    }, 100);
  }
}

// Event listeners
startBtn.addEventListener("click", start);
resetBtn.addEventListener("click", reset);
