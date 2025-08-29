import { useState, useEffect } from "react";

// Enhanced FCFS algorithm
export function fcfs(requests, head) {
  let order = [head, ...requests];
  let total = 0;
  for (let i = 0; i < order.length - 1; i++) {
    total += Math.abs(order[i + 1] - order[i]);
  }
  return { order, total };
}

// Enhanced SSTF algorithm
export function sstf(requests, head) {
  let arr = [...requests];
  let order = [head];
  let total = 0;
  let current = head;

  while (arr.length) {
    let nearest = arr.reduce((prev, curr) =>
      Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
    );
    total += Math.abs(nearest - current);
    current = nearest;
    order.push(nearest);
    arr.splice(arr.indexOf(nearest), 1);
  }
  return { order, total };
}

// Enhanced SCAN algorithm with direction support
export function scan(requests, head, directionRight = true, diskSize = 200) {
  let left = requests.filter((r) => r < head).sort((a, b) => a - b);
  let right = requests.filter((r) => r > head).sort((a, b) => a - b);
  let order = [head];
  let total = 0;
  let current = head;

  if (directionRight) {
    // Moving right first
    for (let r of right) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    if (right.length > 0) {
      // Go to the end if there are requests on the right
      total += Math.abs(diskSize - 1 - current);
      current = diskSize - 1;
      order.push(current);
    }
    // Then move left
    for (let r of left.reverse()) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
  } else {
    // Moving left first
    for (let r of left.reverse()) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    if (left.length > 0) {
      // Go to the beginning if there are requests on the left
      total += Math.abs(0 - current);
      current = 0;
      order.push(current);
    }
    // Then move right
    for (let r of right) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
  }
  return { order, total };
}

// Enhanced C-SCAN algorithm
export function cscan(requests, head, directionRight = true, diskSize = 200) {
  let left = requests.filter((r) => r < head).sort((a, b) => a - b);
  let right = requests.filter((r) => r > head).sort((a, b) => a - b);
  let order = [head];
  let total = 0;
  let current = head;

  if (directionRight) {
    // Moving right to the end
    for (let r of right) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    if (right.length > 0 || left.length > 0) {
      // Go to the end and then wrap around to beginning
      total += Math.abs(diskSize - 1 - current);
      current = 0;
      order.push(0);
      // Service requests from the beginning
      for (let r of left) {
        total += Math.abs(r - current);
        current = r;
        order.push(r);
      }
    }
  } else {
    // Moving left to the beginning
    for (let r of left.reverse()) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    if (left.length > 0 || right.length > 0) {
      // Go to the beginning and then wrap around to end
      total += Math.abs(0 - current);
      current = diskSize - 1;
      order.push(diskSize - 1);
      // Service requests from the end
      for (let r of right.reverse()) {
        total += Math.abs(r - current);
        current = r;
        order.push(r);
      }
    }
  }
  return { order, total };
}

// LOOK algorithm implementation
export function look(requests, head, directionRight = true) {
  let left = requests.filter((r) => r < head).sort((a, b) => a - b);
  let right = requests.filter((r) => r > head).sort((a, b) => a - b);
  let order = [head];
  let total = 0;
  let current = head;

  if (directionRight) {
    // Moving right to the highest request
    for (let r of right) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    // Then moving left to the lowest request
    for (let r of left.reverse()) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
  } else {
    // Moving left to the lowest request
    for (let r of left.reverse()) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    // Then moving right to the highest request
    for (let r of right) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
  }
  return { order, total };
}

