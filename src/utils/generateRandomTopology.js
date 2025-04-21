function generateRandomTopology(numNodes, {
    maxLinksPerNode = 3,
    minWeight = 1,
    maxWeight = 10,
    ensureConnected = true
  } = {}) {
    const topology = {};
    const nodeIds = Array.from({ length: numNodes }, (_, i) => `10.0.0.${i + 1}`);
  
    // Initialize each node
    nodeIds.forEach((id) => {
      topology[id] = {};
    });
  
    // Optionally make it connected (via a spanning tree)
    if (ensureConnected) {
      for (let i = 1; i < nodeIds.length; i++) {
        const from = nodeIds[i];
        const to = nodeIds[Math.floor(Math.random() * i)];
        const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
        topology[from][to] = weight;
      }
    }
  
    // Add extra random edges
    for (let i = 0; i < nodeIds.length; i++) {
      const from = nodeIds[i];
      const neighbors = Object.keys(topology[from]);
  
      const remainingLinks = maxLinksPerNode - neighbors.length;
      for (let j = 0; j < remainingLinks; j++) {
        const to = nodeIds[Math.floor(Math.random() * nodeIds.length)];
        if (to === from || topology[from][to]) continue;
  
        const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
        topology[from][to] = weight;
      }
    }
  
    return topology;
  }
  
  export default generateRandomTopology;
  