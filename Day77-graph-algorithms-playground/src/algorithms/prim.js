export default function prim(graph) {
  const visited = new Set();
  const mst = [];
  const steps = [];

  visited.add(graph.nodes[0]);

  while (visited.size < graph.nodes.length) {
    const edges = graph.edges.filter(
      (e) => visited.has(e.from) && !visited.has(e.to)
    );
    const minEdge = edges.reduce((a, b) => (a.weight < b.weight ? a : b));
    mst.push(minEdge);
    visited.add(minEdge.to);
    steps.push({ mst: [...mst], added: minEdge });
  }

  return steps;
}
