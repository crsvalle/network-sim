import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';

const getEdgeColor = (usage) => {
  if (usage >= 20) return '#d32f2f'; // red
  if (usage >= 10) return '#f57c00'; // orange
  if (usage >= 5) return '#fbc02d';  // yellow
  return '#4caf50';                 // green
};

const NetworkVisualization = ({
  nodes,
  edges,
  animatePath,
  nodeLabels,
  linkUsage,
}) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || nodes.length === 0) return;

    const formattedNodes = nodes.map((node) => ({
      id: node.id,
      label: nodeLabels?.[node.id] || node.label || node.id,
      color: node.color || '#97C2FC',
    }));

    const formattedEdges = edges.map((edge) => {
      const usageKey = `${edge.from}->${edge.to}`;
      const usage = linkUsage?.[usageKey] || 0;

      return {
        from: edge.from,
        to: edge.to,
        arrows: 'to',
        label: edge.label?.toString() || '',
        color: { color: getEdgeColor(usage) },
        smooth: true,
      };
    });

    const data = {
      nodes: formattedNodes,
      edges: formattedEdges,
    };

    const options = {
      nodes: {
        shape: 'dot',
        size: 15,
        font: { size: 14 },
      },
      edges: {
        font: { align: 'top' },
        width: 2,
      },
      physics: false,
    };

    if (networkRef.current) {
      networkRef.current.setData(data);
    } else {
      networkRef.current = new Network(containerRef.current, data, options);
    }
  }, [nodes, edges, nodeLabels, linkUsage]);

  return (
    <div
      ref={containerRef}
      style={{ height: '500px', border: '1px solid #ddd', borderRadius: '6px' }}
    />
  );
};

export default NetworkVisualization;
