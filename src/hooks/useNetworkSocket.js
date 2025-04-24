import { useEffect, useReducer, useState } from 'react';
import io from 'socket.io-client';
import { simulationReducer, initialState } from './simulationReducer';

const socket = io('http://localhost:8000');

export default function useNetworkSocket(activeSimId, setNodes, setEdges, setLoading) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  const [switchMemory, setSwitchMemory] = useState({}); // 🧠 Add switch memory state

  // Handle network updates
  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges, path, colorId, simulationId }) => {
      if (!simulationId) return;

      const tag = colorId != null ? `[${colorId}] ` : '';
      const fullMessage = tag + message;

      dispatch({ type: 'ADD_LOG', simId: simulationId, message: fullMessage });

      if (simulationId !== activeSimId) {
        dispatch({ type: 'INCREMENT_UNREAD', simId: simulationId });
      }

      if (Array.isArray(path)) {
        dispatch({ type: 'ADD_PATH', simId: simulationId, path });
      }

      const safeNodes = Array.isArray(nodes) ? nodes.filter(n => n && n.id) : [];
      const safeEdges = Array.isArray(edges) ? edges.filter(e => e && e.from && e.to) : [];

      setNodes(safeNodes);
      setEdges(safeEdges);
      setLoading(false);

      const retries = message?.includes('(retry') ? 1 : 0;
      const drops = message?.includes('❌') ? 1 : 0;

      const metrics = {
        pathLength: safeNodes.filter(n => n.color === '#4caf50' || n.color === '#f44336').length,
        totalCost: safeEdges
          .filter(e => e.color?.color === '#4caf50')
          .reduce((sum, e) => sum + parseInt(e.label), 0),
        retries,
        drops,
        nodeCount: safeNodes.length,
        linkCount: safeEdges.length,
      };

      dispatch({ type: 'ADD_METRICS', simId: simulationId, metrics });
      dispatch({ type: 'ADD_SNAPSHOT', simId: simulationId, snapshot: safeNodes });
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      setLoading(false);
    });

    return () => {
      socket.off('networkUpdate');
      socket.off('connect_error');
    };
  }, [activeSimId, setNodes, setEdges, setLoading]);

  // 🧠 Handle switch learning updates
  useEffect(() => {
    socket.on('switchLearningUpdate', ({ switchId, learnedTable }) => {
      setSwitchMemory((prev) => ({
        ...prev,
        [switchId]: learnedTable,
      }));
    });

    return () => {
      socket.off('switchLearningUpdate');
    };
  }, []);

  return {
    socket,
    logs: state.logs,
    paths: state.paths,
    metricsBySim: state.metricsBySim,
    unreadCounts: state.unreadCounts,
    nodeSnapshots: state.nodeSnapshots,
    switchMemory,
    dispatch,
  };
}
