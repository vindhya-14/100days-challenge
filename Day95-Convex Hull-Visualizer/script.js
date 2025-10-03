// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Initialize state variables FIRST
let points = [];
let hull = [];
let currentStep = 0;
let algorithm = "jarvis";
let animationId = null;
let isPlaying = false;

// Algorithm state variables
let jarvisState = {
  currentHullIndex: 0,
  currentPoint: null,
  candidatePoint: null,
};
let grahamState = { stack: [], sortedPoints: [], currentIndex: 0 };
let quickhullState = { leftHull: [], rightHull: [], currentSet: [] };
let andrewState = { upperHull: [], lowerHull: [], currentIndex: 0 };

// Algorithm information
const algorithmInfo = {
  jarvis: {
    name: "Jarvis March",
    description:
      "The Jarvis March algorithm, also known as the Gift Wrapping algorithm, finds the convex hull by 'wrapping' around the points. It starts with the leftmost point and repeatedly finds the point that makes the smallest counterclockwise turn relative to the current point.",
    timeComplexity: "O(nh)",
    spaceComplexity: "O(h)",
    bestCase: "O(n)",
    worstCase: "O(n²)",
  },
  graham: {
    name: "Graham Scan",
    description:
      "The Graham Scan algorithm finds the convex hull by first selecting a pivot point (usually the lowest y-coordinate point), then sorting all other points by their polar angle relative to the pivot. It then iterates through the sorted points, maintaining a stack of points that form the convex hull so far.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestCase: "O(n log n)",
    worstCase: "O(n log n)",
  },
  quickhull: {
    name: "QuickHull",
    description:
      "The QuickHull algorithm is inspired by the QuickSort algorithm. It works by recursively dividing the point set into smaller subsets and finding the farthest points from lines to build the convex hull. It's efficient for many practical cases but has a worst-case time complexity of O(n²).",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestCase: "O(n log n)",
    worstCase: "O(n²)",
  },
  andrew: {
    name: "Andrew's Monotone Chain",
    description:
      "Andrew's algorithm is a variant of the Graham Scan that uses a monotone chain approach. It sorts the points by x-coordinate (and y-coordinate if ties exist) and then constructs the upper and lower hulls separately. It's efficient and avoids trigonometric calculations.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    bestCase: "O(n log n)",
    worstCase: "O(n log n)",
  },
};

// Set canvas dimensions
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  draw();
}

// Initialize everything after DOM is loaded
function init() {
  resizeCanvas();
  setupEventListeners();
  updateAlgorithmInfo();
  updateStats();
}

function setupEventListeners() {
  window.addEventListener("resize", resizeCanvas);

  document.querySelectorAll(".algorithm-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".algorithm-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      algorithm = this.dataset.algorithm;
      updateAlgorithmInfo();
      resetAlgorithm();
    });
  });

  document.getElementById("stepBtn").addEventListener("click", stepForward);
  document.getElementById("resetBtn").addEventListener("click", resetPoints);
  document
    .getElementById("randomBtn")
    .addEventListener("click", generateRandomPoints);
  document.getElementById("clearBtn").addEventListener("click", clearAll);

  document.getElementById("autoPlay").addEventListener("change", function () {
    if (this.checked) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });

  // Canvas interaction
  canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    points.push({ x, y });
    resetAlgorithm();
    draw();
    updateStats();
  });

  // Support for touch devices
  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      points.push({ x, y });
      resetAlgorithm();
      draw();
      updateStats();
    },
    { passive: false }
  );
}

// Algorithm implementations
function stepForward() {
  switch (algorithm) {
    case "jarvis":
      stepJarvisMarch();
      break;
    case "graham":
      stepGrahamScan();
      break;
    case "quickhull":
      stepQuickHull();
      break;
    case "andrew":
      stepAndrew();
      break;
  }

  currentStep++;
  draw();
  updateStats();
}

function stepJarvisMarch() {
  if (points.length < 3) {
    hull = [...points];
    return;
  }

  // Find the leftmost point
  if (jarvisState.currentPoint === null) {
    jarvisState.currentPoint = points.reduce(
      (leftmost, point) => (point.x < leftmost.x ? point : leftmost),
      points[0]
    );
    hull = [jarvisState.currentPoint];
    jarvisState.currentHullIndex = 0;
    return;
  }

  // Find next point in hull
  if (jarvisState.candidatePoint === null) {
    jarvisState.candidatePoint = points[0];
    if (jarvisState.candidatePoint === jarvisState.currentPoint) {
      jarvisState.candidatePoint = points[1];
    }
  }

  for (let i = 0; i < points.length; i++) {
    if (
      points[i] === jarvisState.currentPoint ||
      points[i] === jarvisState.candidatePoint
    ) {
      continue;
    }

    // Check if points[i] is more counterclockwise than candidate
    const orientation = getOrientation(
      jarvisState.currentPoint,
      jarvisState.candidatePoint,
      points[i]
    );

    if (
      orientation === 2 ||
      (orientation === 0 &&
        distance(jarvisState.currentPoint, points[i]) >
          distance(jarvisState.currentPoint, jarvisState.candidatePoint))
    ) {
      jarvisState.candidatePoint = points[i];
    }
  }

  jarvisState.currentPoint = jarvisState.candidatePoint;
  jarvisState.candidatePoint = null;

  // Check if we've completed the hull
  if (jarvisState.currentPoint === hull[0]) {
    hull.push(hull[0]); // Close the hull
    return;
  }

  hull.push(jarvisState.currentPoint);
}

