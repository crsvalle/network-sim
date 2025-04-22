import { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({ nodes, edges, nodeLabels = {}, animatePath = [] }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return;

    console.log('Received animatePath:', animatePath); // Debugging

    const labeledNodes = nodes.map((node) => {
      const labelType = nodeLabels[node.id] || '';
      const labelSuffix = labelType ? ` (${labelType})` : '';
      return {
        ...node,
        label: `${node.id}${labelSuffix}`,
      };
    });

    const labeledEdges = edges.map((edge) => ({
      ...edge,
      id: `${edge.from}-${edge.to}`,
      label: String(edge.label || ''), // Show weights
      font: { align: 'top' },
      color: { color: '#848484' }, // Default edge color
    }));

    const data = { nodes: labeledNodes, edges: labeledEdges };
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
    const originalEdgeColors = {};


    const pathToAnimate = animatePath.length > 0
      ? animatePath
      : ["10.0.0.1", "10.0.1.1", "10.0.1.2"]; // Test path

    if (pathToAnimate.length > 0) {
      pathToAnimate.forEach((nodeId, index) => {
        const timeoutId = setTimeout(() => {
          const nextNodeId = pathToAnimate[index + 1];

          // Highlight edge between current and next node
          if (nodeId && nextNodeId) {
            const edgeId = `${nodeId}-${nextNodeId}`;
            const edge = networkRef.current.body.edges[edgeId];
            if (edge && !originalEdgeColors[edgeId]) {
              originalEdgeColors[edgeId] = edge.options.color.color;
            }

            if (edge) {
              networkRef.current.body.data.edges.update({
                id: edgeId,
                color: { color: '#4caf50' }, // Green highlight
              });
            }
          }

          // Pulse node
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

              // Reset edge color after pulse
              if (nodeId && nextNodeId) {
                const edgeId = `${nodeId}-${nextNodeId}`;
                const originalColor = originalEdgeColors[edgeId] || '#848484';
                networkRef.current.body.data.edges.update({
                  id: edgeId,
                  color: { color: originalColor },
                });
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
