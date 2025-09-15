export default function dijkstra(graph, start) {
  const dist = {};
  graph.nodes.forEach((n) => (dist[n] = Infinity));
  dist[start] = 0;

  const visited = new Set();
  const steps = [];

  while (visited.size < graph.nodes.length) {
    const u = Object.keys(dist)
      .filter((n) => !visited.has(n))
      .reduce((a, b) => (dist[a] < dist[b] ? a : b));

    visited.add(u);
    steps.push({ dist: { ...dist }, current: u });

    graph.edges
      .filter((e) => e.from === u)
      .forEach((e) => {
        if (dist[u] + e.weight < dist[e.to]) {
          dist[e.to] = dist[u] + e.weight;
        }
      });
  }

  return steps;
}
