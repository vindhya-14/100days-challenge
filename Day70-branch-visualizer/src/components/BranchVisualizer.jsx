import React, { useState, useEffect } from "react";

const N = 8; // BHT entries
const defaultPenalty = 4;

function counterLabel(v) {
  if (v >= 3) return "Strongly Taken";
  if (v === 2) return "Weakly Taken";
  if (v === 1) return "Weakly Not Taken";
  return "Strongly Not Taken";
}

export default function BranchVisualizer() {
  const [bht, setBht] = useState(
    () => Array.from({ length: N }, () => 2) // weakly taken start
  );
  const [selected, setSelected] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mispredicts, setMispredicts] = useState(0);
  const [wastedCycles, setWastedCycles] = useState(0);
  const [lastEvent, setLastEvent] = useState(null);
  const [penalty] = useState(defaultPenalty);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    if (anim) {
      const t = setTimeout(() => setAnim(false), 1000);
      return () => clearTimeout(t);
    }
  }, [anim]);

  function predict(index) {
    return bht[index] >= 2 ? "TAKEN" : "NOT TAKEN";
  }

  function updateCounter(index, actualTaken) {
    setBht((prev) =>
      prev.map((v, i) => {
        if (i !== index) return v;
        return actualTaken ? Math.min(3, v + 1) : Math.max(0, v - 1);
      })
    );
  }

  function doBranch(actualTaken) {
    const prediction = predict(selected);
    const wasCorrect = (prediction === "TAKEN") === actualTaken;

    setTotal((t) => t + 1);
    if (wasCorrect) {
      setCorrect((c) => c + 1);
      setLastEvent(
        `✅ Correct! Predicted ${prediction}, actual ${
          actualTaken ? "TAKEN" : "NOT TAKEN"
        }`
      );
    } else {
      setMispredicts((m) => m + 1);
      setWastedCycles((w) => w + penalty);
      setLastEvent(
        `❌ Mispredicted! Predicted ${prediction}, actual ${
          actualTaken ? "TAKEN" : "NOT TAKEN"
        }`
      );
      setAnim(true);
    }

    updateCounter(selected, actualTaken);
  }

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <label>
          Select BHT index:{" "}
          <select
            value={selected}
            onChange={(e) => setSelected(parseInt(e.target.value))}
          >
            {bht.map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => doBranch(true)} style={{ marginRight: "10px" }}>
          Take Branch
        </button>
        <button onClick={() => doBranch(false)}>Not Take Branch</button>
      </div>

      {lastEvent && (
        <div
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: anim ? "red" : "green",
          }}
        >
          {lastEvent}
        </div>
      )}

      <h2 style={{ marginTop: "20px" }}>Branch History Table</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Index</th>
            <th>Counter</th>
            <th>Prediction</th>
          </tr>
        </thead>
        <tbody>
          {bht.map((c, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i === selected ? "#e0f7fa" : "white",
              }}
            >
              <td>{i}</td>
              <td>{counterLabel(c)}</td>
              <td>{c >= 2 ? "TAKEN" : "NOT TAKEN"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "20px" }}>Stats</h2>
      <ul>
        <li>Total branches: {total}</li>
        <li>Correct predictions: {correct}</li>
        <li>Mispredictions: {mispredicts}</li>
        <li>Wasted cycles: {wastedCycles}</li>
      </ul>

      {anim && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "red",
            color: "white",
            fontWeight: "bold",
          }}
        >
          🚨 Pipeline Flush! Wasted {penalty} cycles.
        </div>
      )}
    </div>
  );
}
