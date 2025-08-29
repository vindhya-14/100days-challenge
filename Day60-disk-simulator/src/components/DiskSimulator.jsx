import { useState, useEffect } from "react";
import { fcfs, sstf, scan, cscan } from "../utils/algorithm";

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

    let output;
    switch (algorithm) {
      case "FCFS":
        output = fcfs(requests, head);
        break;
      case "SSTF":
        output = sstf(requests, head);
        break;
      case "SCAN":
        output = scan(requests, head, direction === "right");
        break;
      case "C-SCAN":
        output = cscan(requests, head, direction === "right");
        break;
      default:
        output = { order: [], total: 0 };
    }
    setResult(output);

    // Start animation if enabled
    if (animation) {
      setCompletedRequests([]);
      animateDiskMovement(output.order);
    }
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
    }, 800);
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

    const trackWidth = 400;
    const trackHeight = 20;
    const trackItems = Array.from(
      { length: diskSize / 10 + 1 },
      (_, i) => i * 10
    );

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
              className="absolute top-0 h-full bg-blue-500 rounded-full"
              style={{
                left: `${(currentPosition / diskSize) * 100}%`,
                width: "4px",
                transform: "translateX(-2px)",
              }}
            ></div>

            {result.order.map((pos, index) => (
              <div
                key={index}
                className={`absolute top-0 w-2 h-2 rounded-full ${
                  completedRequests.includes(pos)
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  left: `${(pos / diskSize) * 100}%`,
                  transform: "translateX(-1px)",
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
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
    if (!result) return null;

    const algorithms = ["FCFS", "SSTF", "SCAN", "C-SCAN"];
    const requests = sequence
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x) && x >= 0 && x <= diskSize);

    // This would ideally be calculated for all algorithms
    // For simplicity, we'll just show the current algorithm's result
    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Performance Comparison</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{algorithm}</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {result.total} movements
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(result.total / diskSize) * 3}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Other algorithms would be shown here with a full implementation
          </p>
        </div>
      </div>
    );
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

      <div className="flex items-center mb-6">
        <label className="flex items-center mr-4">
          <input
            type="checkbox"
            checked={animation}
            onChange={() => setAnimation(!animation)}
            className="mr-2"
          />
          Enable Animation
        </label>

        <button
          onClick={runSimulation}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-md flex items-center justify-center"
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
