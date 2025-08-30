import { useState } from "react";
import ResourceTable from "./components/ResourceTable";
import ProcessTable from "./components/ProcessTable";
import SimulationControls from "./components/SimulationControls";
import ResultPanel from "./components/ResultPanel";
import { bankersAlgorithm } from "./utils/bankersAlgorithm";

export default function App() {
  const [available] = useState([3, 3, 2]);
  const [processes] = useState([
    { id: "P0", allocation: [0, 1, 0], max: [7, 5, 3] },
    { id: "P1", allocation: [2, 0, 0], max: [3, 2, 2] },
    { id: "P2", allocation: [3, 0, 2], max: [9, 0, 2] },
    { id: "P3", allocation: [2, 1, 1], max: [2, 2, 2] },
    { id: "P4", allocation: [0, 0, 2], max: [4, 3, 3] },
  ]);

  const [result, setResult] = useState(null);

  const runSimulation = () => {
    const res = bankersAlgorithm(processes, available);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Deadlock Detection & Avoidance Simulator
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <ResourceTable available={available} />
        <ProcessTable processes={processes} />
      </div>

      <SimulationControls onRun={runSimulation} />
      <ResultPanel result={result} />
    </div>
  );
}