// C-LOOK algorithm implementation
export function clook(requests, head, directionRight = true) {
  let left = requests.filter((r) => r < head).sort((a, b) => a - b);
  let right = requests.filter((r) => r > head).sort((a, b) => a - b);
  let order = [head];
  let total = 0;
  let current = head;

  if (directionRight) {
    // Moving right to the highest request
    for (let r of right) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    // Then jump to the lowest request and continue
    if (left.length > 0) {
      total += Math.abs(current - left[0]);
      current = left[0];
      order.push(current);
      // Service remaining requests
      for (let i = 1; i < left.length; i++) {
        total += Math.abs(left[i] - current);
        current = left[i];
        order.push(current);
      }
    }
  } else {
    // Moving left to the lowest request
    for (let r of left.reverse()) {
      total += Math.abs(r - current);
      current = r;
      order.push(r);
    }
    // Then jump to the highest request and continue
    if (right.length > 0) {
      total += Math.abs(current - right[right.length - 1]);
      current = right[right.length - 1];
      order.push(current);
      // Service remaining requests
      for (let i = right.length - 2; i >= 0; i--) {
        total += Math.abs(right[i] - current);
        current = right[i];
        order.push(current);
      }
    }
  }
  return { order, total };
}

const DiskSimulator = () => {
  const [sequence, setSequence] = useState("82,170,43,140,24,16,190");
  const [head, setHead] = useState(50);
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [direction, setDirection] = useState("right");
  const [diskSize, setDiskSize] = useState(200);
  const [result, setResult] = useState(null);
  const [animation, setAnimation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(head);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [speed, setSpeed] = useState(1);

  // Validate and format the sequence input
  const handleSequenceChange = (e) => {
    const value = e.target.value.replace(/[^0-9,]/g, "");
    setSequence(value);
  };

  // Run the simulation
  const runSimulation = () => {
    const requests = sequence
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0 && x <= diskSize);

    if (requests.length === 0) {
      alert("Please enter valid requests between 0 and " + diskSize);
      return;
    }

    let output;
    const dir = direction === "right";

    switch (algorithm) {
      case "FCFS":
        output = fcfs(requests, head);
        break;
      case "SSTF":
        output = sstf(requests, head);
        break;
      case "SCAN":
        output = scan(requests, head, dir, diskSize);
        break;
      case "C-SCAN":
        output = cscan(requests, head, dir, diskSize);
        break;
      case "LOOK":
        output = look(requests, head, dir);
        break;
      case "C-LOOK":
        output = clook(requests, head, dir);
        break;
      default:
        output = { order: [], total: 0 };
    }
    setResult(output);

    // Run comparison of all algorithms
    compareAlgorithms(requests);

    // Start animation if enabled
    if (animation) {
      setCompletedRequests([]);
      animateDiskMovement(output.order);
    }
  };

  // Compare all algorithms
  const compareAlgorithms = (requests) => {
    const dir = direction === "right";
    const algorithms = {
      FCFS: fcfs(requests, head),
      SSTF: sstf(requests, head),
      SCAN: scan(requests, head, dir, diskSize),
      "C-SCAN": cscan(requests, head, dir, diskSize),
      LOOK: look(requests, head, dir),
      "C-LOOK": clook(requests, head, dir),
    };

    setComparisonResults(algorithms);
  };

  // Animate disk head movement
  const animateDiskMovement = (order) => {
    let currentIndex = 0;
    setCurrentPosition(head);

    const interval = setInterval(() => {
      if (currentIndex < order.length) {
        setCurrentPosition(order[currentIndex]);
        setCompletedRequests((prev) => [...prev, order[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1000 / speed);
  };

  // Generate random requests
  const generateRandomRequests = () => {
    const count = Math.floor(Math.random() * 10) + 5; // 5-14 requests
    const requests = [];
    for (let i = 0; i < count; i++) {
      requests.push(Math.floor(Math.random() * diskSize));
    }
    setSequence(requests.join(","));
  };

  // Visualize disk track
  const DiskVisualization = () => {
    if (!result) return null;

    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Disk Visualization</h2>
        <div className="relative bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>0</span>
            <span>{diskSize}</span>
          </div>
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 h-full bg-blue-500 rounded-full z-10"
              style={{
                left: `${(currentPosition / diskSize) * 100}%`,
                width: "4px",
                transform: "translateX(-2px)",
              }}
            ></div>

            {result.order.map((pos, index) => (
              <div
                key={index}
                className={`absolute top-0 w-3 h-3 rounded-full ${
                  completedRequests.includes(pos)
                    ? "bg-green-500"
                    : "bg-red-500"
                } z-20`}
                style={{
                  left: `${(pos / diskSize) * 100}%`,
                  transform: "translateX(-1.5px)",
                  top: "10px",
                }}
                title={`Track ${pos}`}
              ></div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4 flex-wrap">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Head</span>
          </div>
        </div>
      </div>
    );
  };

  // Comparison chart for algorithms
  const AlgorithmComparison = () => {
    if (!comparisonResults) return null;

    const maxMovement = Math.max(
      ...Object.values(comparisonResults).map((r) => r.total)
    );

    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Algorithm Comparison</h2>
        <div className="space-y-3">
          {Object.entries(comparisonResults).map(([algo, result]) => (
            <div key={algo} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-medium ${
                    algo === algorithm ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {algo}
                  {algo === algorithm && " (selected)"}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {result.total} movements
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(result.total / maxMovement) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Reset simulation
  const resetSimulation = () => {
    setResult(null);
    setComparisonResults(null);
    setCompletedRequests([]);
    setCurrentPosition(head);
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🚀 Disk Scheduling Simulator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block font-medium mb-2 text-blue-800">
            Request Sequence
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={sequence}
              onChange={handleSequenceChange}
              className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. 82,170,43,140,24"
            />
            <button
              onClick={generateRandomRequests}
              className="bg-blue-100 text-blue-700 px-3 rounded-lg hover:bg-blue-200 transition"
              title="Generate random requests"
            >
              🎲
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Enter numbers between 0 and {diskSize}, separated by commas
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block font-medium mb-2 text-blue-800">
            Initial Head Position
          </label>
          <input
            type="range"
            min="0"
            max={diskSize}
            value={head}
            onChange={(e) => setHead(parseInt(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between">
            <span>0</span>
            <span className="font-bold">{head}</span>
            <span>{diskSize}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block font-medium mb-2 text-blue-800">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>FCFS</option>
            <option>SSTF</option>
            <option>SCAN</option>
            <option>C-SCAN</option>
            <option>LOOK</option>
            <option>C-LOOK</option>
          </select>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block font-medium mb-2 text-blue-800">
            Direction
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="right"
                checked={direction === "right"}
                onChange={() => setDirection("right")}
                className="mr-2"
              />
              Right
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="left"
                checked={direction === "left"}
                onChange={() => setDirection("left")}
                className="mr-2"
              />
              Left
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block font-medium mb-2 text-blue-800">
            Disk Size
          </label>
          <select
            value={diskSize}
            onChange={(e) => setDiskSize(parseInt(e.target.value))}
            className="w-full border border-blue-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value={200}>200 tracks</option>
            <option value={500}>500 tracks</option>
            <option value={1000}>1000 tracks</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <label className="block font-medium mb-2 text-blue-800">
            Animation Speed
          </label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between">
            <span>Slow</span>
            <span className="font-bold">{speed}x</span>
            <span>Fast</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={animation}
              onChange={() => setAnimation(!animation)}
              className="mr-2"
            />
            Enable Animation
          </label>

          <button
            onClick={resetSimulation}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mb-6">
        <button
          onClick={runSimulation}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md flex items-center justify-center"
        >
          <span className="mr-2">Run Simulation</span>
          <span>⚡</span>
        </button>
      </div>

      {result && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-800">Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium mb-2">Execution Order</h3>
              <div className="bg-white p-3 rounded-lg border border-gray-200 h-24 overflow-y-auto">
                {result.order.join(" → ")}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-medium mb-2">Statistics</h3>
              <div className="flex justify-between">
                <span>Total Head Movements:</span>
                <span className="font-bold text-blue-700">{result.total}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Average Waiting Time:</span>
                <span className="font-bold text-blue-700">
                  {(result.total / result.order.length).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Requests Processed:</span>
                <span className="font-bold text-blue-700">
                  {result.order.length - 1}
                </span>
              </div>
            </div>
          </div>

          <DiskVisualization />
          <AlgorithmComparison />
        </div>
      )}
    </div>
  );
};

export default DiskSimulator;