function stepGrahamScan() {
  if (points.length < 3) {
    hull = [...points];
    return;
  }

  // Find the point with the lowest y-coordinate (and leftmost if tie)
  if (grahamState.sortedPoints.length === 0) {
    let pivot = points[0];
    for (let i = 1; i < points.length; i++) {
      if (
        points[i].y < pivot.y ||
        (points[i].y === pivot.y && points[i].x < pivot.x)
      ) {
        pivot = points[i];
      }
    }

    // Sort points by polar angle with pivot
    grahamState.sortedPoints = [...points].sort((a, b) => {
      if (a === pivot) return -1;
      if (b === pivot) return 1;

      const orientation = getOrientation(pivot, a, b);
      if (orientation === 0) {
        return distance(pivot, a) - distance(pivot, b);
      }
      return orientation === 2 ? -1 : 1;
    });

    grahamState.stack = [
      grahamState.sortedPoints[0],
      grahamState.sortedPoints[1],
    ];
    grahamState.currentIndex = 2;
    return;
  }

  if (grahamState.currentIndex >= grahamState.sortedPoints.length) {
    hull = [...grahamState.stack, grahamState.stack[0]]; // Close the hull
    return;
  }

  while (
    grahamState.stack.length >= 2 &&
    getOrientation(
      grahamState.stack[grahamState.stack.length - 2],
      grahamState.stack[grahamState.stack.length - 1],
      grahamState.sortedPoints[grahamState.currentIndex]
    ) !== 2
  ) {
    grahamState.stack.pop();
  }

  grahamState.stack.push(grahamState.sortedPoints[grahamState.currentIndex]);
  grahamState.currentIndex++;
}

function stepQuickHull() {
  // Simplified implementation for demonstration
  if (points.length < 3) {
    hull = [...points];
    return;
  }

  // Find leftmost and rightmost points
  if (
    quickhullState.leftHull.length === 0 &&
    quickhullState.rightHull.length === 0
  ) {
    let leftmost = points[0];
    let rightmost = points[0];

    for (let i = 1; i < points.length; i++) {
      if (points[i].x < leftmost.x) leftmost = points[i];
      if (points[i].x > rightmost.x) rightmost = points[i];
    }

    quickhullState.leftHull = [leftmost, rightmost];
    quickhullState.rightHull = [rightmost, leftmost];

    // Divide points into two sets
    quickhullState.currentSet = points.filter(
      (p) => getOrientation(leftmost, rightmost, p) === 2
    );

    return;
  }

  // Find the point with maximum distance from the line
  if (quickhullState.currentSet.length > 0) {
    let maxDist = -1;
    let farthestPoint = null;

    for (const point of quickhullState.currentSet) {
      const dist = distanceFromLine(
        quickhullState.leftHull[0],
        quickhullState.leftHull[1],
        point
      );

      if (dist > maxDist) {
        maxDist = dist;
        farthestPoint = point;
      }
    }

    if (farthestPoint) {
      // Add to hull and recursively process new triangles
      const index = quickhullState.leftHull.indexOf(quickhullState.leftHull[1]);
      quickhullState.leftHull.splice(index, 0, farthestPoint);

      // Remove the point from current set
      quickhullState.currentSet = quickhullState.currentSet.filter(
        (p) => p !== farthestPoint
      );
    }
  } else {
    // Complete the hull
    hull = [...quickhullState.leftHull, quickhullState.leftHull[0]];
  }
}

