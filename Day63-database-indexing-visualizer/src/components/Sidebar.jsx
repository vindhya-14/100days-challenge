import React from "react";

export default function Sidebar({ rows, onSelectRow }) {
  return (
    <aside className="w-64 p-4 space-y-4 border-r bg-white">
      <div className="card">
        <h2 className="text-xl font-semibold">Rows</h2>
        <div className="mt-2 max-h-72 overflow-auto">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRow(r)}
              className="w-full text-left py-1 px-2 rounded hover:bg-slate-100"
            >
              <div className="text-sm">
                ID: {r.id} • Key: {r.key}
              </div>
              <div className="text-xs text-slate-500">{r.value}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold">Index Types</h3>
        <div className="text-sm mt-2">
          This demo shows a simple B-Tree style index (paged) and hash-bucket
          layout.
        </div>
      </div>
    </aside>
  );
}
