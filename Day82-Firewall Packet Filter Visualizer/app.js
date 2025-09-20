// === Firewall Rules Storage ===
let rules = [];

// === DOM Elements ===
const ruleForm = document.getElementById("ruleForm");
const rulesList = document.getElementById("rulesList");
const packetForm = document.getElementById("packetForm");
const packetResult = document.getElementById("packetResult");
const packetLog = document.getElementById("packetLog");

// === Add Rule ===
ruleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const srcIP = document.getElementById("srcIP").value.trim();
  const destIP = document.getElementById("destIP").value.trim();
  const action = document.getElementById("action").value;

  if (!srcIP || !destIP || !action) return;

  const rule = { srcIP, destIP, action };
  rules.push(rule);
  displayRules();

  ruleForm.reset();
});

// === Display Rules ===
function displayRules() {
  rulesList.innerHTML = "";
  rules.forEach((rule, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${rule.srcIP} ➝ ${rule.destIP}</span>
      <span class="${rule.action === "allow" ? "allow" : "block"}">
        ${rule.action.toUpperCase()}
      </span>
      <button class="delete-btn" data-index="${index}">❌</button>
    `;
    rulesList.appendChild(li);
  });

  // Attach delete listeners
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      rules.splice(index, 1);
      displayRules();
    });
  });
}

// === Simulate Packet ===
packetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const packetSrc = document.getElementById("packetSrc").value.trim();
  const packetDest = document.getElementById("packetDest").value.trim();

  if (!packetSrc || !packetDest) return;

  let decision = "allow"; // Default if no rule matches
  for (let rule of rules) {
    if (rule.srcIP === packetSrc && rule.destIP === packetDest) {
      decision = rule.action;
      break;
    }
  }

  showPacketResult(decision, packetSrc, packetDest);
  logPacket(packetSrc, packetDest, decision);

  packetForm.reset();
});

// === Show Packet Result ===
function showPacketResult(decision, src, dest) {
  packetResult.style.display = "block";
  packetResult.className = decision === "allow" ? "allow" : "block";
  packetResult.textContent = `Packet from ${src} ➝ ${dest} ${
    decision === "allow" ? "ALLOWED ✅" : "BLOCKED ❌"
  }`;
}

// === Log Packet ===
function logPacket(src, dest, decision) {
  const li = document.createElement("li");
  li.textContent = `${new Date().toLocaleTimeString()} | ${src} ➝ ${dest} : ${decision.toUpperCase()}`;
  packetLog.prepend(li); // Newest first
}
