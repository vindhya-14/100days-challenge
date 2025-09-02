import React from "react";
import Pipeline from "./components/Pipeline";
import Controls from "./components/Controls";

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Instruction Pipeline Simulator</h1>
        <p className="text-sm text-slate-600 mt-1">
          Visualize IF → ID → EX → MEM → WB. Toggle forwarding, step cycles,
          drag instructions.
        </p>
      </header>

      <main className="space-y-6">
        <Controls />
        <Pipeline />
      </main>
    </div>
  );
}
