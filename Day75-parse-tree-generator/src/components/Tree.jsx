import React, { useState, useEffect } from "react";

function NodeBox({ label, value, isRoot, isHighlighted }) {
  return (
    <div
      className={`inline-flex flex-col items-center px-3 py-2 rounded-lg border-2 min-w-[60px] text-center transition-all duration-300
      ${
        isRoot
          ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-indigo-700 shadow-lg"
          : isHighlighted
          ? "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-400 shadow-lg"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-300 shadow-md hover:shadow-lg"
      }`}
    >
      <div className="text-sm font-semibold">{label}</div>
      {value !== undefined && (
        <div
          className={`text-xs mt-1 px-2 py-1 rounded-full ${
            isRoot ? "bg-indigo-700" : "bg-gray-200"
          }`}
        >
          {value}
        </div>
      )}
    </div>
  );
}

function Branch({ node, level = 0, highlightedNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate nodes in sequentially
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, level * 100);

    return () => clearTimeout(timer);
  }, [level]);

  if (!node) return null;

  const isHighlighted = highlightedNode && highlightedNode === node;

  if (node.type === "num") {
    return (
      <div
        className={`flex flex-col items-center transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <NodeBox label="num" value={node.value} isHighlighted={isHighlighted} />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <NodeBox
        label={node.type}
        isRoot={level === 0}
        isHighlighted={isHighlighted}
      />

      {node.children && node.children.length > 0 && (
        <>
          <div className="h-6 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-gray-400 to-transparent"></div>
          </div>

          <div className="flex gap-8 mt-2 relative">
            {/* Connector line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>

            {node.children.map((c, i) => (
              <div key={i} className="flex flex-col items-center relative">
                {/* Vertical connector */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-px h-2 bg-gradient-to-b from-transparent to-gray-400"></div>

                <Branch
                  node={c}
                  level={level + 1}
                  highlightedNode={highlightedNode}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Tree({ node, highlightedNode }) {
  const [showTree, setShowTree] = useState(false);

  useEffect(() => {
    // Trigger animation when node changes
    setShowTree(false);
    const timer = setTimeout(() => setShowTree(true), 50);
    return () => clearTimeout(timer);
  }, [node]);

  if (!node) return null;

  return (
    <div className="w-full flex justify-center py-6 overflow-auto">
      <div className="inline-block">
        {showTree && <Branch node={node} highlightedNode={highlightedNode} />}
      </div>
    </div>
  );
}
