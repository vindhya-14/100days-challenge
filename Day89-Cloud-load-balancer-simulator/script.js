// Enhanced Cloud Load Balancer Simulator
class LoadBalancerSimulator {
  constructor() {
    this.servers = [];
    this.running = false;
    this.ticker = null;
    this.requestId = 0;
    this.rrIndex = 0;
    this.stats = {
      incoming: 0,
      processed: 0,
      active: 0,
      failed: 0,
      startTime: null,
    };
    this.clientIPs = ["192.168.1.1", "10.0.0.5", "172.16.0.3", "203.0.113.45"];
    this.currentIPIndex = 0;

    this.initializeDOM();
    this.bindEvents();
    this.resetSimulation();
  }

  initializeDOM() {
    this.DOM = {
      // Controls
      algo: document.getElementById("algoSelect"),
      rate: document.getElementById("rate"),
      rateVal: document.getElementById("rateVal"),
      speed: document.getElementById("speed"),
      speedVal: document.getElementById("speedVal"),
      duration: document.getElementById("duration"),
      durationVal: document.getElementById("durationVal"),
      start: document.getElementById("startBtn"),
      pause: document.getElementById("pauseBtn"),
      step: document.getElementById("stepBtn"),
      reset: document.getElementById("resetBtn"),

      // Server Management
      serversList: document.getElementById("serversList"),
      newName: document.getElementById("newServerName"),
      newWeight: document.getElementById("newServerWeight"),
      addServerBtn: document.getElementById("addServerBtn"),
      serverCount: document.getElementById("serverCount"),
      presetBalanced: document.getElementById("presetBalanced"),
      presetWeighted: document.getElementById("presetWeighted"),

      // Visualization
      arena: document.getElementById("arena"),
      incomingCount: document.getElementById("incomingCount"),
      processedCount: document.getElementById("processedCount"),
      activeCount: document.getElementById("activeCount"),
      successRate: document.getElementById("successRate"),
      metrics: document.getElementById("metrics"),
      log: document.getElementById("log"),
      clearLog: document.getElementById("clearLog"),

      // Status
      statusDot: document.getElementById("statusDot"),
      statusText: document.getElementById("statusText"),

      // Modals
      helpModal: document.getElementById("helpModal"),
      closeHelp: document.getElementById("closeHelp"),
      helpBtn: document.getElementById("helpBtn"),
      exportBtn: document.getElementById("exportBtn"),
    };
  }

