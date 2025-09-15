export default function kruskal(graph) {
  const parent = {};
  graph.nodes.forEach((n) => (parent[n] = n));

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a, b) {
    parent[find(a)] = find(b);
  }

  const edges = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const mst = [];
  const steps = [];

  for (const e of edges) {
    if (find(e.from) !== find(e.to)) {
      union(e.from, e.to);
      mst.push(e);
      steps.push({ mst: [...mst], added: e });
    }
  }

  return steps;
}
