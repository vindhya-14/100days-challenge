import bfs from "../algorithms/bfs";
import dfs from "../algorithms/dfs";
import dijkstra from "../algorithms/dijkstra";
import kruskal from "../algorithms/kruskal";
import prim from "../algorithms/prim";

export default function Controls({ onRun }) {
  const graph = {
    nodes: ["A", "B", "C", "D", "E"],
    edges: [
      { from: "A", to: "B", weight: 2 },
      { from: "A", to: "C", weight: 4 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 7 },
      { from: "C", to: "E", weight: 3 },
      { from: "D", to: "E", weight: 2 },
    ],
  };

  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => onRun(bfs(graph, "A"))}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        BFS
      </button>
      <button
        onClick={() => onRun(dfs(graph, "A"))}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg"
      >
        DFS
      </button>
      <button
        onClick={() => onRun(dijkstra(graph, "A"))}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Dijkstra
      </button>
      <button
        onClick={() => onRun(kruskal(graph))}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
      >
        Kruskal
      </button>
      <button
        onClick={() => onRun(prim(graph))}
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
      >
        Prim
      </button>
    </div>
  );
}
