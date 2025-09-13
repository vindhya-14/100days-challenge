import React, { useState } from "react";
import { parseExpression } from "./components/Parser";
import Tree from "./components/Tree";

export default function App() {
  const [expr, setExpr] = useState("3+4*2/(1-5)");
  const [root, setRoot] = useState(null);
  const [error, setError] = useState(null);

  function handleParse() {
    try {
      const res = parseExpression(expr);
      setRoot(res);
      setError(null);
    } catch (e) {
      setRoot(null);
      setError(e.message || String(e));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Parse Tree Generator</h1>
        <p className="text-sm text-slate-600 mb-4">
          Grammar used (no left recursion):
        </p>
        <pre className="bg-slate-100 p-3 rounded mb-4 text-sm">
          {`E -> T E'
E' -> + T E' | - T E' | ε
T -> F T'
T' -> * F T' | / F T' | ε
F -> ( E ) | number`}
        </pre>

        <div className="flex gap-3 mb-4">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="Enter expression, e.g. 3+4*2/(1-5)"
          />
          <button
            onClick={handleParse}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Parse
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">Error: {error}</div>}

        <div className="overflow-auto border rounded p-4">
          {root ? (
            <Tree node={root} />
          ) : (
            <div className="text-slate-500">
              No parse tree yet. Click <strong>Parse</strong>.
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}
