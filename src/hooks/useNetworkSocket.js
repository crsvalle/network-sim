import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

export default function useNetworkSocket(activeSimId, setNodes, setEdges, setLoading) {
  const [logs, setLogs] = useState({});
  const [paths, setPaths] = useState({});
  const [metricsBySim, setMetricsBySim] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [nodeSnapshots, setNodeSnapshots] = useState({});


  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges, path, colorId, simulationId }) => {
      if (!simulationId) return;

      const tag = colorId != null ? `[${colorId}] ` : '';
      const fullMessage = tag + message;

      setLogs(prev => ({
        ...prev,
        [simulationId]: [...(prev[simulationId] || []), fullMessage],
      }));

      if (simulationId !== activeSimId) {
        setUnreadCounts(prev => ({
          ...prev,
          [simulationId]: (prev[simulationId] || 0) + 1,
        }));
      }

      if (Array.isArray(path)) {
        setPaths(prev => ({ ...prev, [simulationId]: path }));
      }

      const safeNodes = Array.isArray(nodes) ? nodes.filter(n => n && n.id) : [];
      const safeEdges = Array.isArray(edges) ? edges.filter(e => e && e.from && e.to) : [];

      setNodes(safeNodes);
      setEdges(safeEdges);
      setLoading(false);

      const retries = message?.includes('(retry') ? 1 : 0;
      const drops = message?.includes('❌') ? 1 : 0;

      setMetricsBySim(prev => ({
        ...prev,
        [simulationId]: {
          pathLength: safeNodes.filter(n => n.color === '#4caf50' || n.color === '#f44336').length,
          totalCost: safeEdges
            .filter(e => e.color?.color === '#4caf50')
            .reduce((sum, e) => sum + parseInt(e.label), 0),
          retries: (prev[simulationId]?.retries || 0) + retries,
          drops: (prev[simulationId]?.drops || 0) + drops,
          nodeCount: safeNodes.length,
          linkCount: safeEdges.length,
        },
      }));

      setNodeSnapshots(prev => ({
        ...prev,
        [simulationId]: [...(prev[simulationId] || []), safeNodes],
      }));
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      setLoading(false);
    });

    return () => {
      socket.off('networkUpdate');
      socket.off('connect_error');
    };
    // eslint-disable-next-line
  }, [activeSimId]);

  return {
    socket,
    logs,
    paths,
    metricsBySim,
    unreadCounts,
    nodeSnapshots,
  };
}
