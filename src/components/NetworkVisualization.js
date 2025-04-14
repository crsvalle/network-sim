import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({ nodes, edges, animatePath = [] }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return;

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
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -26.2,
          centralGravity: 0.01,
          springLength: 95,
          springConstant: 0.08,
        },
        stabilization: { iterations: 100 },
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(containerRef.current, data, options);

    if (animatePath.length > 0) {
      animatePath.forEach((nodeId, index) => {
        setTimeout(() => {
          const x = index * 100;
          const y = 0;
          

          if (networkRef.current?.moveNode) {
            networkRef.current.moveNode(nodeId, x, y);
          }
        }, index * 600);
      });
    }

  }, [nodes, edges, animatePath]);

  return <div ref={containerRef} style={{ height: '500px', backgroundColor: '#fff' }} />;
};

export default NetworkVisualization;
