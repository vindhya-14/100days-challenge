class ShardingReplicationDemo {
  constructor() {
    this.shards = [];
    this.dataItems = [];
    this.shardCount = 4;
    this.replicaCount = 2;
    this.nextDataId = 1;
    this.failedReplicas = new Set();

    this.initializeControls();
    this.renderShards();
    this.updateStats();
  }

  initializeControls() {
    // Shard count slider
    const shardCountSlider = document.getElementById("shard-count");
    const shardCountValue = document.getElementById("shard-count-value");

    shardCountSlider.addEventListener("input", (e) => {
      this.shardCount = parseInt(e.target.value);
      shardCountValue.textContent = this.shardCount;
      this.renderShards();
      this.updateStats();
    });

    // Replica count slider
    const replicaCountSlider = document.getElementById("replica-count");
    const replicaCountValue = document.getElementById("replica-count-value");

    replicaCountSlider.addEventListener("input", (e) => {
      this.replicaCount = parseInt(e.target.value);
      replicaCountValue.textContent = this.replicaCount;
      this.renderShards();
      this.updateStats();
    });

    // Add data button
    document.getElementById("add-data").addEventListener("click", () => {
      this.addSampleData();
    });

    // Simulate failure button
    document
      .getElementById("simulate-failure")
      .addEventListener("click", () => {
        this.simulateFailure();
      });

    // Reset button
    document.getElementById("reset").addEventListener("click", () => {
      this.reset();
    });
  }

  renderShards() {
    const container = document.getElementById("shards-container");
    container.innerHTML = "";

    this.shards = [];

    for (let i = 0; i < this.shardCount; i++) {
      const shard = document.createElement("div");
      shard.className = "shard";
      shard.innerHTML = `
                <div class="shard-header">
                    <div class="shard-title">Shard ${i + 1}</div>
                    <div class="shard-status">Active</div>
                </div>
                <div class="replicas" id="replicas-${i}">
                    ${this.renderReplicas(i)}
                </div>
            `;
      container.appendChild(shard);

      this.shards.push({
        id: i,
        element: shard,
        replicas: Array(this.replicaCount)
          .fill()
          .map((_, j) => ({
            id: j,
            data: [],
          })),
      });
    }

    // Redistribute existing data
    this.redistributeData();
  }

  renderReplicas(shardId) {
    let html = "";
    for (let i = 0; i < this.replicaCount; i++) {
      const replicaId = `${shardId}-${i}`;
      const isFailed = this.failedReplicas.has(replicaId);

      html += `
                <div class="replica ${
                  isFailed ? "failed" : ""
                }" id="replica-${replicaId}">
                    <div class="replica-header">
                        <span>Replica ${i + 1}</span>
                        <span>${isFailed ? "Failed" : "Active"}</span>
                    </div>
                    <div class="replica-data" id="replica-data-${replicaId}">
                        <!-- Data items will be inserted here -->
                    </div>
                </div>
            `;
    }
    return html;
  }

  addSampleData() {
    const dataCount = 5; // Add 5 data items at a time
    const newData = [];

    for (let i = 0; i < dataCount; i++) {
      const dataItem = {
        id: this.nextDataId++,
        value: `Data-${this.nextDataId}`,
        color: this.getRandomColor(),
      };
      newData.push(dataItem);
      this.dataItems.push(dataItem);
    }

    this.distributeData(newData);
    this.updateStats();
  }

  distributeData(dataItems) {
    dataItems.forEach((dataItem) => {
      // Determine which shard this data belongs to (simple hash-based sharding)
      const shardId = dataItem.id % this.shardCount;

      // Add to all replicas of the shard
      for (let i = 0; i < this.replicaCount; i++) {
        const replicaId = `${shardId}-${i}`;

        // Skip if replica is failed
        if (this.failedReplicas.has(replicaId)) continue;

        this.shards[shardId].replicas[i].data.push(dataItem);

        // Animate data flow
        this.animateDataFlow(dataItem, shardId, i);
      }
    });

    // Update UI after a short delay to allow animation to complete
    setTimeout(() => {
      this.updateReplicaDisplays();
    }, 800);
  }

  animateDataFlow(dataItem, shardId, replicaIndex) {
    const dataFlow = document.getElementById("data-flow");
    const packet = document.createElement("div");
    packet.className = "data-packet";
    packet.style.backgroundColor = dataItem.color;

    // Start from center top
    packet.style.left = "50%";
    packet.style.top = "10%";

    dataFlow.appendChild(packet);

    // Calculate target position (approximate position of the replica)
    const shardElement = document.querySelectorAll(".shard")[shardId];
    const replicaElement =
      shardElement.querySelectorAll(".replica")[replicaIndex];
    const shardRect = shardElement.getBoundingClientRect();
    const replicaRect = replicaElement.getBoundingClientRect();
    const containerRect = document
      .querySelector(".visualization")
      .getBoundingClientRect();

    const targetX =
      replicaRect.left + replicaRect.width / 2 - containerRect.left;
    const targetY =
      replicaRect.top + replicaRect.height / 2 - containerRect.top;

    // Animate to target
    packet.style.transition = "all 0.8s ease-in-out";
    packet.style.transform = `translate(${targetX - 50}px, ${targetY - 10}px)`;

    // Remove packet after animation
    setTimeout(() => {
      if (packet.parentNode) {
        packet.parentNode.removeChild(packet);
      }
    }, 1000);
  }

  updateReplicaDisplays() {
    this.shards.forEach((shard, shardId) => {
      shard.replicas.forEach((replica, replicaIndex) => {
        const replicaId = `${shardId}-${replicaIndex}`;
        const replicaDataElement = document.getElementById(
          `replica-data-${replicaId}`
        );

        if (replicaDataElement) {
          replicaDataElement.innerHTML = "";

          replica.data.forEach((dataItem) => {
            const dataElement = document.createElement("div");
            dataElement.className = "data-item";
            dataElement.textContent = dataItem.value;
            dataElement.style.backgroundColor = dataItem.color;
            replicaDataElement.appendChild(dataElement);
          });
        }
      });
    });
  }

  redistributeData() {
    // Clear all replica data
    this.shards.forEach((shard) => {
      shard.replicas.forEach((replica) => {
        replica.data = [];
      });
    });

    // Redistribute all data items
    this.distributeData([...this.dataItems]);
  }

  simulateFailure() {
    if (this.failedReplicas.size >= this.shardCount * this.replicaCount - 1) {
      alert(
        "Cannot fail all replicas! At least one replica per shard must remain active."
      );
      return;
    }

    let attempts = 0;
    let replicaId;

    // Find a replica that isn't already failed
    do {
      const shardId = Math.floor(Math.random() * this.shardCount);
      const replicaIndex = Math.floor(Math.random() * this.replicaCount);
      replicaId = `${shardId}-${replicaIndex}`;
      attempts++;

      // Prevent infinite loop
      if (attempts > 100) return;
    } while (this.failedReplicas.has(replicaId));

    // Mark replica as failed
    this.failedReplicas.add(replicaId);

    // Update UI
    const replicaElement = document.getElementById(`replica-${replicaId}`);
    if (replicaElement) {
      replicaElement.classList.add("failed");
      const statusElement = replicaElement.querySelector(
        ".replica-header span:last-child"
      );
      if (statusElement) {
        statusElement.textContent = "Failed";
      }
    }

    // Parse shardId and replicaIndex from replicaId
    const [shardId, replicaIndex] = replicaId.split("-").map(Number);

    // If this was the last active replica in the shard, mark shard as failed
    const activeReplicasInShard = this.shards[shardId].replicas.filter(
      (_, idx) => !this.failedReplicas.has(`${shardId}-${idx}`)
    );

    if (activeReplicasInShard.length === 0) {
      const shardElement = document.querySelectorAll(".shard")[shardId];
      const shardStatus = shardElement.querySelector(".shard-status");
      shardStatus.textContent = "Failed";
      shardStatus.classList.add("failed");
    }

    // Replicate data from active replicas to maintain consistency
    this.replicateFromActiveReplicas(shardId, replicaIndex);

    this.updateStats();
  }

  replicateFromActiveReplicas(failedShardId, failedReplicaIndex) {
    // Find an active replica in the same shard
    const activeReplicaIndex = this.shards[failedShardId].replicas.findIndex(
      (_, idx) => !this.failedReplicas.has(`${failedShardId}-${idx}`)
    );

    if (activeReplicaIndex !== -1) {
      // Copy data from active replica to all other active replicas in the shard
      const sourceData = [
        ...this.shards[failedShardId].replicas[activeReplicaIndex].data,
      ];

      this.shards[failedShardId].replicas.forEach((replica, idx) => {
        if (
          idx !== activeReplicaIndex &&
          !this.failedReplicas.has(`${failedShardId}-${idx}`)
        ) {
          replica.data = [...sourceData];
        }
      });

      this.updateReplicaDisplays();
    }
  }

  reset() {
    this.dataItems = [];
    this.nextDataId = 1;
    this.failedReplicas.clear();
    this.renderShards();
    this.updateStats();
  }

  updateStats() {
    document.getElementById("total-data").textContent = this.dataItems.length;
    document.getElementById("active-shards").textContent =
      this.shardCount -
      Array.from(this.failedReplicas).reduce((count, replicaId) => {
        const shardId = parseInt(replicaId.split("-")[0]);
        const replicaIndex = parseInt(replicaId.split("-")[1]);

        // Check if all replicas in this shard are failed
        const allReplicasFailed = this.shards[shardId].replicas.every(
          (_, idx) => this.failedReplicas.has(`${shardId}-${idx}`)
        );

        return count + (allReplicasFailed ? 1 : 0);
      }, 0);
    document.getElementById("failed-replicas").textContent =
      this.failedReplicas.size;
  }

  getRandomColor() {
    const colors = [
      "#3498db",
      "#2ecc71",
      "#e74c3c",
      "#f1c40f",
      "#9b59b6",
      "#1abc9c",
      "#d35400",
      "#34495e",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Initialize the demo when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new ShardingReplicationDemo();
});
