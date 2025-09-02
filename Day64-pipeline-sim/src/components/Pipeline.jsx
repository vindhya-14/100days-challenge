import React, { useContext } from "react";
import InstructionCard from "./InstructionCard";
import { Provider, PipelineContext } from "./pipelineContext";
import PipelineModel from "./pipelineModel";

const STAGES = ["IF", "ID", "EX", "MEM", "WB"];

function PipelineInner() {
  const {
    pipelineSlots,
    instrQueue,
    completed,
    cycle,
    step,
    reset,
    forwarding,
    setForwarding,
    history,
    forwarding: fwdEnabled,
  } = useContext(PipelineContext);

  // Render stage columns
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pipeline</h2>
        <div className="text-sm text-slate-600">
          Forwarding: <strong>{fwdEnabled ? "ON" : "OFF"}</strong>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {pipelineSlots.map((slot) => (
          <div key={slot.stage} className="bg-slate-50 p-3 rounded border">
            <div className="text-sm font-semibold mb-2">{slot.stage}</div>
            <div className="min-h-[96px]">
              <InstructionCard instr={slot.instr} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded border">
          <div className="font-semibold mb-2">Fetch Queue</div>
          <div className="space-y-2">
            {instrQueue.length === 0 ? (
              <div className="text-sm text-slate-500">empty</div>
            ) : (
              instrQueue.map((i) => (
                <div
                  key={i.id}
                  className="p-2 bg-white rounded shadow-sm cursor-grab"
                >
                  <InstructionCard instr={i} small />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded border">
          <div className="font-semibold mb-2">Completed</div>
          <div className="space-y-1 text-sm text-slate-600 max-h-40 overflow-auto">
            {completed.length === 0 ? (
              <div className="text-slate-500">none</div>
            ) : (
              completed.map((c) => (
                <div key={c.id}>
                  {c.text}{" "}
                  <span className="text-xs text-slate-400">
                    (@{c.completedAt})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-slate-600">
          <strong>Cycle:</strong> {cycle}
        </div>
        <div className="mt-2">
          <button
            onClick={step}
            className="px-3 py-2 bg-sky-600 text-white rounded mr-2"
          >
            Step
          </button>
          <button
            onClick={reset}
            className="px-3 py-2 bg-rose-500 text-white rounded mr-2"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Recent History</h3>
        <div className="text-xs text-slate-600 mt-2">
          {history
            .slice(-6)
            .reverse()
            .map((h, idx) => (
              <div key={idx} className="mb-2 p-2 bg-white rounded border">
                <div className="text-[13px] font-medium">
                  Cycle {h.cycle}{" "}
                  {h.stallID ? (
                    <span className="text-rose-500">
                      - Stalled: {h.stallReason}
                    </span>
                  ) : (
                    <span className="text-green-600">- OK</span>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {h.slots.map((s) => (
                    <div
                      key={s.stage}
                      className="p-1 text-[11px] bg-slate-50 rounded border"
                    >
                      <div className="font-semibold">{s.stage}</div>
                      <div className="truncate">
                        {s.instr ? s.instr.text : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function Pipeline() {
  return (
    <Provider>
      <PipelineInner />
    </Provider>
  );
}
