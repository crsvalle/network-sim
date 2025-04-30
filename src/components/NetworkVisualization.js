
import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({ nodes, edges, animatePath = [], nodeLabels = {}, linkUsage = {} }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return;

    const styledEdges = edges.map(edge => {
      const usageKey = `${edge.from}-${edge.to}`;
      const usageCount = linkUsage[usageKey] || 0;
      let color = '#848484';

      if (usageCount > 10) color = '#e53935';       // high traffic
      else if (usageCount > 5) color = '#fb8c00';    // medium traffic
      else if (usageCount > 0) color = '#43a047';    // light traffic

      return {
        ...edge,
        color: { color },
        label: `${edge.label || ''} (${usageCount})`,
      };
    });

    const styledNodes = nodes.map((n) => ({
      ...n,
      label: `${n.id}${nodeLabels[n.id] ? ` (${nodeLabels[n.id]})` : ''}`,
    }));

    const data = { nodes: styledNodes, edges: styledEdges };
    const options = {
      nodes: { shape: 'dot', size: 20, font: { size: 14, color: '#000' } },
      edges: { arrows: 'to', font: { align: 'top' } },
      physics: { enabled: false },
    };

    if (networkRef.current) networkRef.current.destroy();
    networkRef.current = new Network(containerRef.current, data, options);

  }, [nodes, edges, animatePath, nodeLabels, linkUsage]);

  return <div ref={containerRef} style={{ height: '500px', backgroundColor: '#fff' }} />;
};

export default NetworkVisualization;
