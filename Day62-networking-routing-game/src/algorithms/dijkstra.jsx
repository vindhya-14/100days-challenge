export function dijkstra(neighbors, start, target) {
  const dist = {};
  const prev = {};
  const Q = new Set(Object.keys(neighbors));
  for (const v of Q) {
    dist[v] = Infinity;
    prev[v] = null;
  }
  dist[start] = 0;

  while (Q.size) {
    // extract min
    let u = null;
    for (const v of Q) {
      if (u === null || dist[v] < dist[u]) u = v;
    }
    if (u === null) break;
    Q.delete(u);
    if (u === target) break;

    for (const edge of neighbors[u] || []) {
      const alt = dist[u] + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = u;
      }
    }
  }

  // build path
  const path = [];
  let u = target;
  while (u) {
    path.unshift(u);
    u = prev[u];
  }
  if (path[0] !== start) return null;
  return path;
}
