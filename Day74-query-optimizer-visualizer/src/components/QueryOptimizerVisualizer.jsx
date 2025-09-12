import React, { useState, useMemo } from "react";

/*
  Query Optimizer Visualizer
  - Parses a simple SQL query with JOINs
  - Shows left-deep (default) query tree
  - Applies a greedy join reordering optimization
  - Visualizes both as SVG trees
*/

// --- Parsing Helpers ---
function parseSimpleSQL(sql) {
  const fromMatch = sql.match(/from\s+([\s\S]*?)(where|group|order|$)/i);
  if (!fromMatch) return { tables: [] };
  let fromPart = fromMatch[1].trim();

  if (/join/i.test(fromPart)) {
    const parts = fromPart.split(/\bjoin\b/i);
    const tables = [];
    let first = parts[0].trim();
    if (first) {
      first.split(/,\s*/).forEach((t) => tables.push({ raw: t.trim() }));
    }
    for (let i = 1; i < parts.length; i++) {
      const rest = parts[i];
      const onMatch = rest.match(/(.*?)\s+on\s+(.*)/i);
      if (onMatch) {
        tables.push({ raw: onMatch[1].trim(), on: onMatch[2].trim() });
      } else {
        tables.push({ raw: rest.trim() });
      }
    }
    return { tables };
  } else {
    const tables = fromPart.split(/,\s*/).map((t) => ({ raw: t.trim() }));
    return { tables };
  }
}

function parseTableToken(raw) {
  raw = raw.replace(/,$/, "").trim();
  const m = raw.match(/([\w.]+)(?:\s+(?:as\s+)?([\w]+))?/i);
  if (!m) return { name: raw, alias: raw };
  return { name: m[1], alias: m[2] || m[1] };
}

// --- Tree Builders ---
function buildLeftDeepTree(tables) {
  if (tables.length === 0) return null;
  let node = { type: "table", ...tables[0] };
  for (let i = 1; i < tables.length; i++) {
    node = {
      type: "join",
      left: node,
      right: { type: "table", ...tables[i] },
      joinCond: tables[i].on || null,
    };
  }
  return node;
}

function greedyReorder(tablesWithStats) {
  let forest = tablesWithStats.map((t) => ({
    type: "table",
    name: t.name,
    alias: t.alias,
    rows: t.rows ?? 1000,
    raw: t.raw,
  }));
  if (forest.length <= 1) return forest[0] || null;

  while (forest.length > 1) {
    let bestI = 0,
      bestJ = 1,
      bestCost = Infinity;
    for (let i = 0; i < forest.length; i++) {
      for (let j = i + 1; j < forest.length; j++) {
        const cost = (forest[i].rows || 1) * (forest[j].rows || 1);
        if (cost < bestCost) {
          bestCost = cost;
          bestI = i;
          bestJ = j;
        }
      }
    }
    const a = forest[bestI];
    const b = forest[bestJ];
    const joined = {
      type: "join",
      left: a,
      right: b,
      estRows: Math.max(1, Math.floor(((a.rows || 1) * (b.rows || 1)) / 1000)),
    };
    forest.splice(bestJ, 1);
    forest.splice(bestI, 1);
    forest.push(joined);
  }

  return forest[0];
}

// --- Layout + SVG Renderer ---
function layoutTree(
  root,
  startX = 20,
  startY = 20,
  levelGap = 100,
  siblingGap = 20
) {
  let positions = [];
  function measure(node) {
    if (!node) return { width: 80, height: 40 };
    if (node.type === "table") return { width: 120, height: 40 };
    const left = measure(node.left);
    const right = measure(node.right);
    return {
      width: left.width + siblingGap + right.width,
      height: left.height + levelGap,
    };
  }
  function assign(node, x, y) {
    if (!node) return;
    if (node.type === "table") {
      positions.push({ node, x, y });
      return;
    }
    const leftSize = measure(node.left);
    const rightSize = measure(node.right);
    const leftX = x;
    const rightX = x + leftSize.width + siblingGap;
    positions.push({
      node,
      x: x + (leftSize.width + siblingGap + rightSize.width) / 2 - 60,
      y,
    });
    assign(node.left, leftX, y + levelGap);
    assign(node.right, rightX, y + levelGap);
  }
  assign(root, startX, startY);
  return positions;
}

