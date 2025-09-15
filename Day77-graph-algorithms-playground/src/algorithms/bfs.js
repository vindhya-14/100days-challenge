export default function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const steps = [];

  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.has(node)) {
      visited.add(node);
      steps.push({ visited: Array.from(visited), current: node });

      graph.edges
        .filter((e) => e.from === node)
        .forEach((e) => queue.push(e.to));
    }
  }

  return steps;
}
