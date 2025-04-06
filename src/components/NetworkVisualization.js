import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({ nodes, edges }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: 'dot',
        size: 20,
        font: { size: 14, color: '#000' },
      },
      edges: {
        arrows: 'to',
        font: { align: 'top' },
        color: { highlight: '#ff9800' },
      },
      physics: {
        enabled: true,
        solver: 'forceAtlas2Based',  // Adjusted for forceAtlas2
        forceAtlas2Based: {
          gravitationalConstant: -26.2,  // Gravitational constant for the forceAtlas2 solver
          centralGravity: 0.01,  // Adjusted gravity to keep nodes from colliding
          springLength: 95,  // Spring length between nodes
          springConstant: 0.08,  // Spring strength
        },
        stabilization: { iterations: 100 },
        repulsion: {
          nodeDistance: 200,  // Controls the repulsion strength between nodes
          damping: 0.5,  // Adjusts the damping of node repulsion
        },
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();  // Destroy the previous network instance if any
    }

    networkRef.current = new Network(containerRef.current, data, options);

  }, [nodes, edges]);

  return <div ref={containerRef} style={{ height: '500px' }} />;
};

export default NetworkVisualization;
