export default function dfs(graph, start) {
  const visited = new Set();
  const steps = [];

  function explore(node) {
    if (!visited.has(node)) {
      visited.add(node);
      steps.push({ visited: Array.from(visited), current: node });

      graph.edges.filter((e) => e.from === node).forEach((e) => explore(e.to));
    }
  }

  explore(start);
  return steps;
}
