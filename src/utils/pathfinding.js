// Heuristic function
const heuristic = (nodeA, nodeB) => {
  const dx = nodeA.coordinates.x - nodeB.coordinates.x;
  const dy = nodeA.coordinates.y - nodeB.coordinates.y;
  const df = Math.abs(nodeA.coordinates.floor - nodeB.coordinates.floor);
  return Math.sqrt(dx * dx + dy * dy) + df * 5; // Reduced penalty, actual cost connections se aayega
};

export const calculatePath = (nodes, startNode, endNode) => {
  const openSet = new Set([startNode.nodeId]);
  const closedSet = new Set(); // Added closed set for efficiency
  const cameFrom = new Map();
  const gScore = new Map(nodes.map((n) => [n.nodeId, Infinity])); // Actual cost
  const fScore = new Map(nodes.map((n) => [n.nodeId, Infinity])); // Estimated total cost

  gScore.set(startNode.nodeId, 0);
  fScore.set(startNode.nodeId, heuristic(startNode, endNode));

  while (openSet.size > 0) {
    let currentId = [...openSet].reduce((a, b) =>
      fScore.get(a) < fScore.get(b) ? a : b
    );
    const current = nodes.find((n) => n.nodeId === currentId);

    if (current.nodeId === endNode.nodeId) {
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom.get(temp.nodeId);
      }
      return path;
    }

    openSet.delete(currentId);
    closedSet.add(currentId); // Node ko closed set mein daalo

    current.connections.forEach((conn) => {
      const neighbor = nodes.find((n) => n.nodeId === conn.nodeId);
      if (!neighbor || closedSet.has(neighbor.nodeId)) return; // Skip if closed

      // Calculate total distance (horizontal + vertical)
      const verticalCost = conn.verticalDistance || 0;
      const totalDistance = conn.distance + verticalCost;

      // Transition type ke hisaab se weight adjust karo
      let transitionWeight = totalDistance;
      if (current.type === "stair") transitionWeight *= 1.5; // Stairs zyada effort
      if (current.type === "elevator") transitionWeight *= 0.8; // Elevator kam effort

      const tentativeGScore = gScore.get(currentId) + transitionWeight;

      if (tentativeGScore < gScore.get(neighbor.nodeId)) {
        cameFrom.set(neighbor.nodeId, current);
        gScore.set(neighbor.nodeId, tentativeGScore);
        fScore.set(
          neighbor.nodeId,
          tentativeGScore + heuristic(neighbor, endNode)
        );
        if (!closedSet.has(neighbor.nodeId)) openSet.add(neighbor.nodeId);
      }
    });
  }

  return []; // No path found
};

export const formatRoute = (path) => {
  return path.map((node, index) => {
    const nextNode = path[index + 1];
    let instruction = node.name;

    // Floor transition instructions
    if (nextNode && node.coordinates.floor !== nextNode.coordinates.floor) {
      if (node.type === "stair") {
        instruction += ` (Take stairs to Floor ${nextNode.coordinates.floor})`;
      } else if (node.type === "elevator") {
        instruction += ` (Take elevator to Floor ${nextNode.coordinates.floor})`;
      }
    }

    return {
      x: node.coordinates.x,
      y: node.coordinates.y,
      floor: node.coordinates.floor,
      name: instruction,
    };
  });
};