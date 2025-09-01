// A lightweight B-Tree-like simulation for visualization
export function createNode(keys = [], children = [], leaf = true) {
  return { id: Math.random().toString(36).slice(2, 9), keys, children, leaf };
}

export function buildBTreeFromKeys(sortedKeys, maxKeys = 3) {
  // Split keys into pages (simplified B-Tree leaf nodes)
  const nodes = [];
  for (let i = 0; i < sortedKeys.length; i += maxKeys) {
    nodes.push(createNode(sortedKeys.slice(i, i + maxKeys), [], true));
  }

  if (nodes.length <= 1) {
    return { root: nodes[0] || createNode([], [], true), nodes };
  }

  // Internal root referencing leaves
  const rootKeys = nodes.map((n) => n.keys[0]).slice(1);
  const root = createNode(
    rootKeys,
    nodes.map((n) => n.id),
    false
  );

  return { root, nodes };
}
