import React from "react";
import Network from "./components/Network";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white font-sans">
      <header className="text-center py-6 border-b border-slate-700 backdrop-blur-md bg-white/5 sticky top-0 z-50">
        <h1 className="text-4xl font-extrabold tracking-wide text-cyan-400 drop-shadow-lg">
          Networking Packet Routing Game
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Visualize <span className="text-emerald-400">Dijkstra</span> and{" "}
          <span className="text-pink-400">Flooding</span> Algorithms in real
          time 🚀
        </p>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <Network />
      </main>
    </div>
  );
}
