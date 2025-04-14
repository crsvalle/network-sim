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
        stabilization: {
          iterations: 100,
          fit: true
        }
      },
      layout: {
        improvedLayout: true,
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    // after stabilization, freeze layout
    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: false }); // turn off physics
      const positions = network.getPositions();
      const updatedNodes = nodes.map(node => ({
        ...node,
        fixed: { x: true, y: true },
        x: positions[node.id]?.x,
        y: positions[node.id]?.y,
      }));
      network.setData({ nodes: updatedNodes, edges });
    });

    if (animatePath.length > 0) {
      animatePath.forEach((nodeId, index) => {
        setTimeout(() => {
          let pulseCount = 0;
          const maxPulse = 3;
          const interval = setInterval(() => {
            const size = 20 + Math.sin(pulseCount * 0.5) * 10;
            if (networkRef.current?.body?.nodes[nodeId]) {
              networkRef.current.body.nodes[nodeId].options.size = size;
              networkRef.current.redraw();
            }

            pulseCount++;
            if (pulseCount >= maxPulse * Math.PI) {
              clearInterval(interval);
            }
          }, 100);
        }, index * 800);
      });
    }

  }, [nodes, edges, animatePath]);

  return <div ref={containerRef} style={{ height: '500px', backgroundColor: '#fff' }} />;
};

export default NetworkVisualization;
