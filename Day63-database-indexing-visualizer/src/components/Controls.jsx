import React, { useState } from "react";

export default function Controls({ onInsert, onReset, maxKeys, setMaxKeys }) {
  const [val, setVal] = useState("");

  return (
    <div className="card flex gap-2 items-center">
      <input
        type="number"
        className="p-2 rounded border"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="new key"
      />
      <button
        className="px-3 py-2 bg-slate-800 text-white rounded"
        onClick={() => {
          if (val !== "") {
            onInsert(Number(val));
            setVal("");
          }
        }}
      >
        Insert Key
      </button>

      <div className="ml-auto flex items-center gap-2">
        <label className="text-sm">Page size</label>
        <input
          type="range"
          min={2}
          max={6}
          value={maxKeys}
          onChange={(e) => setMaxKeys(Number(e.target.value))}
        />
        <span className="w-8 text-right">{maxKeys}</span>
        <button onClick={onReset} className="px-3 py-1 border rounded">
          Reset
        </button>
      </div>
    </div>
  );
}
