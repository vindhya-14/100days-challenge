document.getElementById("startBtn").addEventListener("click", startSimulation);
document.getElementById("resetBtn").addEventListener("click", resetSimulation);

const logList = document.getElementById("logList");
const container = document.querySelector(".network-container");

function logMessage(message) {
  const li = document.createElement("li");
  li.textContent = message;
  logList.appendChild(li);
  logList.scrollTop = logList.scrollHeight;
}

function createPacket() {
  const packet = document.createElement("div");
  packet.classList.add("packet");
  container.appendChild(packet);
  return packet;
}

function animatePacket(packet, fromNode, toNode, delay = 1000) {
  return new Promise((resolve) => {
    const fromRect = fromNode.getBoundingClientRect();
    const toRect = toNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    packet.style.left =
      fromRect.left + fromRect.width / 2 - containerRect.left - 10 + "px";
    packet.style.top =
      fromRect.top + fromRect.height / 2 - containerRect.top - 10 + "px";

    setTimeout(() => {
      packet.style.transition = "all " + delay / 1000 + "s linear";
      packet.style.left =
        toRect.left + toRect.width / 2 - containerRect.left - 10 + "px";
      packet.style.top =
        toRect.top + toRect.height / 2 - containerRect.top - 10 + "px";

      setTimeout(() => {
        resolve();
      }, delay);
    }, 100);
  });
}

async function startSimulation() {
  logMessage("Simulation started...");
  const sensor = document.querySelector(".sensor");
  const gateway = document.querySelector(".gateway");
  const cloud = document.querySelector(".cloud");
  const dashboard = document.querySelector(".dashboard");

  const packet = createPacket();

  // Sensor → Gateway
  logMessage("Sending data from Sensor to Gateway...");
  await animatePacket(packet, sensor, gateway, randomDelay());
  if (packetLost()) {
    logMessage(" Packet lost at Gateway!");
    packet.remove();
    return;
  }
  logMessage(" Gateway received data.");

  // Gateway → Cloud
  logMessage("Sending data from Gateway to Cloud...");
  await animatePacket(packet, gateway, cloud, randomDelay());
  if (packetLost()) {
    logMessage(" Packet lost in Cloud transmission!");
    packet.remove();
    return;
  }
  logMessage("Cloud received data.");

  // Cloud → Dashboard
  logMessage("Sending data from Cloud to Dashboard...");
  await animatePacket(packet, cloud, dashboard, randomDelay());
  if (packetLost()) {
    logMessage(" Packet lost before reaching Dashboard!");
    packet.remove();
    return;
  }
  logMessage(" Dashboard updated with sensor data.");
  packet.remove();
}

function resetSimulation() {
  logList.innerHTML = "";
  document.querySelectorAll(".packet").forEach((p) => p.remove());
  logMessage("Simulation reset.");
}

function packetLost() {
  return Math.random() < 0.2; // 20% chance
}

function randomDelay() {
  return 1000 + Math.random() * 2000; // 1-3 seconds
}
