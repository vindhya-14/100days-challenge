import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function NodeBox({
  node,
  x,
  y,
  isSelected,
  onClick,
  isHighlighted,
  showPointers,
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8, y: y + 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: x,
        y: y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <foreignObject x={-80} y={-30} width={160} height={node.leaf ? 70 : 60}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className={`
            border-2 rounded-xl p-3 shadow-lg h-full transition-all duration-300
            ${
              isSelected
                ? "border-blue-500 bg-blue-50 shadow-blue-200"
                : isHighlighted
                ? "border-green-500 bg-green-50 shadow-green-200"
                : node.leaf
                ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white"
                : "border-indigo-300 bg-gradient-to-br from-indigo-50 to-white"
            }
          `}
        >
          <div className="flex justify-between items-center mb-1">
            <div
              className={`text-xs font-semibold ${
                node.leaf ? "text-emerald-600" : "text-indigo-600"
              }`}
            >
              {node.leaf ? "🍃 Leaf" : "🌿 Internal"}
            </div>
            {node.keys.length > 0 && (
              <div
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  node.leaf
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {node.keys.length} key{node.keys.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
          <div className="flex gap-1 flex-wrap justify-center">
            {node.keys.map((k, i) => (
              <div
                key={i}
                className={`
                  px-2 py-1 text-xs font-medium rounded-full border 
                  ${
                    isSelected
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : isHighlighted
                      ? "bg-green-100 text-green-800 border-green-200"
                      : node.leaf
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-indigo-100 text-indigo-800 border-indigo-200"
                  }
                `}
              >
                {k}
              </div>
            ))}
          </div>
          {node.leaf && showPointers && (
            <div className="mt-2 text-xs text-center text-slate-500">
              → Next leaf
            </div>
          )}
        </div>
      </foreignObject>

      {/* Pointer indicators for internal nodes */}
      {!node.leaf && showPointers && (
        <>
          <circle cx={x - 60} cy={y + 15} r="4" fill="#6366f1" />
          <circle cx={x + 60} cy={y + 15} r="4" fill="#6366f1" />
          <text x={x - 65} y={y + 20} className="text-xs fill-indigo-600">
            Ptr
          </text>
          <text x={x + 45} y={y + 20} className="text-xs fill-indigo-600">
            Ptr
          </text>
        </>
      )}
    </motion.g>
  );
}

function Connection({ fromX, fromY, toX, toY, isHighlighted, label }) {
  return (
    <g>
      <motion.path
        d={`M ${fromX} ${fromY} C ${fromX} ${fromY + 40}, ${toX} ${
          toY - 40
        }, ${toX} ${toY}`}
        fill="none"
        stroke={isHighlighted ? "#10b981" : "#cbd5e1"}
        strokeWidth={isHighlighted ? 2.5 : 1.5}
        strokeDasharray={isHighlighted ? "0" : "5,3"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {label && (
        <text
          x={(fromX + toX) / 2}
          y={(fromY + toY) / 2 - 10}
          className="text-xs fill-slate-500"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function Legend() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-lg font-semibold mb-3 text-slate-800">
        B+ Tree Legend
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-indigo-100 border-2 border-indigo-300"></div>
            <span>
              <span className="font-medium text-indigo-700">
                Internal Node:
              </span>{" "}
              Index page
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-300"></div>
            <span>
              <span className="font-medium text-emerald-700">Leaf Node:</span>{" "}
              Data page
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg bg-indigo-100 border border-indigo-200"></div>
            <span>
              <span className="font-medium">Keys:</span> Indexed values
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg width="24" height="24">
              <path
                d="M 4 12 L 20 12"
                stroke="#cbd5e1"
                strokeWidth="2"
                fill="none"
              />
              <path d="M 16 8 L 20 12 L 16 16" fill="#cbd5e1" />
            </svg>
            <span>
              <span className="font-medium">Pointers:</span> References to child
              nodes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="24" height="24">
              <path
                d="M 4 12 L 20 12"
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
              />
              <path d="M 16 8 L 20 12 L 16 16" fill="#10b981" />
            </svg>
            <span>
              <span className="font-medium text-green-600">Search Path:</span>{" "}
              Traversal route
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
            <span>
              <span className="font-medium text-blue-700">Selected Node:</span>{" "}
              Click to inspect
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Visualizer({ tree, pages, width = 800, height = 500 }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedValue, setHighlightedValue] = useState(null);
  const [traversalPath, setTraversalPath] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [nodePositions, setNodePositions] = useState({});
  const [showPointers, setShowPointers] = useState(true);

  // Calculate positions for all nodes
  const calculateLayout = () => {
    if (!tree || !pages) return { nodes: [], connections: [] };

    const nodes = [];
    const connections = [];
    const levelHeight = 120;

    // Add root node
    const rootX = width / 2 - 80;
    const rootY = 40;
    nodes.push({
      id: "root",
      node: tree,
      x: rootX,
      y: rootY,
      level: 0,
    });

    // Add leaf nodes
    const leafSpacing = Math.min(
      180,
      (width - 100) / Math.max(1, pages.length)
    );
    const leafStartX = (width - (pages.length - 1) * leafSpacing) / 2;

    pages.forEach((leaf, i) => {
      const x = leafStartX + i * leafSpacing;
      const y = 40 + levelHeight * 2;

      nodes.push({
        id: `leaf-${i}`,
        node: leaf,
        x: x,
        y: y,
        level: 2,
      });

      // Create connections from root to leaves
      if (i === Math.floor(pages.length / 2)) {
        connections.push({
          from: "root",
          to: `leaf-${i}`,
          fromX: rootX + 80,
          fromY: rootY + 60,
          toX: x + 80,
          toY: y - 30,
          label: tree.keys[0] ? `≥ ${tree.keys[0]}` : "",
        });
      }

      // Create connections between leaf nodes
      if (i < pages.length - 1) {
        connections.push({
          from: `leaf-${i}`,
          to: `leaf-${i + 1}`,
          fromX: x + 160,
          fromY: y + 15,
          toX: x + leafSpacing,
          toY: y + 15,
          label: "Next",
        });
      }
    });

    return { nodes, connections };
  };

  const { nodes, connections } = calculateLayout();

  // Store node positions for connection calculations
  useEffect(() => {
    const positions = {};
    nodes.forEach((node) => {
      positions[node.id] = { x: node.x + 80, y: node.y + 30 };
    });
    setNodePositions(positions);
  }, [tree, pages, width]);

  // Simulate search traversal
  const simulateSearch = (value) => {
    if (!tree || !pages) return;

    const path = ["root"];
    let currentNode = tree;

    // Traverse internal nodes
    while (!currentNode.leaf) {
      // Find appropriate child (simplified logic)
      const nextChildIndex = Math.floor(currentNode.keys.length / 2);
      path.push(`internal-${nextChildIndex}`);

      // In a real implementation, we would navigate to the actual child
      // For this demo, we're using a simplified approach
      if (currentNode.children && currentNode.children[nextChildIndex]) {
        currentNode = currentNode.children[nextChildIndex];
      } else {
        break;
      }
    }

    // Find the leaf node that would contain the value
    const leafIndex = pages.findIndex(
      (leaf) =>
        leaf.keys.some((key) => key == value) ||
        (leaf.keys.length && value <= leaf.keys[leaf.keys.length - 1])
    );

    if (leafIndex >= 0) {
      path.push(`leaf-${leafIndex}`);
    }

    return path;
  };

  const handleSearch = () => {
    if (!searchValue) return;

    const path = simulateSearch(searchValue);
    setTraversalPath(path);
    setHighlightedValue(parseInt(searchValue));
    setIsPlaying(true);
    setCurrentStep(0);

    // Animate through the traversal path
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= path.length - 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        B+ Tree Index Visualizer
      </h2>
      <p className="text-slate-600 mb-6">
        Visualize how database indexes work with this interactive B+ Tree
      </p>

      <div className="flex gap-4 mb-6 w-full max-w-2xl">
        <input
          type="number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter a value to search"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isPlaying}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? "Searching..." : "Search"}
        </button>
        <button
          onClick={() => setShowPointers(!showPointers)}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-300 transition-colors"
        >
          {showPointers ? "Hide Pointers" : "Show Pointers"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="relative w-full lg:w-2/3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <svg
            width={width}
            height={height}
            className="bg-gradient-to-br from-white to-slate-50"
          >
            {/* Draw connections first so they appear behind nodes */}
            <AnimatePresence>
              {connections.map((conn, i) => {
                const fromPos = nodePositions[conn.from];
                const toPos = nodePositions[conn.to];

                if (!fromPos || !toPos) return null;

                return (
                  <Connection
                    key={i}
                    fromX={fromPos.x}
                    fromY={fromPos.y}
                    toX={toPos.x}
                    toY={toPos.y}
                    isHighlighted={
                      traversalPath.includes(conn.to) &&
                      currentStep >= traversalPath.indexOf(conn.to)
                    }
                    label={conn.label}
                  />
                );
              })}
            </AnimatePresence>

            {/* Draw nodes */}
            <AnimatePresence>
              {nodes.map(({ id, node, x, y, level }) => (
                <NodeBox
                  key={id}
                  node={node}
                  x={x}
                  y={y}
                  isSelected={selectedNode === id}
                  isHighlighted={
                    traversalPath.includes(id) &&
                    currentStep >= traversalPath.indexOf(id)
                  }
                  onClick={() => setSelectedNode(id)}
                  showPointers={showPointers}
                />
              ))}
            </AnimatePresence>
          </svg>

          {/* Info panel */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200 max-w-xs">
            <h3 className="font-semibold text-slate-700 mb-2">B+ Tree Info</h3>
            <p className="text-sm text-slate-600">
              {tree && `Root has ${tree.keys.length} keys`}
              <br />
              {pages && `${pages.length} leaf pages`}
              <br />
              {pages &&
                `Total ${pages.reduce(
                  (acc, page) => acc + page.keys.length,
                  0
                )} data records`}
            </p>
            {highlightedValue && (
              <p className="text-sm mt-2">
                <span className="font-medium">Searching for:</span>{" "}
                {highlightedValue}
              </p>
            )}
            {selectedNode && (
              <p className="text-sm mt-2">
                <span className="font-medium">Selected:</span> {selectedNode}
              </p>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <Legend />
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        Click on any node to select it • Hover for magnification
      </div>
    </div>
  );
}
