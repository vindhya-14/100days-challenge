export function flooding(neighbors, start, target) {
  // We'll flood until we reach target; record all simple paths up to a limit
  const results = [];
  const maxPaths = 8;
  const maxDepth = 8;
  const visitedGlobal = new Set();

  function dfs(node, path, depth) {
    if (results.length >= maxPaths) return;
    if (depth > maxDepth) return;
    if (node === target) {
      results.push([...path]);
      return;
    }
    for (const edge of neighbors[node] || []) {
      const to = edge.to;
      if (path.includes(to)) continue; // avoid cycles
      path.push(to);
      dfs(to, path, depth + 1);
      path.pop();
      if (results.length >= maxPaths) return;
    }
  }

  dfs(start, [start], 0);
  // transform each path into list of hops (sequence of nodes)
  return results;
}

