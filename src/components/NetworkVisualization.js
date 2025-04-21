import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({
  nodes,
  edges,
  animatePath = [],
  nodeLabels = {},
  nodeTypes = {},
  filterPathByType = null,
}) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return;

    const typeColors = {
      router: '#f44336',
      switch: '#2196f3',
      host: '#4caf50',
      printer: '#9c27b0',
      unknown: '#9e9e9e',
    };

    const styledNodes = nodes.map((n) => {
      const type = nodeTypes[n.id] || 'unknown';
      const label = nodeLabels[n.id] || n.id;

      return {
        ...n,
        label,
        color: {
          background: typeColors[type],
          border: '#333',
        },
      };
    });

    const data = { nodes: styledNodes, edges };
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
    const filteredPath = filterPathByType
      ? animatePath.filter((nodeId) => nodeTypes[nodeId] === filterPathByType)
      : animatePath;

    if (filteredPath.length > 0) {
      filteredPath.forEach((nodeId, index) => {
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
  }, [nodes, edges, animatePath, nodeLabels, nodeTypes, filterPathByType]);

  return <div ref={containerRef} style={{ height: '500px', backgroundColor: '#fff' }} />;
};

export default NetworkVisualization;