import React, { useState, useEffect } from "react";

const STATES = {
  M: "Modified",
  E: "Exclusive",
  S: "Shared",
  I: "Invalid",
};

const colors = {
  Modified: "bg-red-100 border-red-400 text-red-800",
  Exclusive: "bg-yellow-100 border-yellow-400 text-yellow-800",
  Shared: "bg-green-100 border-green-400 text-green-800",
  Invalid: "bg-gray-100 border-gray-400 text-gray-800",
};

const stateIcons = {
  Modified: "✏️",
  Exclusive: "🔒",
  Shared: "👥",
  Invalid: "❌",
};

export default function App() {
  const [memory, setMemory] = useState(0);
  const [caches, setCaches] = useState({
    core1: { state: STATES.I, value: null },
    core2: { state: STATES.I, value: null },
  });
  const [log, setLog] = useState([]);
  const [animation, setAnimation] = useState({
    active: false,
    type: "",
    core: "",
  });
  const [stats, setStats] = useState({ reads: 0, writes: 0, hit: 0, miss: 0 });
  const [history, setHistory] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (animation.active) {
      const timer = setTimeout(() => {
        setAnimation({ active: false, type: "", core: "" });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  function addLog(msg, isHit = null) {
    const newLog = { message: msg, timestamp: new Date(), hit: isHit };
    setLog((prev) => [newLog, ...prev]);

    // Update stats
    if (msg.includes("read") || msg.includes("Read")) {
      setStats((prev) => ({ ...prev, reads: prev.reads + 1 }));
      if (isHit !== null) {
        setStats((prev) => ({
          ...prev,
          hit: prev.hit + (isHit ? 1 : 0),
          miss: prev.miss + (isHit ? 0 : 1),
        }));
      }
    }
    if (msg.includes("write") || msg.includes("Write")) {
      setStats((prev) => ({ ...prev, writes: prev.writes + 1 }));
    }
  }

  function saveToHistory() {
    setHistory((prev) => [
      {
        memory,
        caches: { ...caches },
        timestamp: new Date(),
      },
      ...prev,
    ]);
  }

  function read(core) {
    saveToHistory();
    const other = core === "core1" ? "core2" : "core1";
    const newCaches = { ...caches };
    let isHit = true;

    if (newCaches[core].state !== STATES.I) {
      addLog(`✅ ${core} cache hit: ${newCaches[core].value}`, true);
    } else {
      isHit = false;
      addLog(`🔍 ${core} issues BusRd`, false);
      setAnimation({ active: true, type: "BusRd", core });

      if (newCaches[other].state === STATES.M) {
        addLog(`📝 ${other} writes back to memory`);
        setMemory(newCaches[other].value);
        newCaches[other].state = STATES.S;
        newCaches[core] = { state: STATES.S, value: newCaches[other].value };
      } else if (newCaches[other].state === STATES.E) {
        addLog(`🔀 ${other} downgrades to Shared`);
        newCaches[other].state = STATES.S;
        newCaches[core] = { state: STATES.S, value: newCaches[other].value };
      } else if (newCaches[other].state === STATES.S) {
        newCaches[core] = { state: STATES.S, value: newCaches[other].value };
      } else {
        newCaches[core] = { state: STATES.E, value: memory };
      }
    }
    setCaches(newCaches);
  }

  function write(core, value) {
    saveToHistory();
    const other = core === "core1" ? "core2" : "core1";
    const newCaches = { ...caches };

    if (newCaches[core].state === STATES.M) {
      addLog(`📝 ${core} writes locally`);
      newCaches[core].value = value;
    } else if (newCaches[core].state === STATES.E) {
      addLog(`⚡ ${core} upgrades to Modified`);
      newCaches[core] = { state: STATES.M, value };
    } else if (newCaches[core].state === STATES.S) {
      addLog(`📡 ${core} issues BusUpgr (invalidate ${other})`);
      setAnimation({ active: true, type: "BusUpgr", core });
      newCaches[other].state = STATES.I;
      newCaches[core] = { state: STATES.M, value };
    } else {
      addLog(`📡 ${core} issues BusRdX`);
      setAnimation({ active: true, type: "BusRdX", core });
      if (newCaches[other].state === STATES.M) {
        addLog(`📦 ${other} writeback to memory`);
        setMemory(newCaches[other].value);
      }
      newCaches[other].state = STATES.I;
      newCaches[core] = { state: STATES.M, value };
    }
    setCaches(newCaches);
  }

  function reset() {
    setMemory(0);
    setCaches({
      core1: { state: STATES.I, value: null },
      core2: { state: STATES.I, value: null },
    });
    setLog([]);
    setStats({ reads: 0, writes: 0, hit: 0, miss: 0 });
    setHistory([]);
    addLog("🔄 Simulation reset");
  }

  function undo() {
    if (history.length > 0) {
      const previousState = history[0];
      setMemory(previousState.memory);
      setCaches(previousState.caches);
      setHistory((prev) => prev.slice(1));
      addLog("↩️ Undone last operation");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              MESI Cache Coherence Simulator
            </h1>
            <p className="text-gray-600">
              Visualize how processors maintain cache consistency
            </p>
          </div>
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            {showTutorial ? "Hide Tutorial" : "Show Tutorial"}
          </button>
        </div>

        {/* Tutorial */}
        {showTutorial && (
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-700">Modified (M)</h3>
                <p className="text-sm">
                  Cache has the only copy, and it's different from memory
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-700">Exclusive (E)</h3>
                <p className="text-sm">
                  Cache has the only copy, but it matches memory
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-700">Shared (S)</h3>
                <p className="text-sm">
                  Multiple caches may have this copy, matches memory
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700">Invalid (I)</h3>
                <p className="text-sm">
                  Data in this cache is stale or not present
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                💡 <strong>Tip:</strong> Click Read/Write buttons to simulate
                processor operations and observe how cache states change.
              </p>
            </div>
          </div>
        )}

        {/* Memory and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Memory */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">🧠</span> Main Memory
            </h2>
            <div className="p-4 bg-blue-50 rounded-lg text-center border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-700">{memory}</div>
              <div className="text-sm text-blue-600 mt-2">Current Value</div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  const val = parseInt(prompt("Set memory value:", memory), 10);
                  if (!isNaN(val)) {
                    setMemory(val);
                    addLog(`💾 Memory set to ${val}`);
                  }
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Set Memory Value
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">📊</span> Performance Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-700">
                  {stats.reads}
                </div>
                <div className="text-sm text-indigo-600">Reads</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {stats.writes}
                </div>
                <div className="text-sm text-purple-600">Writes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {stats.hit}
                </div>
                <div className="text-sm text-green-600">Hits</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {stats.miss}
                </div>
                <div className="text-sm text-red-600">Misses</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Hit Rate
                </span>
                <span className="ml-auto text-sm font-semibold">
                  {stats.reads > 0
                    ? Math.round((stats.hit / stats.reads) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${
                      stats.reads > 0 ? (stats.hit / stats.reads) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Cores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {["core1", "core2"].map((core) => (
            <div
              key={core}
              className={`p-6 rounded-xl shadow-md bg-white ${
                animation.active && animation.core === core
                  ? "ring-2 ring-indigo-500"
                  : ""
              }`}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <span className="mr-2">⚡</span> {core.toUpperCase()}
              </h2>

              <div
                className={`p-4 rounded-lg mb-4 border-2 ${
                  colors[caches[core].state]
                } transition-all duration-300`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold">State</div>
                    <div className="text-lg font-bold flex items-center">
                      {stateIcons[caches[core].state]} {caches[core].state}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Value</div>
                    <div className="text-lg font-bold">
                      {caches[core].value ?? "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => read(core)}
                  disabled={animation.active}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">📖</span> Read
                </button>
                <button
                  onClick={() => {
                    const val = parseInt(
                      prompt("Enter value to write:", caches[core].value || 0),
                      10
                    );
                    if (!isNaN(val)) write(core, val);
                  }}
                  disabled={animation.active}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">✏️</span> Write
                </button>
              </div>

              {animation.active && animation.core === core && (
                <div className="text-center py-2 px-4 bg-indigo-100 text-indigo-700 rounded-lg animate-pulse">
                  {animation.type === "BusRd" &&
                    "BusRd transaction in progress..."}
                  {animation.type === "BusUpgr" &&
                    "BusUpgr transaction in progress..."}
                  {animation.type === "BusRdX" &&
                    "BusRdX transaction in progress..."}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controls and Log */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Controls
            </h2>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                🔄 Reset Simulation
              </button>
              <button
                onClick={undo}
                disabled={history.length === 0}
                className="w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                ↩️ Undo Last Action
              </button>
              <button
                onClick={() => {
                  setLog([]);
                  addLog("📋 Log cleared");
                }}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                🗑️ Clear Log
              </button>
            </div>
          </div>

          {/* Log */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-3">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
              <span className="mr-2">📋</span> Bus Log
              <span className="ml-auto text-sm font-normal text-gray-500">
                {log.length} entries
              </span>
            </h2>
            <div className="h-80 overflow-y-auto bg-gray-50 p-4 rounded-lg border">
              {log.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p>Log is empty. Perform actions to see them here.</p>
                </div>
              ) : (
                log.map((entry, i) => (
                  <div
                    key={i}
                    className={`text-sm mb-2 p-2 rounded-md ${
                      entry.hit === true
                        ? "bg-green-50"
                        : entry.hit === false
                        ? "bg-red-50"
                        : "bg-white"
                    }`}
                  >
                    <span className="text-gray-500 text-xs">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="ml-2">{entry.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>MESI Cache Coherence Protocol Simulator | Built with React</p>
        </div>
      </div>
    </div>
  );
}
