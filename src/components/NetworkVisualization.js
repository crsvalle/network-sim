import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({ nodes, edges, nodeLabels = {}, animatePath = [] }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return;

    const labeledNodes = nodes.map((node) => {
      const labelType = nodeLabels[node.id] || '';
      const labelSuffix = labelType ? ` (${labelType})` : '';
      return {
        ...node,
        label: `${node.id}${labelSuffix}`,
      };
    });

    const data = { nodes: labeledNodes, edges };
    const animationIntervals = [];

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
        enabled: false,
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    networkRef.current = new Network(containerRef.current, data, options);

    const originalSizes = {};

    if (animatePath.length > 0) {
      animatePath.forEach((nodeId, index) => {
        const timeoutId = setTimeout(() => {
          let pulseCount = 0;
          const maxPulse = 3;
          const intervalId = setInterval(() => {
            const size = 20 + Math.sin(pulseCount * 0.5) * 10;

            if (networkRef.current?.body?.nodes[nodeId]) {
              const node = networkRef.current.body.nodes[nodeId];

              if (!(nodeId in originalSizes)) {
                originalSizes[nodeId] = node.options.size;
              }

              node.options.size = size;
              networkRef.current.redraw();
            }

            pulseCount++;
            if (pulseCount >= maxPulse * Math.PI) {
              clearInterval(intervalId);
              if (networkRef.current?.body?.nodes[nodeId]) {
                networkRef.current.body.nodes[nodeId].options.size = originalSizes[nodeId] || 20;
                networkRef.current.redraw();
              }
            }
          }, 100);

          animationIntervals.push(intervalId);
        }, index * 800);

        animationIntervals.push(timeoutId);
      });
    }

    return () => {
      animationIntervals.forEach(clearTimeout);
      animationIntervals.forEach(clearInterval);
    };
  }, [nodes, edges, animatePath, nodeLabels]);

  return <div ref={containerRef} style={{ height: '500px', backgroundColor: '#fff' }} />;
};

export default NetworkVisualization;
