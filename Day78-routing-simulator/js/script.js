let graph = {
  A: { B: 1, C: 3 },
  B: { A: 1, C: 1, D: 4 },
  C: { A: 3, B: 1, D: 1 },
  D: { B: 4, C: 1 },
};

let nodes = ["A", "B", "C", "D"];
let routingTables = {};

function initTables() {
  nodes.forEach((node) => {
    routingTables[node] = {};
    nodes.forEach((dest) => {
      routingTables[node][dest] = dest === node ? 0 : Infinity;
    });
  });
  updateTableDisplay();
}

function updateTableDisplay() {
  let container = document.getElementById("tablesContainer");
  container.innerHTML = "";
  nodes.forEach((node) => {
    let box = document.createElement("div");
    box.className = "table-box";
    let html = `<h3>Node ${node}</h3><table>`;
    nodes.forEach((dest) => {
      html += `<tr><td>${dest}</td><td>${routingTables[node][dest]}</td></tr>`;
    });
    html += "</table>";
    box.innerHTML = html;
    container.appendChild(box);
  });
}

function highlightNode(nodeId) {
  let nodeEl = document.getElementById(nodeId);
  nodeEl.classList.add("active");
  setTimeout(() => nodeEl.classList.remove("active"), 800);
}

// Distance Vector
function distanceVectorStep() {
  let updated = false;
  nodes.forEach((u) => {
    nodes.forEach((v) => {
      if (u !== v) {
        for (let neighbor in graph[u]) {
          let cost = graph[u][neighbor] + routingTables[neighbor][v];
          if (cost < routingTables[u][v]) {
            routingTables[u][v] = cost;
            updated = true;
            highlightNode(u);
            highlightNode(neighbor);
          }
        }
      }
    });
  });
  updateTableDisplay();
  return updated;
}

function startDistanceVector() {
  initTables();
  let interval = setInterval(() => {
    let changed = distanceVectorStep();
    if (!changed) clearInterval(interval);
  }, 1000);
}

// Link State
function startLinkState() {
  initTables();
  nodes.forEach((start) => {
    let dist = {};
    let visited = {};
    nodes.forEach((n) => (dist[n] = Infinity));
    dist[start] = 0;

    while (Object.keys(visited).length < nodes.length) {
      let u = null;
      nodes.forEach((n) => {
        if (!visited[n] && (u === null || dist[n] < dist[u])) u = n;
      });
      visited[u] = true;

      for (let neighbor in graph[u]) {
        let alt = dist[u] + graph[u][neighbor];
        if (alt < dist[neighbor]) {
          dist[neighbor] = alt;
          highlightNode(u);
          highlightNode(neighbor);
        }
      }
    }

    routingTables[start] = dist;
    updateTableDisplay();
  });
}

document
  .getElementById("startDV")
  .addEventListener("click", startDistanceVector);
document.getElementById("startLS").addEventListener("click", startLinkState);