  bindEvents() {
    // Control events
    this.DOM.rate.addEventListener("input", () => this.updateRate());
    this.DOM.speed.addEventListener("input", () => this.updateSpeed());
    this.DOM.duration.addEventListener("input", () => this.updateDuration());
    this.DOM.algo.addEventListener("change", () => this.updateAlgorithmInfo());

    // Button events
    this.DOM.start.addEventListener("click", () => this.startSimulation());
    this.DOM.pause.addEventListener("click", () => this.pauseSimulation());
    this.DOM.step.addEventListener("click", () => this.spawnRequest());
    this.DOM.reset.addEventListener("click", () => this.resetSimulation());

    // Server events
    this.DOM.addServerBtn.addEventListener("click", () => this.addServer());
    this.DOM.presetBalanced.addEventListener("click", () =>
      this.loadPreset("balanced")
    );
    this.DOM.presetWeighted.addEventListener("click", () =>
      this.loadPreset("weighted")
    );
    this.DOM.clearLog.addEventListener("click", () => this.clearLog());

    // Modal events
    this.DOM.helpBtn.addEventListener("click", () => this.showHelp());
    this.DOM.closeHelp.addEventListener("click", () => this.hideHelp());
    this.DOM.exportBtn.addEventListener("click", () => this.exportData());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === this.DOM.helpModal) this.hideHelp();
    });
  }

  makeServer(name, weight = 1, healthy = true) {
    return {
      id: "s-" + Math.random().toString(36).slice(2, 8),
      name: name || `srv-${this.servers.length + 1}`,
      weight: Math.max(1, Number(weight) || 1),
      active: 0,
      handled: 0,
      failed: 0,
      healthy: healthy,
      currentWeight: 0,
      failureChance: 0,
      el: null,
    };
  }

  loadPreset(type) {
    this.servers = [];

    if (type === "balanced") {
      this.servers = [
        this.makeServer("Web-01", 1),
        this.makeServer("Web-02", 1),
        this.makeServer("Web-03", 1),
      ];
    } else if (type === "weighted") {
      this.servers = [
        this.makeServer("Small-01", 1),
        this.makeServer("Medium-01", 2),
        this.makeServer("Large-01", 3),
      ];
    }

    this.renderServersList();
    this.renderArena();
    this.log(`Loaded ${type} server preset`, "info");
  }

  addServer() {
    const name = this.DOM.newName.value || `Server-${this.servers.length + 1}`;
    const weight = Math.max(1, Number(this.DOM.newWeight.value) || 1);

    const server = this.makeServer(name, weight);
    this.servers.push(server);

    this.DOM.newName.value = "";
    this.DOM.newWeight.value = 1;

    this.renderServersList();
    this.renderArena();
    this.log(`Added server: ${name} (Weight: ${weight})`, "info");
  }

  removeServer(index) {
    const server = this.servers.splice(index, 1)[0];
    this.renderServersList();
    this.renderArena();
    this.log(`Removed server: ${server.name}`, "warning");
  }

  toggleServerHealth(index) {
    const server = this.servers[index];
    server.healthy = !server.healthy;
    this.renderServersList();
    this.renderArena();
    this.log(
      `Server ${server.name} ${server.healthy ? "recovered" : "failed"}`,
      server.healthy ? "info" : "error"
    );
  }

  updateServerWeight(index, weight) {
    const server = this.servers[index];
    const oldWeight = server.weight;
    server.weight = Math.max(1, Math.min(10, Number(weight) || 1));
    this.renderServersList();
    this.log(
      `Updated ${server.name} weight: ${oldWeight} → ${server.weight}`,
      "info"
    );
  }

  updateServerFailureChance(index, chance) {
    const server = this.servers[index];
    server.failureChance = Math.max(0, Math.min(100, Number(chance) || 0));
    this.renderServersList();
  }

  selectServer() {
    if (this.servers.length === 0) return null;

    const algorithm = this.DOM.algo.value;
    const healthyServers = this.servers.filter((s) => s.healthy);

    if (healthyServers.length === 0) return null;

    switch (algorithm) {
      case "rr":
        return this.roundRobin(healthyServers);
      case "lc":
        return this.leastConnections(healthyServers);
      case "wrr":
        return this.weightedRoundRobin(healthyServers);
      case "iphash":
        return this.ipHash(healthyServers);
      default:
        return this.roundRobin(healthyServers);
    }
  }

  roundRobin(servers) {
    this.rrIndex = this.rrIndex % servers.length;
    return servers[this.rrIndex++];
  }

  leastConnections(servers) {
    return servers.reduce(
      (min, server) => (server.active < min.active ? server : min),
      servers[0]
    );
  }

  weightedRoundRobin(servers) {
    let totalWeight = servers.reduce((sum, server) => sum + server.weight, 0);
    let selected = servers[0];

    servers.forEach((server) => (server.currentWeight += server.weight));
    selected = servers.reduce(
      (max, server) =>
        server.currentWeight > max.currentWeight ? server : max,
      servers[0]
    );

    selected.currentWeight -= totalWeight;
    return selected;
  }

  ipHash(servers) {
    const ip = this.clientIPs[this.currentIPIndex];
    this.currentIPIndex = (this.currentIPIndex + 1) % this.clientIPs.length;

    const hash = ip.split(".").reduce((sum, octet) => sum + parseInt(octet), 0);
    return servers[hash % servers.length];
  }

  spawnRequest() {
    if (this.servers.length === 0) return;

    const server = this.selectServer();
    if (!server) {
      this.log("No healthy servers available! Request failed.", "error");
      this.stats.failed++;
      this.updateStats();
      return;
    }

    this.stats.incoming++;
    this.stats.active++;
    this.updateStats();

    const request = {
      id: ++this.requestId,
      startTime: Date.now(),
      server: server,
      failed: false,
    };

    this.animateRequest(request);
  }

  animateRequest(request) {
    const dot = document.createElement("div");
    dot.className = "request-dot";
    dot.id = `request-${request.id}`;
    document.body.appendChild(dot);

    const startRect = this.DOM.arena.getBoundingClientRect();
    const serverEl = request.server.el;
    const targetRect = serverEl.getBoundingClientRect();

    const startX = startRect.left + Math.random() * startRect.width;
    const startY = startRect.top + 20;
    const targetX = targetRect.left + targetRect.width / 2 - 6;
    const targetY = targetRect.top + 100 + Math.random() * 80;

    dot.style.left = startX + "px";
    dot.style.top = startY + "px";

    // Animate to server
    request.animation = setTimeout(() => {
      dot.style.transition = `all ${600 / this.getSpeed()}ms ease-in-out`;
      dot.style.left = targetX + "px";
      dot.style.top = targetY + "px";

      // Process request
      request.processing = setTimeout(() => {
        this.processRequest(request);
      }, 100 / this.getSpeed());
    }, 50);
  }

  processRequest(request) {
    const dot = document.getElementById(`request-${request.id}`);
    if (dot) {
      dot.remove();
    }

    const server = request.server;
    const queueEl = server.el.querySelector(".server-queue");
    const requestDot = document.createElement("div");
    requestDot.className = "request-dot processing";
    queueEl.appendChild(requestDot);

    server.active++;
    this.updateServerDisplay(server);

    // Simulate processing with potential failure
    const baseDuration = Number(this.DOM.duration.value);
    const duration = baseDuration * (0.8 + Math.random() * 0.4);
    const willFail = Math.random() * 100 < server.failureChance;

    setTimeout(() => {
      if (requestDot.parentNode === queueEl) {
        queueEl.removeChild(requestDot);
      }

      server.active--;
      this.stats.active--;

      if (willFail && server.healthy) {
        server.failed++;
        request.failed = true;
        this.stats.failed++;
        this.log(`Request ${request.id} failed on ${server.name}`, "error");

        // Random chance to mark server as unhealthy
        if (Math.random() < 0.3) {
          server.healthy = false;
          this.renderServersList();
          this.renderArena();
          this.log(`Server ${server.name} marked as unhealthy`, "error");
        }
      } else {
        server.handled++;
        this.stats.processed++;
        this.log(
          `Request ${request.id} completed on ${server.name} (${Math.round(
            duration
          )}ms)`,
          "info"
        );
      }

      this.updateServerDisplay(server);
      this.updateStats();
      this.updateMetrics();
    }, duration / this.getSpeed());
  }

  startSimulation() {
    if (this.running) return;

    this.running = true;
    this.stats.startTime = this.stats.startTime || Date.now();

    this.DOM.start.disabled = true;
    this.DOM.pause.disabled = false;
    this.DOM.statusDot.className = "status-dot";
    this.DOM.statusText.textContent = "Running";

    const interval = 1000 / Math.max(1, this.getRate());
    this.ticker = setInterval(() => {
      for (let i = 0; i < Math.ceil(this.getRate() / 10); i++) {
        this.spawnRequest();
      }
    }, interval);

    this.log("Simulation started", "info");
  }

  pauseSimulation() {
    if (!this.running) return;

    this.running = false;
    clearInterval(this.ticker);

    this.DOM.start.disabled = false;
    this.DOM.pause.disabled = true;
    this.DOM.statusDot.className = "status-dot paused";
    this.DOM.statusText.textContent = "Paused";

    this.log("Simulation paused", "warning");
  }

  resetSimulation() {
    this.pauseSimulation();

    this.servers.forEach((server) => {
      server.active = 0;
      server.handled = 0;
      server.failed = 0;
      server.currentWeight = 0;
      server.healthy = true;
    });

    this.stats = {
      incoming: 0,
      processed: 0,
      active: 0,
      failed: 0,
      startTime: null,
    };

    this.requestId = 0;
    this.rrIndex = 0;

    this.DOM.statusDot.className = "status-dot stopped";
    this.DOM.statusText.textContent = "Ready";

    this.renderServersList();
    this.renderArena();
    this.updateStats();
    this.updateMetrics();

    this.log("Simulation reset", "info");
  }

  updateRate() {
    this.DOM.rateVal.textContent = this.DOM.rate.value;
    if (this.running) {
      this.pauseSimulation();
      this.startSimulation();
    }
  }

  updateSpeed() {
    this.DOM.speedVal.textContent = this.DOM.speed.value + "x";
  }

  updateDuration() {
    const base = Number(this.DOM.duration.value);
    this.DOM.durationVal.textContent = `${base * 0.8}-${base * 1.2}ms`;
  }

  updateAlgorithmInfo() {
    const info = {
      rr: "Distributes requests sequentially to each server in rotation.",
      lc: "Sends requests to the server with the fewest active connections.",
      wrr: "Accounts for server capacity using weighted distribution.",
      iphash: "Uses client IP hash for sticky session handling.",
    };

    this.DOM.algoInfo.textContent = info[this.DOM.algo.value] || info.rr;
  }

  getRate() {
    return Number(this.DOM.rate.value);
  }

  getSpeed() {
    return Number(this.DOM.speed.value);
  }

  renderServersList() {
    this.DOM.serversList.innerHTML = "";
    this.DOM.serverCount.textContent = `${this.servers.length} server${
      this.servers.length !== 1 ? "s" : ""
    }`;

    this.servers.forEach((server, index) => {
      const card = document.createElement("div");
      card.className = `server-card ${server.healthy ? "" : "failed"}`;

      card.innerHTML = `
                <div class="server-info">
                    <div class="server-name">${server.name}</div>
                    <div class="server-details">ID: ${server.id} | Weight: ${
        server.weight
      }</div>
                </div>
                <div class="server-stats">
                    <div class="server-active">${server.active}</div>
                    <div class="server-handled">${server.handled}</div>
                </div>
                <div class="server-controls">
                    <input type="number" class="control-input" value="${
                      server.weight
                    }" 
                           min="1" max="10" onchange="simulator.updateServerWeight(${index}, this.value)">
                    <input type="number" class="control-input" value="${
                      server.failureChance
                    }" 
                           min="0" max="100" onchange="simulator.updateServerFailureChance(${index}, this.value)">
                    <button class="toggle-btn" onclick="simulator.toggleServerHealth(${index})">
                        ${server.healthy ? "🛡" : "⚠"}
                    </button>
                    <button class="remove-btn" onclick="simulator.removeServer(${index})">✕</button>
                </div>
            `;

      this.DOM.serversList.appendChild(card);
    });
  }

  renderArena() {
    this.DOM.arena.innerHTML = "";

    this.servers.forEach((server) => {
      const box = document.createElement("div");
      box.className = `server-box ${server.healthy ? "" : "failed"}`;
      box.id = server.id;

      box.innerHTML = `
                <div class="server-header">
                    <div class="server-title">${server.name}</div>
                    <div class="server-weight">Weight: ${server.weight}</div>
                </div>
                <div class="server-metrics">
                    <span>Active: <strong>${server.active}</strong></span>
                    <span>Handled: <strong>${server.handled}</strong></span>
                </div>
                <div class="server-queue"></div>
            `;

      server.el = box;
      this.DOM.arena.appendChild(box);
    });
  }

  updateServerDisplay(server) {
    if (!server.el) return;

    const metrics = server.el.querySelector(".server-metrics");
    if (metrics) {
      metrics.innerHTML = `
                <span>Active: <strong>${server.active}</strong></span>
                <span>Handled: <strong>${server.handled}</strong></span>
            `;
    }
  }

  updateStats() {
    this.DOM.incomingCount.textContent = this.stats.incoming;
    this.DOM.processedCount.textContent = this.stats.processed;
    this.DOM.activeCount.textContent = this.stats.active;

    const successRate =
      this.stats.incoming > 0
        ? Math.round((1 - this.stats.failed / this.stats.incoming) * 100)
        : 100;
    this.DOM.successRate.textContent = `${successRate}%`;
  }

  updateMetrics() {
    this.DOM.metrics.innerHTML = "";

    const totalHandled = this.servers.reduce(
      (sum, server) => sum + server.handled,
      0
    );

    this.servers.forEach((server) => {
      const percentage =
        totalHandled > 0 ? (server.handled / totalHandled) * 100 : 0;

      const metric = document.createElement("div");
      metric.className = "metric-item";
      metric.innerHTML = `
                <div class="metric-header">
                    <span>${server.name}</span>
                    <span>${server.handled} (${Math.round(percentage)}%)</span>
                </div>
                <div class="metric-bar">
                    <div class="metric-fill" style="width: ${percentage}%"></div>
                </div>
            `;

      this.DOM.metrics.appendChild(metric);
    });
  }

  log(message, type = "info") {
    const entry = document.createElement("div");
    entry.className = "log-entry";

    const timestamp = new Date().toLocaleTimeString();
    const typeClass = `log-${type}`;

    entry.innerHTML = `
            <span class="log-time">[${timestamp}]</span>
            <span class="${typeClass}">${message}</span>
        `;

    this.DOM.log.insertBefore(entry, this.DOM.log.firstChild);

    // Limit log length
    while (this.DOM.log.children.length > 50) {
      this.DOM.log.removeChild(this.DOM.log.lastChild);
    }
  }

  clearLog() {
    this.DOM.log.innerHTML = "";
    this.log("Log cleared", "info");
  }

  showHelp() {
    this.DOM.helpModal.style.display = "flex";
  }

  hideHelp() {
    this.DOM.helpModal.style.display = "none";
  }

  exportData() {
    const data = {
      timestamp: new Date().toISOString(),
      stats: this.stats,
      servers: this.servers,
      configuration: {
        algorithm: this.DOM.algo.value,
        rate: this.getRate(),
        speed: this.getSpeed(),
        duration: Number(this.DOM.duration.value),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `load-balancer-simulation-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.log("Data exported successfully", "info");
  }

  handleKeyboard(event) {
    if (event.target.tagName === "INPUT") return;

    switch (event.key) {
      case " ":
        event.preventDefault();
        this.running ? this.pauseSimulation() : this.startSimulation();
        break;
      case "s":
      case "S":
        event.preventDefault();
        this.spawnRequest();
        break;
      case "r":
      case "R":
        event.preventDefault();
        this.resetSimulation();
        break;
      case "h":
      case "H":
        event.preventDefault();
        this.showHelp();
        break;
    }
  }
}

// Initialize the simulator when the page loads
let simulator;
document.addEventListener("DOMContentLoaded", () => {
  simulator = new LoadBalancerSimulator();
  simulator.loadPreset("balanced");
});
