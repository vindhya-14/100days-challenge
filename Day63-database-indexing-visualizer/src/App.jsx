import React, { useState } from "react";
import { sampleRows } from "./data/sampleData";
import { buildBTreeFromKeys } from "./utils/btreeSim";
import Sidebar from "./components/Sidebar";
import Controls from "./components/Controls";
import Visualizer from "./components/Visualizer";
import Legend from "./components/Legend";

export default function App() {
  const [rows] = useState(sampleRows);
  const [maxKeys, setMaxKeys] = useState(3);
  const [keys, setKeys] = useState(rows.map((r) => r.key));
  const [tree, setTree] = useState(buildBTreeFromKeys(keys, maxKeys));

  const handleInsert = (k) => {
    const newKeys = [...keys, k];
    setKeys(newKeys);
    setTree(buildBTreeFromKeys(newKeys, maxKeys));
  };

  const handleReset = () => {
    setKeys([]);
    setTree(buildBTreeFromKeys([], maxKeys));
  };

  return (
    <div className="flex h-screen">
      <Sidebar rows={rows} onSelectRow={(r) => handleInsert(r.key)} />
      <main className="flex-1 p-4 space-y-4 overflow-auto">
        <Controls
          onInsert={handleInsert}
          onReset={handleReset}
          maxKeys={maxKeys}
          setMaxKeys={setMaxKeys}
        />
        <div className="card">
          <Visualizer tree={tree.root} pages={tree.nodes} />
        </div>
        <Legend />
      </main>
    </div>
  );
}
