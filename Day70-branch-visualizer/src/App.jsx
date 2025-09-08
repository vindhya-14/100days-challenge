import React from "react";
import BranchVisualizer from "./components/BranchVisualizer";

export default function App() {
  return (
    <div
      className="app-root"
      style={{ padding: "20px", fontFamily: "sans-serif" }}
    >
      <header>
        <h1>Branch Predictor Visualizer</h1>
        <p>Interactive 2-bit predictor + misprediction flush visualization</p>
      </header>
      <main>
        <BranchVisualizer />
      </main>
     
    </div>
  );
}