function TreeSVG({ root, width = 700, height = 260, title }) {
  if (!root) return <div className="text-sm italic text-gray-500">No tree</div>;
  const positions = layoutTree(root, 10, 10, 90, 20);
  const findPos = (n) => positions.find((p) => p.node === n);

  return (
    <div className="bg-white border rounded-lg shadow-md p-4">
      <h4 className="font-semibold text-blue-700 mb-2 text-center">{title}</h4>
      <svg width={width} height={height} className="mx-auto">
        {positions.map((p, idx) => {
          const n = p.node;
          if (n.type === "join") {
            const leftPos = findPos(n.left);
            const rightPos = findPos(n.right);
            if (!leftPos || !rightPos) return null;
            const x1 = p.x + 60,
              y1 = p.y + 20;
            return (
              <g key={idx}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={leftPos.x + 60}
                  y2={leftPos.y}
                  stroke="#4B5563"
                  strokeWidth="2"
                />
                <line
                  x1={x1}
                  y1={y1}
                  x2={rightPos.x + 60}
                  y2={rightPos.y}
                  stroke="#4B5563"
                  strokeWidth="2"
                />
              </g>
            );
          }
          return null;
        })}

        {positions.map((p, idx) => {
          const n = p.node;
          if (n.type === "table") {
            return (
              <g key={idx}>
                <rect
                  x={p.x}
                  y={p.y}
                  width={120}
                  height={40}
                  rx={8}
                  ry={8}
                  fill="#F3F4F6"
                  stroke="#1F2937"
                  strokeWidth="1.5"
                />
                <text
                  x={p.x + 60}
                  y={p.y + 16}
                  fontSize={12}
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#111827"
                >
                  {n.alias || n.name}
                </text>
                <text
                  x={p.x + 60}
                  y={p.y + 32}
                  fontSize={10}
                  textAnchor="middle"
                  fill="#4B5563"
                >
                  {n.rows ? `${n.rows} rows` : n.name}
                </text>
              </g>
            );
          }
          return (
            <g key={idx}>
              <rect
                x={p.x}
                y={p.y}
                width={120}
                height={40}
                rx={8}
                ry={8}
                fill="#EFF6FF"
                stroke="#1D4ED8"
                strokeWidth="1.5"
              />
              <text
                x={p.x + 60}
                y={p.y + 18}
                fontSize={12}
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
                fill="#1D4ED8"
              >
                JOIN
              </text>
              {n.estRows ? (
                <text
                  x={p.x + 60}
                  y={p.y + 32}
                  fontSize={10}
                  textAnchor="middle"
                  fill="#4B5563"
                >
                  {n.estRows.toLocaleString()} est. rows
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Statistics and Cost Calculation ---
function calculateCost(tree) {
  if (!tree) return 0;
  if (tree.type === "table") return tree.rows || 1000;
  return calculateCost(tree.left) * calculateCost(tree.right);
}

function TreeStats({ tree, title }) {
  if (!tree) return null;

  const cost = calculateCost(tree);

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border">
      <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-600">Estimated Cost:</div>
        <div className="font-mono font-bold">{cost.toLocaleString()}</div>
        <div className="text-gray-600">Join Order:</div>
        <div className="font-mono text-xs">
          {extractJoinOrder(tree).join(" → ")}
        </div>
      </div>
    </div>
  );
}

function extractJoinOrder(tree) {
  if (!tree) return [];
  if (tree.type === "table") return [tree.alias || tree.name];
  return [...extractJoinOrder(tree.left), ...extractJoinOrder(tree.right)];
}

// --- Main Component ---
export default function QueryOptimizerVisualizer() {
  const [sql, setSql] = useState(
    `SELECT *\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items i ON i.order_id = o.id\nJOIN products p ON p.id = i.product_id`
  );

  const [tableStats, setTableStats] = useState({
    orders: 50000,
    customers: 2000,
    order_items: 150000,
    products: 800,
  });

  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState("visual");

  const parsed = useMemo(() => {
    const p = parseSimpleSQL(sql);
    return p.tables.map((t) => {
      const parsed = parseTableToken(t.raw || "");
      return { ...parsed, raw: t.raw, on: t.on };
    });
  }, [sql]);

  const leftTree = useMemo(() => buildLeftDeepTree(parsed), [parsed]);

  const treeWithStats = useMemo(() => {
    return parsed.map((t) => ({
      ...t,
      rows: tableStats[t.name] ?? tableStats[t.alias] ?? 1000,
    }));
  }, [parsed, tableStats]);

  const optimizedTree = useMemo(
    () => greedyReorder(treeWithStats),
    [treeWithStats]
  );

  function updateStat(tableName, value) {
    setTableStats((prev) => ({
      ...prev,
      [tableName]: Math.max(1, Number(value) || 1),
    }));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Query Optimization Visualizer
          </h1>
          <p className="text-gray-600 mb-6">
            Enter a simple SQL query with JOINs. Adjust row counts to see how
            the optimizer changes the join order and affects query performance.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-blue-800 mb-2">
                  SQL Query
                </label>
                <textarea
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  rows={8}
                  className="w-full p-3 border border-blue-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter SQL query with JOINs..."
                />
              </div>

              <div className="bg-white border rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Table Statistics
                  </label>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    {showStats ? "Hide" : "Show"}
                  </button>
                </div>

                {showStats && (
                  <div className="space-y-3">
                    {parsed.map((t) => (
                      <div
                        key={t.alias}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                      >
                        <div className="w-28 text-sm font-medium text-gray-700">
                          {t.name}
                        </div>
                        <input
                          type="number"
                          value={
                            tableStats[t.name] ?? tableStats[t.alias] ?? 1000
                          }
                          onChange={(e) => updateStat(t.name, e.target.value)}
                          className="p-2 border rounded w-24 text-sm focus:ring-2 focus:ring-blue-500"
                          min="1"
                        />
                        <div className="text-xs text-gray-500 flex-1">
                          as {t.alias}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
                <div className="flex border-b mb-4">
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "visual"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("visual")}
                  >
                    Visualization
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "analysis"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("analysis")}
                  >
                    Cost Analysis
                  </button>
                </div>

                {activeTab === "visual" ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TreeSVG
                      root={leftTree}
                      title="Left-Deep Tree (Original)"
                    />
                    <TreeSVG
                      root={optimizedTree}
                      title="Optimized Tree (Greedy Algorithm)"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <TreeStats
                      tree={leftTree}
                      title="Left-Deep Tree Statistics"
                    />
                    <TreeStats
                      tree={optimizedTree}
                      title="Optimized Tree Statistics"
                    />

                    <div className="xl:col-span-2 bg-blue-50 p-4 rounded-lg mt-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Optimization Summary
                      </h4>
                      <div className="text-sm text-gray-700">
                        <p>
                          The greedy algorithm selects the join order with the
                          smallest intermediate result size at each step,
                          reducing the overall query cost from{" "}
                          <span className="font-bold">
                            {calculateCost(leftTree).toLocaleString()}
                          </span>{" "}
                          to{" "}
                          <span className="font-bold">
                            {calculateCost(optimizedTree).toLocaleString()}
                          </span>
                          .
                        </p>
                        <p className="mt-2">
                          This represents a{" "}
                          <span className="font-bold">
                            {Math.round(
                              (1 -
                                calculateCost(optimizedTree) /
                                  calculateCost(leftTree)) *
                                100
                            )}
                            %
                          </span>{" "}
                          reduction in estimated cost.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  How It Works
                </h4>
                <ul className="text-sm text-yellow-700 list-disc pl-5 space-y-1">
                  <li>
                    The greedy algorithm selects joins with the smallest
                    intermediate results first
                  </li>
                  <li>
                    Table statistics influence the join order optimization
                  </li>
                  <li>
                    Smaller tables are joined first to minimize intermediate
                    result sizes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
