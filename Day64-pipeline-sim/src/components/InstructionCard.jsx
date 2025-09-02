import React from "react";

export default function InstructionCard({ instr, small }) {
  if (!instr)
    return (
      <div className="p-2 rounded border border-dashed border-slate-200 text-slate-400 text-xs">
        empty
      </div>
    );
  return (
    <div
      className={`p-3 rounded shadow-sm ${small ? "text-xs" : ""}`}
      draggable
      title={instr.text}
    >
      <div className="font-medium">{instr.text}</div>
      <div className="text-[11px] text-slate-500 mt-1">
        {instr.type.toUpperCase()} {instr.rd ? `| rd:${instr.rd}` : ""}{" "}
        {instr.rs1 ? `| rs1:${instr.rs1}` : ""}{" "}
        {instr.rs2 ? `| rs2:${instr.rs2}` : ""}
      </div>
    </div>
  );
}
