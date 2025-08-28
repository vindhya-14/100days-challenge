import React from "react";
import Visualizer from "../components/Visualizer";
import Controls from "../components/Controls";

const Home = () => {
  return (
    <div className="w-full max-w-5xl p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">
        DNS Lookup Visualizer 🌐
      </h1>
      <Visualizer />
      <Controls />
    </div>
  );
};

export default Home;
