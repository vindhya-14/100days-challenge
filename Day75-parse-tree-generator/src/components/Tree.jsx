import React from "react";

function NodeBox({ label, value }) {
  return (
    <div className="inline-block px-3 py-1 rounded border bg-white shadow-sm min-w-[48px] text-center">
      <div className="text-sm font-medium">{label}</div>
      {value !== undefined && (
        <div className="text-xs text-slate-500">{value}</div>
      )}
    </div>
  );
}

function Branch({ node }) {
  if (!node) return null;
  if (node.type === "num") {
    return (
      <div className="flex flex-col items-center">
        <NodeBox label="num" value={node.value} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <NodeBox label={node.type} />
      <div className="flex gap-6 mt-4">
        {node.children &&
          node.children.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-6 border-l" />
              <Branch node={c} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Tree({ node }) {
  if (!node) return null;
  return (
    <div className="w-full flex justify-center py-6">
      <div className="inline-block">
        <Branch node={node} />
      </div>
    </div>
  );
}