function stepAndrew() {
  if (points.length < 3) {
    hull = [...points];
    return;
  }

  // Sort points by x (and y if tie)
  if (andrewState.sortedPoints.length === 0) {
    andrewState.sortedPoints = [...points].sort((a, b) => {
      if (a.x !== b.x) return a.x - b.x;
      return a.y - b.y;
    });

    andrewState.upperHull = [];
    andrewState.lowerHull = [];
    andrewState.currentIndex = 0;
    return;
  }

  // Build upper hull
  if (andrewState.currentIndex < andrewState.sortedPoints.length) {
    while (
      andrewState.upperHull.length >= 2 &&
      getOrientation(
        andrewState.upperHull[andrewState.upperHull.length - 2],
        andrewState.upperHull[andrewState.upperHull.length - 1],
        andrewState.sortedPoints[andrewState.currentIndex]
      ) !== 2
    ) {
      andrewState.upperHull.pop();
    }
    andrewState.upperHull.push(
      andrewState.sortedPoints[andrewState.currentIndex]
    );
    andrewState.currentIndex++;
  }
  // Build lower hull
  else if (andrewState.currentIndex < andrewState.sortedPoints.length * 2) {
    const idx =
      andrewState.sortedPoints.length * 2 - andrewState.currentIndex - 1;

    while (
      andrewState.lowerHull.length >= 2 &&
      getOrientation(
        andrewState.lowerHull[andrewState.lowerHull.length - 2],
        andrewState.lowerHull[andrewState.lowerHull.length - 1],
        andrewState.sortedPoints[idx]
      ) !== 2
    ) {
      andrewState.lowerHull.pop();
    }
    andrewState.lowerHull.push(andrewState.sortedPoints[idx]);
    andrewState.currentIndex++;
  }
  // Combine hulls
  else {
    hull = [...andrewState.upperHull, ...andrewState.lowerHull.slice(1, -1)];
    if (hull.length > 0) {
      hull.push(hull[0]); // Close the hull
    }
  }
}

// Utility functions
function getOrientation(p, q, r) {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0; // Collinear
  return val > 0 ? 1 : 2; // Clockwise or Counterclockwise
}

function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function distanceFromLine(p1, p2, p) {
  return (
    Math.abs(
      (p2.y - p1.y) * p.x - (p2.x - p1.x) * p.y + p2.x * p1.y - p2.y * p1.x
    ) / distance(p1, p2)
  );
}

function resetAlgorithm() {
  currentStep = 0;
  hull = [];

  jarvisState = {
    currentHullIndex: 0,
    currentPoint: null,
    candidatePoint: null,
  };
  grahamState = { stack: [], sortedPoints: [], currentIndex: 0 };
  quickhullState = { leftHull: [], rightHull: [], currentSet: [] };
  andrewState = { upperHull: [], lowerHull: [], currentIndex: 0 };

  stopAutoPlay();
  updateStats();
}

function resetPoints() {
  resetAlgorithm();
  draw();
}

function clearAll() {
  points = [];
  resetAlgorithm();
  draw();
}

function generateRandomPoints() {
  points = [];
  const count = Math.floor(Math.random() * 15) + 10; // 10-25 points

  for (let i = 0; i < count; i++) {
    const padding = 40;
    points.push({
      x: Math.random() * (canvas.width - padding * 2) + padding,
      y: Math.random() * (canvas.height - padding * 2) + padding,
    });
  }

  resetAlgorithm();
  draw();
  updateStats();
}

function startAutoPlay() {
  if (isPlaying) return;
  isPlaying = true;

  function playStep() {
    if (!isPlaying) return;

    stepForward();

    if (hull.length > 0 && hull[0] === hull[hull.length - 1]) {
      stopAutoPlay();
      return;
    }

    animationId = setTimeout(playStep, 500);
  }

  playStep();
}

function stopAutoPlay() {
  isPlaying = false;
  if (animationId) {
    clearTimeout(animationId);
    animationId = null;
  }
  document.getElementById("autoPlay").checked = false;
}

function updateAlgorithmInfo() {
  const info = algorithmInfo[algorithm];
  document.getElementById("algorithmName").textContent = info.name;
  document.getElementById("algorithmInfo").textContent = info.description;

  document
    .querySelectorAll(".complexity-item .stat-value")
    .forEach((el, index) => {
      const values = [
        info.timeComplexity,
        info.spaceComplexity,
        info.bestCase,
        info.worstCase,
      ];
      el.textContent = values[index];
    });

  document.getElementById("timeComplexity").textContent = info.timeComplexity;
}

function updateStats() {
  document.getElementById("pointCount").textContent = points.length;
  document.getElementById("hullSize").textContent =
    hull.length > 0 ? hull.length - 1 : 0;
  document.getElementById("stepCount").textContent = currentStep;
}

