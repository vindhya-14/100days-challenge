import React from "react";

export default function RouterNode({ node, active }) {
  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      <circle
        r={24}
        className={`${
          active ? "fill-cyan-400 animate-pulse" : "fill-slate-600"
        } stroke-slate-900 stroke-2`}
      />
      <text
        y={5}
        textAnchor="middle"
        className="fill-white font-bold text-sm drop-shadow-lg"
      >
        {node.id}
      </text>
    </g>
  );
}
