import React, { useState, useRef } from "react";
import RouterNode from "./RouterNode";
import Packet from "./Packet";
import { dijkstra } from "../algorithms/dijkstra";
import { flooding } from "../algorithms/flooding";
import { sampleGraph, neighborsFromEdges } from "../utils/graphUtils";

export default function Network() {
  const [nodes, setNodes] = useState(sampleGraph.nodes);
  const [edges, setEdges] = useState(sampleGraph.edges);
  const [packets, setPackets] = useState([]);
  const [mode, setMode] = useState("dijkstra");
  const [source, setSource] = useState("A");
  const [target, setTarget] = useState("F");
  const idRef = useRef(0);

  const spawnPacket = () => {
    const id = idRef.current++;
    const graphNeighbors = neighborsFromEdges(edges);

    if (mode === "dijkstra") {
      const path = dijkstra(graphNeighbors, source, target);
      if (!path || path.length < 2) return;
      const pathPoints = path.map((n) => nodes.find((x) => x.id === n));
      setPackets((p) => [...p, { id, path: pathPoints }]);
    } else {
      const floodPaths = flooding(graphNeighbors, source, target);
      floodPaths.forEach((p) => {
        const pathPoints = p.map((n) => nodes.find((x) => x.id === n));
        const nid = idRef.current++;
        setPackets((prev) => [...prev, { id: nid, path: pathPoints }]);
      });
    }
  };

  const handlePacketEnd = (id) => {
    setPackets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex gap-6">
      {/* Network Graph */}
      <div className="relative w-3/4 rounded-xl shadow-xl border border-slate-700 bg-slate-800/80 backdrop-blur-md">
        <svg className="w-full h-[600px] rounded-xl">
          {/* Links */}
          {edges.map((e, i) => {
            const a = nodes.find((n) => n.id === e.a);
            const b = nodes.find((n) => n.id === e.b);
            return (
              <g key={i}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#64748b"
                  strokeWidth={3}
                  className="drop-shadow-md"
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 8}
                  className="text-xs fill-slate-400"
                >
                  {e.w}
                </text>
              </g>
            );
          })}

          {/* Routers */}
          {nodes.map((n) => (
            <RouterNode
              key={n.id}
              node={n}
              active={packets.some((pkt) =>
                pkt.path.some((p) => p.id === n.id)
              )}
            />
          ))}
        </svg>

        {/* Packets Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {packets.map((pkt) => (
            <Packet
              key={pkt.id}
              data={pkt}
              onEnd={() => handlePacketEnd(pkt.id)}
            />
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <aside className="w-1/4 bg-slate-900/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-slate-700 space-y-4">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Controls ⚙️</h2>

        {/* Mode */}
        <div>
          <label className="block mb-1 text-slate-300">Routing Mode</label>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("dijkstra")}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                mode === "dijkstra"
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              Dijkstra
            </button>
            <button
              onClick={() => setMode("flooding")}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                mode === "flooding"
                  ? "bg-pink-500 text-white"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              Flooding
            </button>
          </div>
        </div>

        {/* Source & Target */}
        <div>
          <label className="text-slate-300">Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-slate-700 text-white"
          >
            {nodes.map((n) => (
              <option key={n.id}>{n.id}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-slate-300">Target</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full mt-1 p-2 rounded-lg bg-slate-700 text-white"
          >
            {nodes.map((n) => (
              <option key={n.id}>{n.id}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={spawnPacket}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-lg font-bold"
          >
            🚀 Send Packet
          </button>
          <button
            onClick={() => setPackets([])}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg font-bold"
          >
            ❌ Clear
          </button>
        </div>

        {/* Packet Count Meter */}
        <div className="mt-6">
          <h3 className="text-slate-300 mb-2">Network Activity</h3>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-pink-500 h-4 transition-all"
              style={{ width: `${Math.min(packets.length * 20, 100)}%` }}
            />
          </div>
          <p className="text-sm mt-1 text-slate-400">
            {packets.length} packets in-flight
          </p>
        </div>
      </aside>
    </div>
  );
}
