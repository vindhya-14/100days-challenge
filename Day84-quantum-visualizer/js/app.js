// Main Application Controller
class QuantumVisualizer {
  constructor() {
    this.quantumState = new QuantumState(1, 0, 0, 0);
    this.blochSphere = new BlochSphere("blochSphere");
    this.measurementResults = { 0: 0, 1: 0 };
    this.measurementHistory = [];

    this.initializeEventListeners();
    this.updateDisplay();
  }

  initializeEventListeners() {
    // Amplitude inputs
    document
      .getElementById("amp0-real")
      .addEventListener("input", () => this.updateStateFromInputs());
    document
      .getElementById("amp0-imag")
      .addEventListener("input", () => this.updateStateFromInputs());
    document
      .getElementById("amp1-real")
      .addEventListener("input", () => this.updateStateFromInputs());
    document
      .getElementById("amp1-imag")
      .addEventListener("input", () => this.updateStateFromInputs());

    // Normalize button
    document.getElementById("normalizeBtn").addEventListener("click", () => {
      this.quantumState.normalize();
      this.updateInputsFromState();
      this.updateDisplay();
      this.showNotification("State normalized");
    });

    // Quantum gates
    document.querySelectorAll(".gate-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const gate = e.target.getAttribute("data-gate");
        this.applyGate(gate);
        this.showNotification(`${gate} gate applied`);
      });
    });

    // Rotation gates
    document.getElementById("applyRotation").addEventListener("click", () => {
      const rx = parseFloat(document.getElementById("rxRange").value);
      const ry = parseFloat(document.getElementById("ryRange").value);
      const rz = parseFloat(document.getElementById("rzRange").value);

      this.quantumState.applyRotation(rx, ry, rz);
      this.updateDisplay();
      this.showNotification(
        `Rotation applied: Rx(${rx.toFixed(2)}), Ry(${ry.toFixed(
          2
        )}), Rz(${rz.toFixed(2)})`
      );
    });

    // Update rotation values in real-time
    document.getElementById("rxRange").addEventListener("input", (e) => {
      document.getElementById("rxValue").textContent = parseFloat(
        e.target.value
      ).toFixed(2);
    });

    document.getElementById("ryRange").addEventListener("input", (e) => {
      document.getElementById("ryValue").textContent = parseFloat(
        e.target.value
      ).toFixed(2);
    });

    document.getElementById("rzRange").addEventListener("input", (e) => {
      document.getElementById("rzValue").textContent = parseFloat(
        e.target.value
      ).toFixed(2);
    });

    // Measurement buttons
    document.getElementById("measureBtn").addEventListener("click", () => {
      const result = this.measureOnce();
      this.showNotification(`Measurement result: |${result}⟩`);
    });

    document.getElementById("measureManyBtn").addEventListener("click", () => {
      this.measureMany(1000);
      this.showNotification("Measured 1000 times");
    });

    document.getElementById("undoBtn").addEventListener("click", () => {
      if (this.quantumState.undo()) {
        this.updateInputsFromState();
        this.updateDisplay();
        this.showNotification("Undo successful");
      } else {
        this.showNotification("No more states to undo", "warning");
      }
    });

    // Add pulse animation to buttons
    this.addButtonAnimations();
  }

  addButtonAnimations() {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        this.classList.add("pulse");
        setTimeout(() => {
          this.classList.remove("pulse");
        }, 500);
      });
    });
  }

  updateStateFromInputs() {
    const alphaReal =
      parseFloat(document.getElementById("amp0-real").value) || 0;
    const alphaImag =
      parseFloat(document.getElementById("amp0-imag").value) || 0;
    const betaReal =
      parseFloat(document.getElementById("amp1-real").value) || 0;
    const betaImag =
      parseFloat(document.getElementById("amp1-imag").value) || 0;

    this.quantumState.alpha = { real: alphaReal, imag: alphaImag };
    this.quantumState.beta = { real: betaReal, imag: betaImag };
    this.quantumState.saveState();
    this.updateDisplay();
  }

  updateInputsFromState() {
    document.getElementById("amp0-real").value =
      this.quantumState.alpha.real.toFixed(4);
    document.getElementById("amp0-imag").value =
      this.quantumState.alpha.imag.toFixed(4);
    document.getElementById("amp1-real").value =
      this.quantumState.beta.real.toFixed(4);
    document.getElementById("amp1-imag").value =
      this.quantumState.beta.imag.toFixed(4);
  }

  applyGate(gate) {
    this.quantumState.applyGate(gate);
    this.updateInputsFromState();
    this.updateDisplay();
  }

  measureOnce() {
    const result = this.quantumState.measure();
    this.measurementHistory.push(result);
    this.updateInputsFromState();
    this.updateDisplay();

    // Show measurement result
    const resultElement = document.getElementById("measurementResult");
    resultElement.textContent = `Measurement result: |${result}⟩`;
    resultElement.style.display = "block";

    setTimeout(() => {
      resultElement.style.display = "none";
    }, 3000);

    return result;
  }

  measureMany(count) {
    // Reset measurement results
    this.measurementResults = { 0: 0, 1: 0 };

    // Store current state to restore after measurements
    const originalState = {
      alpha: { ...this.quantumState.alpha },
      beta: { ...this.quantumState.beta },
    };

    // Perform multiple measurements
    for (let i = 0; i < count; i++) {
      // Reset to original state for each measurement
      this.quantumState.alpha = { ...originalState.alpha };
      this.quantumState.beta = { ...originalState.beta };

      const result = this.quantumState.measure();
      this.measurementResults[result.toString()]++;
    }

    // Restore original state
    this.quantumState.alpha = { ...originalState.alpha };
    this.quantumState.beta = { ...originalState.beta };
    this.updateInputsFromState();
    this.updateHistogram();
    this.updateDisplay();
  }

  updateDisplay() {
    // Update probabilities
    const probabilities = this.quantumState.getProbabilities();
    document.getElementById("prob0").textContent =
      probabilities.prob0.toFixed(4);
    document.getElementById("prob1").textContent =
      probabilities.prob1.toFixed(4);

    // Update Bloch sphere
    this.blochSphere.updateStateVector(this.quantumState);

    // Update histogram if we have measurement data
    if (this.measurementResults["0"] > 0 || this.measurementResults["1"] > 0) {
      this.updateHistogram();
    }

    // Color code probabilities based on values
    this.colorCodeProbabilities();
  }

  updateHistogram() {
    const canvas = document.getElementById("histogram");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const total = this.measurementResults["0"] + this.measurementResults["1"];
    if (total === 0) return;

    const prob0 = this.measurementResults["0"] / total;
    const prob1 = this.measurementResults["1"] / total;

    const barWidth = width / 2 - 20;

    // Draw |0⟩ bar
    ctx.fillStyle = "#06d6a0";
    const bar0Height = prob0 * (height - 40);
    ctx.fillRect(30, height - bar0Height - 20, barWidth, bar0Height);

    // Draw |1⟩ bar
    ctx.fillStyle = "#ef476f";
    const bar1Height = prob1 * (height - 40);
    ctx.fillRect(
      width / 2 + 10,
      height - bar1Height - 20,
      barWidth,
      bar1Height
    );

    // Draw labels
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("|0⟩", 30 + barWidth / 2, height - 5);
    ctx.fillText("|1⟩", width / 2 + 10 + barWidth / 2, height - 5);

    // Draw values
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "bold 16px Arial";
    ctx.fillText(
      (prob0 * 100).toFixed(1) + "%",
      30 + barWidth / 2,
      height - bar0Height - 30
    );
    ctx.fillText(
      (prob1 * 100).toFixed(1) + "%",
      width / 2 + 10 + barWidth / 2,
      height - bar1Height - 30
    );

    // Draw title
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px Arial";
    ctx.fillText(`Measurement Results (${total} trials)`, width / 2, 15);
  }

  colorCodeProbabilities() {
    const prob0Element = document.getElementById("prob0");
    const prob1Element = document.getElementById("prob1");

    const prob0 = parseFloat(prob0Element.textContent);
    const prob1 = parseFloat(prob1Element.textContent);

    // Reset colors
    prob0Element.style.color = "#06d6a0";
    prob1Element.style.color = "#ef476f";

    // Highlight dominant probability
    if (prob0 > prob1) {
      prob0Element.style.fontSize = "1.7rem";
      prob1Element.style.fontSize = "1.3rem";
    } else if (prob1 > prob0) {
      prob1Element.style.fontSize = "1.7rem";
      prob0Element.style.fontSize = "1.3rem";
    } else {
      prob0Element.style.fontSize = "1.5rem";
      prob1Element.style.fontSize = "1.5rem";
    }
  }

  showNotification(message, type = "success") {
    // Remove existing notification
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create new notification
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "warning"
                ? "linear-gradient(135deg, #f59e0b, #e58e0b)"
                : "linear-gradient(135deg, #06d6a0, #05c293)"
            };
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transform: translateX(150%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

    // Close button styles
    const closeBtn = notification.querySelector(".notification-close");
    closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 10);

    // Close button event
    closeBtn.addEventListener("click", () => {
      notification.style.transform = "translateX(150%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = "translateX(150%)";
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 3000);
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const visualizer = new QuantumVisualizer();

  // Add some helpful tips
  console.log(`
    🌌 Quantum Computing Visualizer Tips:
    • Drag the Bloch sphere to rotate it
    • Scroll to zoom in/out on the sphere
    • Use the Normalize button to ensure your state is valid
    • Try applying different gates to see how they transform the state
    • Use the rotation gates for fine-grained control
    • Measure multiple times to see statistical results
    `);

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      document.getElementById("undoBtn").click();
    }

    // Space bar to normalize
    if (e.key === " " && e.target.tagName !== "INPUT") {
      e.preventDefault();
      document.getElementById("normalizeBtn").click();
    }
  });
});

// Add CSS for notifications
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .notification {
        animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(150%);
        }
        to {
            transform: translateX(0);
        }
    }
    
    .notification.success {
        background: linear-gradient(135deg, #06d6a0, #05c293);
    }
    
    .notification.warning {
        background: linear-gradient(135deg, #f59e0b, #e58e0b);
    }
    
    .notification-close:hover {
        opacity: 0.8;
        transform: scale(1.1);
    }
`;
document.head.appendChild(notificationStyles);