// Drawing functions
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  drawGrid();

  // Draw points
  if (document.getElementById("showPoints").checked) {
    drawPoints();
  }

  // Draw algorithm steps
  if (document.getElementById("showSteps").checked) {
    drawAlgorithmSteps();
  }

  // Draw convex hull
  if (document.getElementById("showHull").checked && hull.length > 0) {
    drawHull();
  }
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;

  const gridSize = 50;

  // Vertical lines
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPoints() {
  // Check if points array exists and has elements
  if (!points || points.length === 0) return;

  for (const point of points) {
    ctx.fillStyle = "#4FC3F7";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#0277BD";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawAlgorithmSteps() {
  switch (algorithm) {
    case "jarvis":
      drawJarvisSteps();
      break;
    case "graham":
      drawGrahamSteps();
      break;
    case "quickhull":
      drawQuickHullSteps();
      break;
    case "andrew":
      drawAndrewSteps();
      break;
  }
}

function drawJarvisSteps() {
  if (jarvisState.currentPoint) {
    // Draw current point
    ctx.fillStyle = "#FF9800";
    ctx.beginPath();
    ctx.arc(
      jarvisState.currentPoint.x,
      jarvisState.currentPoint.y,
      8,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw candidate point
    if (jarvisState.candidatePoint) {
      ctx.fillStyle = "#FF5722";
      ctx.beginPath();
      ctx.arc(
        jarvisState.candidatePoint.x,
        jarvisState.candidatePoint.y,
        8,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw line from current to candidate
      ctx.strokeStyle = "rgba(255, 87, 34, 0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(jarvisState.currentPoint.x, jarvisState.currentPoint.y);
      ctx.lineTo(jarvisState.candidatePoint.x, jarvisState.candidatePoint.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw checking lines to other points
    if (jarvisState.candidatePoint && points) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      for (const point of points) {
        if (
          point !== jarvisState.currentPoint &&
          point !== jarvisState.candidatePoint
        ) {
          ctx.beginPath();
          ctx.moveTo(jarvisState.currentPoint.x, jarvisState.currentPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      }
    }
  }
}

function drawGrahamSteps() {
  if (grahamState.sortedPoints.length > 0) {
    // Draw pivot point
    ctx.fillStyle = "#FF9800";
    ctx.beginPath();
    ctx.arc(
      grahamState.sortedPoints[0].x,
      grahamState.sortedPoints[0].y,
      8,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw sorted points order
    for (let i = 1; i < grahamState.sortedPoints.length; i++) {
      ctx.fillStyle =
        i < grahamState.currentIndex ? "#4CAF50" : "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(
        grahamState.sortedPoints[i].x,
        grahamState.sortedPoints[i].y,
        6,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw number
      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        i,
        grahamState.sortedPoints[i].x,
        grahamState.sortedPoints[i].y - 15
      );
    }

    // Draw stack
    if (grahamState.stack.length > 1) {
      ctx.strokeStyle = "#4CAF50";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(grahamState.stack[0].x, grahamState.stack[0].y);

      for (let i = 1; i < grahamState.stack.length; i++) {
        ctx.lineTo(grahamState.stack[i].x, grahamState.stack[i].y);
      }
      ctx.stroke();
    }
  }
}

function drawQuickHullSteps() {
  if (quickhullState.leftHull.length > 0) {
    // Draw dividing line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(quickhullState.leftHull[0].x, quickhullState.leftHull[0].y);
    ctx.lineTo(quickhullState.leftHull[1].x, quickhullState.leftHull[1].y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw current hull
    if (quickhullState.leftHull.length > 2) {
      ctx.strokeStyle = "#4CAF50";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(quickhullState.leftHull[0].x, quickhullState.leftHull[0].y);

      for (let i = 1; i < quickhullState.leftHull.length; i++) {
        ctx.lineTo(quickhullState.leftHull[i].x, quickhullState.leftHull[i].y);
      }
      ctx.stroke();
    }
  }
}

function drawAndrewSteps() {
  // Draw upper hull
  if (andrewState.upperHull.length > 1) {
    ctx.strokeStyle = "#4CAF50";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(andrewState.upperHull[0].x, andrewState.upperHull[0].y);

    for (let i = 1; i < andrewState.upperHull.length; i++) {
      ctx.lineTo(andrewState.upperHull[i].x, andrewState.upperHull[i].y);
    }
    ctx.stroke();
  }

  // Draw lower hull
  if (andrewState.lowerHull.length > 1) {
    ctx.strokeStyle = "#2196F3";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(andrewState.lowerHull[0].x, andrewState.lowerHull[0].y);

    for (let i = 1; i < andrewState.lowerHull.length; i++) {
      ctx.lineTo(andrewState.lowerHull[i].x, andrewState.lowerHull[i].y);
    }
    ctx.stroke();
  }
}

function drawHull() {
  if (hull.length < 2) return;

  // Draw hull lines
  ctx.strokeStyle = "#E91E63";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(hull[0].x, hull[0].y);

  for (let i = 1; i < hull.length; i++) {
    ctx.lineTo(hull[i].x, hull[i].y);
  }
  ctx.stroke();

  // Draw hull points
  for (const point of hull) {
    ctx.fillStyle = "#E91E63";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#AD1457";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);
