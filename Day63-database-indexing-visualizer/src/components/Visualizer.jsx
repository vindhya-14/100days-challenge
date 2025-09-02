import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function NodeBox({ node, x, y, isSelected, onClick, isHighlighted }) {
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
      <foreignObject x={-80} y={-30} width={160} height={60}>
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
                {node.keys.length}
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
        </div>
      </foreignObject>
    </motion.g>
  );
}

function Connection({ fromX, fromY, toX, toY, isHighlighted }) {
  return (
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
  );
}

export default function Visualizer({ tree, pages }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedValue, setHighlightedValue] = useState(null);
  const [traversalPath, setTraversalPath] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [nodePositions, setNodePositions] = useState({});
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 500,
  });

  // Responsive container sizing
  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById("visualizer-container");
      if (container) {
        const width = Math.min(container.clientWidth, 1200);
        const height = Math.min(window.innerHeight * 0.6, 600);
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Calculate positions for all nodes
  const calculateLayout = () => {
    if (!tree || !pages) return { nodes: [], connections: [] };

    const nodes = [];
    const connections = [];
    const { width, height } = containerSize;
    const levelHeight = height / 4;

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

    // Add leaf nodes - responsive spacing based on container width
    const leafSpacing = Math.min(
      180,
      (width - 100) / Math.max(1, pages.length)
    );
    const leafStartX = (width - (pages.length - 1) * leafSpacing) / 2;

    pages.forEach((leaf, i) => {
      const x = leafStartX + i * leafSpacing;
      const y = rootY + levelHeight * 2;

      nodes.push({
        id: `leaf-${i}`,
        node: leaf,
        x: x,
        y: y,
        level: 2,
      });

      // Create connections from root to leaves (simplified for demo)
      if (i === Math.floor(pages.length / 2)) {
        connections.push({
          from: "root",
          to: `leaf-${i}`,
          fromX: width / 2,
          fromY: rootY + 60,
          toX: x + 80,
          toY: y - 30,
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
  }, [tree, pages, containerSize]);

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
    <div className="flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg w-full">
      <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 text-center">
        B+ Tree Index Visualizer
      </h2>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6 w-full max-w-2xl">
        <input
          type="number"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter a value to search"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
        />
        <button
          onClick={handleSearch}
          disabled={isPlaying}
          className="px-4 md:px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
        >
          {isPlaying ? "Searching..." : "Search"}
        </button>
      </div>

      <div
        id="visualizer-container"
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
        style={{ height: `${containerSize.height}px` }}
      >
        <svg
          width={containerSize.width}
          height={containerSize.height}
          className="bg-gradient-to-br from-white to-slate-50"
          viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
          preserveAspectRatio="xMidYMid meet"
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
              />
            ))}
          </AnimatePresence>
        </svg>

        {/* Info panel - responsive positioning */}
        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-md border border-slate-200 max-w-[160px] md:max-w-xs">
          <h3 className="font-semibold text-slate-700 mb-1 md:mb-2 text-sm md:text-base">
            B+ Tree Info
          </h3>
          <p className="text-xs md:text-sm text-slate-600">
            {tree && `Root: ${tree.keys.length} keys`}
            <br />
            {pages && `Leaves: ${pages.length}`}
            <br />
            {pages &&
              `Records: ${pages.reduce(
                (acc, page) => acc + page.keys.length,
                0
              )}`}
          </p>
          {highlightedValue && (
            <p className="text-xs md:text-sm mt-1 md:mt-2">
              <span className="font-medium">Searching:</span> {highlightedValue}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 md:mt-4 text-xs md:text-sm text-slate-500 text-center px-2">
        Click on any node to select it • Hover for magnification
        <br className="md:hidden" />
        <span className="hidden md:inline"> • </span>
        Pinch or scroll to zoom on mobile
      </div>
    </div>
  );
}
