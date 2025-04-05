import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network/peer';

const NetworkVisualization = ({ nodes, edges }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const data = { nodes, edges };
    const options = {
      nodes: {
        shape: 'dot',
        size: 15,
      },
      edges: {
        arrows: 'to',
      },
      physics: {
        enabled: true,
      },
    };

    // Create a new network visualization
    new Network(container, data, options);
  }, [nodes, edges]);

  return <div ref={containerRef} style={{ height: '500px' }} />;
};

export default NetworkVisualization;
