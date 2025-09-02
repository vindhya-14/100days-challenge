import React, { useContext, useEffect } from "react";
import { PipelineContext, Provider } from "./pipelineContext";

/* We wrap Controls in Provider so top-level can access the pipeline state.
   The Pipeline component below will also use the same Provider. */

function ControlsInner() {
  const {
    step,
    play,
    pause,
    reset,
    autoplay,
    setAutoplay,
    forwarding,
    setForwarding,
    cycle,
  } = useContext(PipelineContext);

  useEffect(() => {
    let t;
    if (autoplay) {
      t = setInterval(() => step(), 700);
    }
    return () => clearInterval(t);
  }, [autoplay, step]);

  return (
    <div className="bg-white p-4 rounded shadow flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={step}
          className="px-3 py-2 rounded bg-sky-500 text-white"
        >
          Step
        </button>
        {!autoplay ? (
          <button
            onClick={() => setAutoplay(true)}
            className="px-3 py-2 rounded bg-green-500 text-white"
          >
            Play
          </button>
        ) : (
          <button
            onClick={() => setAutoplay(false)}
            className="px-3 py-2 rounded bg-amber-500 text-white"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="px-3 py-2 rounded bg-rose-500 text-white"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={forwarding}
            onChange={(e) => setForwarding(e.target.checked)}
          />
          <span>Enable Forwarding</span>
        </label>

        <div className="text-sm text-slate-600">
          Cycle: <span className="font-medium">{cycle}</span>
        </div>
      </div>
    </div>
  );
}

export default function Controls() {
  return (
    <Provider>
      <ControlsInner />
    </Provider>
  );
}
