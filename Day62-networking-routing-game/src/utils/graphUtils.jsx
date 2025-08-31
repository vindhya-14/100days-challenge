
export const sampleGraph = {
  nodes: [
    { id: "A", x: 120, y: 120 },
    { id: "B", x: 320, y: 80 },
    { id: "C", x: 520, y: 120 },
    { id: "D", x: 220, y: 300 },
    { id: "E", x: 420, y: 340 },
    { id: "F", x: 680, y: 220 },
  ],
  edges: [
    { a: "A", b: "B", w: 2 },
    { a: "B", b: "C", w: 3 },
    { a: "A", b: "D", w: 4 },
    { a: "B", b: "D", w: 1 },
    { a: "C", b: "E", w: 2 },
    { a: "D", b: "E", w: 3 },
    { a: "E", b: "F", w: 2 },
    { a: "C", b: "F", w: 5 },
  ],
};

export function neighborsFromEdges(edges) {
  const map = {};
  edges.forEach((e) => {
    if (!map[e.a]) map[e.a] = [];
    if (!map[e.b]) map[e.b] = [];
    map[e.a].push({ to: e.b, weight: e.w });
    map[e.b].push({ to: e.a, weight: e.w });
  });
  return map;
}
