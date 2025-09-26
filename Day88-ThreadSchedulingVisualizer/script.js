// DOM Elements
const jobTableBody = document.getElementById("jobTableBody");
const addJobBtn = document.getElementById("addJob");
const simulateBtn = document.getElementById("simulate");
const compareBtn = document.getElementById("compare");
const generateRandomBtn = document.getElementById("generateRandom");
const clearAllBtn = document.getElementById("clearAll");
const timeline = document.getElementById("timeline");
const timelineLegend = document.getElementById("timelineLegend");
const algorithmInfo = document.getElementById("algorithmInfo");
const performanceStats = document.getElementById("performanceStats");
const queueCountInput = document.getElementById("queueCount");

// State
let jobCount = 0;
const colors = [
  "#e74c3c",
  "#3498db",
  "#2ecc71",
  "#f1c40f",
  "#9b59b6",
  "#e67e22",
  "#1abc9c",
  "#34495e",
  "#d35400",
  "#c0392b",
  "#16a085",
  "#8e44ad",
];

// Algorithm descriptions
const algorithmDescriptions = {
  roundRobin: {
    title: "Round Robin Scheduling",
    description:
      "Round Robin is a preemptive algorithm where each process gets a small unit of CPU time (time quantum), usually 10-100 milliseconds. After this time has elapsed, the process is preempted and added to the end of the ready queue.",
  },
  priority: {
    title: "Priority Scheduling",
    description:
      "Priority Scheduling is a method of scheduling processes based on priority. In this algorithm, the scheduler selects the processes to work based on the priority. Processes with higher priority are executed first.",
  },
  multilevelQueue: {
    title: "Multilevel Queue Scheduling",
    description:
      "Multilevel Queue Scheduling partitions the ready queue into several separate queues. Processes are permanently assigned to one queue based on some property of the process, such as memory size, process priority, or process type.",
  },
  fcfs: {
    title: "First-Come, First-Served (FCFS)",
    description:
      "FCFS is the simplest scheduling algorithm. Processes are executed in the order they arrive in the ready queue. It's non-preemptive, meaning once a process starts executing, it runs until it completes.",
  },
  sjf: {
    title: "Shortest Job First (SJF)",
    description:
      "SJF selects the waiting process with the smallest execution time to execute next. It can be either preemptive (Shortest Remaining Time First) or non-preemptive.",
  },
};

