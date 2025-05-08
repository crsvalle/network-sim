import { useEffect, useReducer, useState } from 'react';
import io from 'socket.io-client';
import { simulationReducer, initialState } from './simulationReducer';

const socket = io('http://localhost:8000');

export default function useNetworkSocket(activeSimId, setNodes, setEdges, setLoading, setSwitchMemory) {
  const [state, dispatch] = useReducer(simulationReducer, initialState);
  const [summaries, setSummaries] = useState({});
  const [linkUsage, setLinkUsage] = useState({});

  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges, path, colorId, simulationId }) => {
      if (!simulationId) return;

      const tag = colorId != null ? `[${colorId}] ` : '';
      dispatch({ type: 'ADD_LOG', simId: simulationId, message: tag + message });

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

      dispatch({
        type: 'ADD_METRICS',
        simId: simulationId,
        metrics: {
          pathLength: path?.length || 0,
          totalCost: safeEdges.reduce((sum, e) => sum + parseInt(e.label || 0), 0),
          retries: (state.metricsBySim[simulationId]?.retries || 0) + (message.includes('(retry') ? 1 : 0),
          drops: (state.metricsBySim[simulationId]?.drops || 0) + (message.includes('❌') ? 1 : 0),
          nodeCount: safeNodes.length,
          linkCount: safeEdges.length,
        },
      });

      dispatch({ type: 'ADD_SNAPSHOT', simId: simulationId, snapshot: safeNodes });
    });

    socket.on('switchLearningUpdate', ({ switchId, learnedTable }) => {
      setSwitchMemory(prev => ({ ...prev, [switchId]: learnedTable }));
    });

    socket.on('linkUtilizationUpdate', (usageMap) => {
      setLinkUsage(usageMap);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
      setLoading(false);
    });

    return () => {
      socket.off('networkUpdate');
      socket.off('switchLearningUpdate');
      socket.off('linkUtilizationUpdate');
      socket.off('connect_error');
    };
  }, [activeSimId, setNodes, setEdges, setLoading, setSwitchMemory, state.metricsBySim]);
  useEffect(() => {
    socket.on('simulationSummary', (data) => {
      setSummaries((prev) => ({ ...prev, [data.simulationId]: data }));
    });
  }, [socket]);

  return {
    socket,
    logs: state.logs,
    paths: state.paths,
    metricsBySim: state.metricsBySim,
    unreadCounts: state.unreadCounts,
    nodeSnapshots: state.nodeSnapshots,
    dispatch,
    linkUsage,
  };
}
