import React, { useState, useEffect, useRef } from "react";

// Transaction Concurrency Simulator
// Supports 2-Phase Locking (2PL) and Timestamp Ordering (TS)

export default function App() {
  const [mode, setMode] = useState("2PL"); // current mode: 2PL or TS
  const [step, setStep] = useState(0);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Two sample transactions
  const transactions = [
    { id: "T1", ops: ["R(X)", "W(X)", "R(Y)", "W(Y)", "C"] },
    { id: "T2", ops: ["R(Y)", "W(Y)", "R(X)", "W(X)", "C"] },
  ];

  const maxSteps = Math.max(...transactions.map((t) => t.ops.length));

  // Reset simulation
  const reset = () => {
    setStep(0);
    setLog([]);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Step through simulation
  const stepSimulation = () => {
    if (step >= maxSteps) return;
    const t = transactions[step % 2]; // alternate T1/T2
    const op = t.ops[Math.floor(step / 2)];
    if (!op) {
      setStep((s) => s + 1);
      return;
    }

    // Conflict handling based on mode
    if (mode === "2PL") {
      if (op.includes("W")) {
        setLog((l) => [...l, `${t.id}: Acquires exclusive lock for ${op}`]);
      } else if (op.includes("R")) {
        setLog((l) => [...l, `${t.id}: Acquires shared lock for ${op}`]);
      } else if (op === "C") {
        setLog((l) => [...l, `${t.id}: Commits, releases locks`]);
      }
    } else if (mode === "TS") {
      const ts = t.id === "T1" ? 1 : 2;
      setLog((l) => [...l, `${t.id} (TS=${ts}): Executes ${op}`]);
      if (op.includes("W") && ts === 2) {
        setLog((l) => [...l, `${t.id}: Aborted due to timestamp conflict`]);
      }
    }

    setStep((s) => s + 1);
  };

  // Run automatically
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        stepSimulation();
      }, 1500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, step, mode]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">
        Transaction Concurrency Simulator
      </h1>

      {/* Mode toggle */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            mode === "2PL" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => {
            reset();
            setMode("2PL");
          }}
        >
          2-Phase Locking
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            mode === "TS" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => {
            reset();
            setMode("TS");
          }}
        >
          Timestamp Ordering
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
          onClick={() => setRunning(true)}
          disabled={running}
        >
          Run
        </button>
        <button
          className="px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700"
          onClick={stepSimulation}
        >
          Step
        </button>
        <button
          className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
          onClick={reset}
        >
          Reset
        </button>
      </div>

      {/* Transactions view */}
      <div className="grid grid-cols-2 gap-6 mb-6 w-full max-w-4xl">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <h2 className="font-bold text-lg mb-2">{t.id}</h2>
            <div className="flex gap-2">
              {t.ops.map((op, i) => (
                <div
                  key={i}
                  className={`px-2 py-1 rounded ${
                    i <= Math.floor(step / 2) &&
                    step % 2 === (t.id === "T1" ? 0 : 1)
                      ? "bg-blue-500"
                      : "bg-gray-700"
                  }`}
                >
                  {op}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Log */}
      <div className="bg-gray-800 w-full max-w-4xl p-4 rounded-lg h-64 overflow-y-auto">
        <h2 className="font-bold text-lg mb-2">Event Log</h2>
        <ul className="space-y-1 text-sm">
          {log.map((entry, idx) => (
            <li key={idx} className="text-gray-200">
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