// Initialize the application
function init() {
  // Add initial job
  addJob();

  // Set up event listeners
  addJobBtn.addEventListener("click", addJob);
  simulateBtn.addEventListener("click", runSimulation);
  compareBtn.addEventListener("click", compareAlgorithms);
  generateRandomBtn.addEventListener("click", generateRandomJobs);
  clearAllBtn.addEventListener("click", clearAllJobs);

  document
    .getElementById("algorithm")
    .addEventListener("change", updateAlgorithmInfo);
  queueCountInput.addEventListener("change", updateQueueOptions);

  // Update algorithm info when page loads
  updateAlgorithmInfo();

  console.log("Thread Scheduling Visualizer initialized successfully");
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", init);

// Functions
function addJob() {
  const queueCount = parseInt(queueCountInput.value);
  const row = document.createElement("tr");
  row.innerHTML = `
        <td><input type="text" placeholder="Job ${jobCount + 1}" value="J${
    jobCount + 1
  }"></td>
        <td><input type="number" min="1" value="${
          Math.floor(Math.random() * 10) + 1
        }"></td>
        <td><input type="number" min="0" value="0"></td>
        <td><input type="number" min="1" value="${
          Math.floor(Math.random() * 5) + 1
        }"></td>
        <td>
            <select>
                ${Array.from(
                  { length: queueCount },
                  (_, i) => `<option value="${i}">Queue ${i}</option>`
                ).join("")}
            </select>
        </td>
        <td><button class="remove btn-danger"><i class="fas fa-trash"></i></button></td>
    `;
  jobTableBody.appendChild(row);
  jobCount++;

  row.querySelector(".remove").addEventListener("click", () => {
    row.remove();
    jobCount--;
  });
}

function generateRandomJobs() {
  const count = Math.floor(Math.random() * 5) + 3; // 3-7 random jobs
  for (let i = 0; i < count; i++) {
    addJob();
  }
}

function clearAllJobs() {
  jobTableBody.innerHTML = "";
  jobCount = 0;
  addJob(); // Add one job back
}

function updateQueueOptions() {
  const queueCount = parseInt(queueCountInput.value);
  document.querySelectorAll("#jobTableBody tr").forEach((tr) => {
    const select = tr.querySelector("td:nth-child(5) select");
    if (select) {
      select.innerHTML = Array.from(
        { length: queueCount },
        (_, i) => `<option value="${i}">Queue ${i}</option>`
      ).join("");
    }
  });
}

function updateAlgorithmInfo() {
  const algorithm = document.getElementById("algorithm").value;
  const info = algorithmDescriptions[algorithm];
  if (algorithmInfo) {
    algorithmInfo.innerHTML = `
            <h3>About ${info.title}</h3>
            <p>${info.description}</p>
        `;
  }
}

function getJobsFromTable() {
  const jobs = [];
  document.querySelectorAll("#jobTableBody tr").forEach((tr, index) => {
    const inputs = tr.querySelectorAll("input, select");
    if (inputs.length >= 5) {
      jobs.push({
        name: inputs[0].value,
        burst: parseInt(inputs[1].value) || 1,
        arrival: parseInt(inputs[2].value) || 0,
        priority: parseInt(inputs[3].value) || 1,
        queue: parseInt(inputs[4].value) || 0,
        id: index,
      });
    }
  });
  return jobs;
}

function runSimulation() {
  const jobs = getJobsFromTable();
  if (jobs.length === 0) {
    alert("Please add at least one job to simulate.");
    return;
  }

  const algorithm = document.getElementById("algorithm").value;
  const timeQuantum =
    parseInt(document.getElementById("timeQuantum").value) || 2;

  let schedule = [];
  let stats = {};

  try {
    if (algorithm === "roundRobin") {
      schedule = roundRobin(jobs, timeQuantum);
    } else if (algorithm === "priority") {
      schedule = priorityScheduling(jobs);
    } else if (algorithm === "multilevelQueue") {
      schedule = multilevelQueue(jobs, timeQuantum);
    } else if (algorithm === "fcfs") {
      schedule = fcfs(jobs);
    } else if (algorithm === "sjf") {
      schedule = sjf(jobs);
    }

    stats = calculateStats(schedule, jobs);
    renderTimeline(schedule, jobs);
    renderStats(stats);
  } catch (error) {
    console.error("Error during simulation:", error);
    alert(
      "An error occurred during simulation. Please check the console for details."
    );
  }
}

function compareAlgorithms() {
  const jobs = getJobsFromTable();
  if (jobs.length === 0) {
    alert("Please add at least one job to compare.");
    return;
  }

  const timeQuantum =
    parseInt(document.getElementById("timeQuantum").value) || 2;
  const algorithms = ["fcfs", "sjf", "roundRobin", "priority"];
  const results = [];

  algorithms.forEach((algo) => {
    let schedule = [];
    try {
      if (algo === "roundRobin") {
        schedule = roundRobin(jobs, timeQuantum);
      } else if (algo === "priority") {
        schedule = priorityScheduling(jobs);
      } else if (algo === "fcfs") {
        schedule = fcfs(jobs);
      } else if (algo === "sjf") {
        schedule = sjf(jobs);
      }

      const stats = calculateStats(schedule, jobs);
      results.push({
        algorithm: algo,
        stats: stats,
      });
    } catch (error) {
      console.error(`Error in ${algo} algorithm:`, error);
    }
  });

  renderComparison(results);
}

// Scheduling Algorithms
function roundRobin(jobs, tq) {
  if (!jobs || jobs.length === 0) return [];

  const queue = JSON.parse(JSON.stringify(jobs)); // Deep copy
  const timeline = [];
  let time = 0;
  let completed = 0;
  const n = queue.length;
  const remainingTime = queue.map((job) => job.burst);

  while (completed !== n) {
    let found = false;
    for (let i = 0; i < n; i++) {
      const job = queue[i];
      if (remainingTime[i] > 0 && job.arrival <= time) {
        found = true;
        const execTime = Math.min(tq, remainingTime[i]);
        timeline.push({
          name: job.name,
          duration: execTime,
          start: time,
          end: time + execTime,
          jobId: job.id,
        });
        time += execTime;
        remainingTime[i] -= execTime;

        if (remainingTime[i] === 0) {
          completed++;
        }
      }
    }

    if (!found) {
      time++;
    }
  }
  return timeline;
}

function priorityScheduling(jobs) {
  if (!jobs || jobs.length === 0) return [];

  const queue = JSON.parse(JSON.stringify(jobs)); // Deep copy
  queue.sort((a, b) => a.priority - b.priority);
  let time = 0;
  const timeline = [];

  queue.forEach((job) => {
    timeline.push({
      name: job.name,
      duration: job.burst,
      start: time,
      end: time + job.burst,
      jobId: job.id,
    });
    time += job.burst;
  });

  return timeline;
}

function multilevelQueue(jobs, tq) {
  if (!jobs || jobs.length === 0) return [];

  const queueCount = parseInt(queueCountInput.value) || 2;
  const queues = Array.from({ length: queueCount }, () => []);

  // Assign jobs to queues
  jobs.forEach((job) => {
    if (job.queue < queueCount) {
      queues[job.queue].push({ ...job });
    } else {
      // Default to queue 0 if queue number is invalid
      queues[0].push({ ...job });
    }
  });

  const timeline = [];
  let time = 0;

  // Process queues in order (higher priority queues first)
  for (let i = 0; i < queueCount; i++) {
    if (queues[i].length > 0) {
      // Queue 0 uses Round Robin, others use FCFS
      if (i === 0) {
        const rrTimeline = roundRobin(queues[i], tq);
        rrTimeline.forEach((block) => {
          const newBlock = { ...block };
          newBlock.start += time;
          newBlock.end += time;
          timeline.push(newBlock);
        });
        if (timeline.length > 0) {
          time = timeline[timeline.length - 1].end;
        }
      } else {
        queues[i].forEach((job) => {
          timeline.push({
            name: job.name,
            duration: job.burst,
            start: time,
            end: time + job.burst,
            jobId: job.id,
          });
          time += job.burst;
        });
      }
    }
  }

  return timeline;
}

function fcfs(jobs) {
  if (!jobs || jobs.length === 0) return [];

  const queue = JSON.parse(JSON.stringify(jobs)); // Deep copy
  queue.sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  const timeline = [];

  queue.forEach((job) => {
    if (job.arrival > time) {
      time = job.arrival;
    }
    timeline.push({
      name: job.name,
      duration: job.burst,
      start: time,
      end: time + job.burst,
      jobId: job.id,
    });
    time += job.burst;
  });

  return timeline;
}

function sjf(jobs) {
  if (!jobs || jobs.length === 0) return [];

  const queue = JSON.parse(JSON.stringify(jobs)); // Deep copy
  queue.sort((a, b) => a.burst - b.burst);
  let time = 0;
  const timeline = [];

  queue.forEach((job) => {
    timeline.push({
      name: job.name,
      duration: job.burst,
      start: time,
      end: time + job.burst,
      jobId: job.id,
    });
    time += job.burst;
  });

  return timeline;
}

function calculateStats(schedule, jobs) {
  if (!schedule || schedule.length === 0 || !jobs || jobs.length === 0) {
    return {
      avgTurnaround: "0.00",
      avgWaiting: "0.00",
      avgResponse: "0.00",
      throughput: "0.000",
      totalTime: "0",
    };
  }

  // Calculate completion times
  const completionTimes = {};
  schedule.forEach((block) => {
    completionTimes[block.jobId] = block.end;
  });

  // Calculate turnaround and waiting times
  let totalTurnaround = 0;
  let totalWaiting = 0;
  let totalResponse = 0;

  jobs.forEach((job) => {
    const completionTime = completionTimes[job.id] || 0;
    const turnaround = completionTime - job.arrival;
    const waiting = turnaround - job.burst;
    const firstBlock = schedule.find((b) => b.jobId === job.id);
    const response = firstBlock ? firstBlock.start - job.arrival : 0;

    totalTurnaround += turnaround;
    totalWaiting += waiting;
    totalResponse += response;
  });

  const avgTurnaround = totalTurnaround / jobs.length;
  const avgWaiting = totalWaiting / jobs.length;
  const avgResponse = totalResponse / jobs.length;
  const lastBlock = schedule[schedule.length - 1];
  const throughput = lastBlock ? jobs.length / lastBlock.end : 0;

  return {
    avgTurnaround: avgTurnaround.toFixed(2),
    avgWaiting: avgWaiting.toFixed(2),
    avgResponse: avgResponse.toFixed(2),
    throughput: throughput.toFixed(3),
    totalTime: lastBlock ? lastBlock.end : 0,
  };
}

function renderTimeline(schedule, jobs) {
  if (!timeline) {
    console.error("Timeline element not found");
    return;
  }

  timeline.innerHTML = "";
  timeline.classList.remove("empty");

  // Create legend
  if (timelineLegend) {
    timelineLegend.innerHTML = "";
    const jobMap = {};
    jobs.forEach((job, index) => {
      jobMap[job.id] = job;

      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.innerHTML = `
                <div class="legend-color" style="background-color: ${
                  colors[index % colors.length]
                }"></div>
                <span>${job.name}</span>
            `;
      timelineLegend.appendChild(legendItem);
    });
  }

  // Create timeline blocks
  schedule.forEach((block) => {
    const job = jobs.find((j) => j.id === block.jobId);
    if (job) {
      const jobIndex = jobs.findIndex((j) => j.id === block.jobId);
      const div = document.createElement("div");
      div.className = "timeline-block";
      div.style.width = `${block.duration * 40}px`;
      div.style.backgroundColor = colors[jobIndex % colors.length];
      div.textContent = job.name;
      div.setAttribute("data-duration", `${block.duration}`);
      div.title = `${job.name}: ${block.duration} time units (${block.start}-${block.end})`;
      timeline.appendChild(div);
    }
  });
}

function renderStats(stats) {
  if (!performanceStats) return;

  performanceStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.avgTurnaround}</div>
            <div class="stat-label">Avg Turnaround Time</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.avgWaiting}</div>
            <div class="stat-label">Avg Waiting Time</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.avgResponse}</div>
            <div class="stat-label">Avg Response Time</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.throughput}</div>
            <div class="stat-label">Throughput (jobs/time unit)</div>
        </div>
    `;
}

function renderComparison(results) {
  if (!timeline || !performanceStats) return;

  timeline.innerHTML = "<h3>Algorithm Comparison</h3>";
  timeline.classList.remove("empty");

  performanceStats.innerHTML = "";

  results.forEach((result) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
            <h4>${algorithmDescriptions[result.algorithm].title}</h4>
            <div class="stat-value">${result.stats.avgTurnaround}</div>
            <div class="stat-label">Avg Turnaround Time</div>
            <div class="stat-value">${result.stats.avgWaiting}</div>
            <div class="stat-label">Avg Waiting Time</div>
            <div class="stat-value">${result.stats.throughput}</div>
            <div class="stat-label">Throughput</div>
        `;
    performanceStats.appendChild(card);
  });
}
