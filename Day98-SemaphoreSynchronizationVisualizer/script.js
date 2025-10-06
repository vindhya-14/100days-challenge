// script.js
document.addEventListener("DOMContentLoaded", function () {
  // DOM elements
  const processCountInput = document.getElementById("processCount");
  const semaphoreValueInput = document.getElementById("semaphoreValue");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const semaphoreDisplay = document.getElementById("semaphoreDisplay");
  const criticalSection = document.getElementById("criticalSection");
  const waitingQueue = document.getElementById("waitingQueue");

  // Simulation variables
  let semaphoreValue = 1;
  let processes = [];
  let waitingProcesses = [];
  let activeProcess = null;
  let simulationInterval;
  let isRunning = false;

  // Initialize the visualization
  initializeProcesses();

  // Event listeners
  startBtn.addEventListener("click", startSimulation);
  resetBtn.addEventListener("click", resetSimulation);
  processCountInput.addEventListener("change", updateProcessCount);
  semaphoreValueInput.addEventListener("change", updateSemaphoreValue);

  function initializeProcesses() {
    const processCount = parseInt(processCountInput.value);
    const processContainer = document.querySelector(".process-container");

    // Clear existing processes
    processContainer.innerHTML = "";
    processes = [];

    // Create new processes
    for (let i = 0; i < processCount; i++) {
      const process = document.createElement("div");
      process.className = "process waiting";
      process.id = `process${i}`;

      process.innerHTML = `
                <div class="process-id">P${i}</div>
                <div class="process-state">Waiting</div>
            `;

      processContainer.appendChild(process);
      processes.push({
        id: i,
        element: process,
        state: "waiting",
      });
    }

    updateSemaphoreDisplay();
    updateCriticalSection();
    updateWaitingQueue();
  }

  function updateProcessCount() {
    if (!isRunning) {
      initializeProcesses();
    }
  }

  function updateSemaphoreValue() {
    if (!isRunning) {
      semaphoreValue = parseInt(semaphoreValueInput.value);
      updateSemaphoreDisplay();
    }
  }

  function updateSemaphoreDisplay() {
    semaphoreDisplay.textContent = semaphoreValue;

    // Visual feedback for semaphore value
    if (semaphoreValue <= 0) {
      semaphoreDisplay.style.color = "#ff7e5f";
      semaphoreDisplay.style.textShadow = "0 0 10px rgba(255, 126, 95, 0.7)";
    } else {
      semaphoreDisplay.style.color = "#4facfe";
      semaphoreDisplay.style.textShadow = "0 0 10px rgba(79, 172, 254, 0.7)";
    }
  }

  function updateCriticalSection() {
    if (activeProcess !== null) {
      criticalSection.textContent = `P${activeProcess.id}`;
      criticalSection.style.color = "#ff7e5f";
    } else {
      criticalSection.textContent = "Empty";
      criticalSection.style.color = "#fff";
    }
  }

  function updateWaitingQueue() {
    if (waitingProcesses.length > 0) {
      waitingQueue.innerHTML = "";
      waitingProcesses.forEach((process) => {
        const processElement = document.createElement("div");
        processElement.className = "queued-process";
        processElement.textContent = `P${process.id}`;
        waitingQueue.appendChild(processElement);
      });
    } else {
      waitingQueue.textContent = "Empty";
    }
  }

  function startSimulation() {
    if (isRunning) return;

    isRunning = true;
    startBtn.disabled = true;

    // Reset any active process
    if (activeProcess) {
      activeProcess.state = "waiting";
      activeProcess.element.className = "process waiting";
      activeProcess.element.querySelector(".process-state").textContent =
        "Waiting";
      activeProcess = null;
    }

    // Reset waiting queue
    waitingProcesses = [];

    // Start the simulation
    simulationInterval = setInterval(simulateProcess, 1500);
  }

  function simulateProcess() {
    // If there's an active process, it might finish and release the semaphore
    if (activeProcess) {
      // Process finishes with some probability
      if (Math.random() < 0.4) {
        // Signal operation - release the semaphore
        semaphoreValue++;
        updateSemaphoreDisplay();

        // Update process state
        activeProcess.state = "waiting";
        activeProcess.element.className = "process waiting";
        activeProcess.element.querySelector(".process-state").textContent =
          "Waiting";

        // If there are waiting processes, allow one to enter
        if (waitingProcesses.length > 0) {
          const nextProcess = waitingProcesses.shift();
          nextProcess.state = "active";
          nextProcess.element.className = "process active";
          nextProcess.element.querySelector(".process-state").textContent =
            "Active";
          activeProcess = nextProcess;

          // Wait operation - decrement semaphore
          semaphoreValue--;
          updateSemaphoreDisplay();
        } else {
          activeProcess = null;
        }

        updateCriticalSection();
        updateWaitingQueue();
        return;
      }
    }

    // Try to start a new process if none is active
    if (!activeProcess) {
      // Find a waiting process
      const waitingProcess = processes.find((p) => p.state === "waiting");

      if (waitingProcess) {
        // Wait operation - try to decrement semaphore
        if (semaphoreValue > 0) {
          semaphoreValue--;
          updateSemaphoreDisplay();

          // Process enters critical section
          waitingProcess.state = "critical";
          waitingProcess.element.className = "process critical";
          waitingProcess.element.querySelector(".process-state").textContent =
            "In Critical Section";
          activeProcess = waitingProcess;

          updateCriticalSection();
        } else {
          // Process added to waiting queue
          waitingProcess.state = "waiting";
          waitingProcess.element.className = "process waiting";
          waitingProcess.element.querySelector(".process-state").textContent =
            "Waiting in Queue";
          waitingProcesses.push(waitingProcess);

          updateWaitingQueue();
        }
      }
    }
  }

  function resetSimulation() {
    clearInterval(simulationInterval);
    isRunning = false;
    startBtn.disabled = false;

    // Reset semaphore
    semaphoreValue = parseInt(semaphoreValueInput.value);
    updateSemaphoreDisplay();

    // Reset all processes
    processes.forEach((process) => {
      process.state = "waiting";
      process.element.className = "process waiting";
      process.element.querySelector(".process-state").textContent = "Waiting";
    });

    // Clear active process and waiting queue
    activeProcess = null;
    waitingProcesses = [];

    updateCriticalSection();
    updateWaitingQueue();
  }

  // Initialize the display
  updateSemaphoreDisplay();
  updateCriticalSection();
  updateWaitingQueue();
});
