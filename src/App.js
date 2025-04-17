import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import NetworkVisualization from './components/NetworkVisualization';
import TopologyEditor from './components/TopologyEditor';
import NodeSelector from './components/NodeSelector';
import TabbedMessagePanel from './components/TabbedMessagePanel';
import GraphMetrics from './components/GraphMetrics';

const socket = io('http://localhost:8000');
const MAX_PARALLEL_MESSAGES = 2;

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graph, setGraph] = useState({
    '192.168.1.1': { '192.168.1.2': 1, '192.168.1.3': 4 },
    '192.168.1.2': { '192.168.1.3': 2, '192.168.1.4': 5 },
    '192.168.1.3': { '192.168.1.4': 1 },
    '192.168.1.4': {},
  });

  const [sourceNode, setSourceNode] = useState('');
  const [destinationNode, setDestinationNode] = useState('');
  const [loading, setLoading] = useState(true);
  const [pathsInFlight, setPathsInFlight] = useState([]);
  const [packetColors, setPacketColors] = useState({});
  const [logs, setLogs] = useState({});
  const [paths, setPaths] = useState({});

  const [metricsBySimId, setMetricsBySimId] = useState({});
  const [activeSimId, setActiveSimId] = useState(null);

  const COLORS = ['#e91e63', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges, path, colorId, simulationId }) => {
      if (!simulationId) return;

      const tag = colorId != null ? `[${colorId}] ` : '';
      const fullMessage = tag + message;

      setLogs((prev) => ({
        ...prev,
        [simulationId]: [...(prev[simulationId] || []), fullMessage],
      }));

      if (Array.isArray(path)) {
        setPaths((prev) => ({
          ...prev,
          [simulationId]: path,
        }));
      }

      const safeNodes = Array.isArray(nodes) ? nodes.filter(n => n && n.id) : [];
      const safeEdges = Array.isArray(edges) ? edges.filter(e => e && e.from && e.to) : [];

      setNodes(safeNodes);
      setEdges(safeEdges);
      setLoading(false);

      const retries = message?.includes('(retry') ? 1 : 0;
      const drops = message?.includes('❌') ? 1 : 0;

      setMetricsBySimId((prev) => ({
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
        }
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
  }, []);

  const sendMessage = () => {
    if (pathsInFlight.length >= MAX_PARALLEL_MESSAGES) {
      alert('Please wait – packet limit reached.');
      return;
    }

    if (!sourceNode || !destinationNode) {
      alert('Please select both source and destination.');
      return;
    }

    if (!graph[sourceNode] || !graph[destinationNode]) {
      alert('Selected nodes do not exist in the graph.');
      return;
    }

    if (sourceNode === destinationNode) {
      alert('Source and destination cannot be the same.');
      return;
    }

    const newId = pathsInFlight.length;
    const assignedColor = COLORS[newId % COLORS.length];

    setPathsInFlight((prev) => [...prev, newId]);
    setPacketColors((prev) => ({ ...prev, [newId]: assignedColor }));

    socket.emit('sendMessage', {
      from: sourceNode,
      to: destinationNode,
      graph,
      colorId: newId,
    });

    setTimeout(() => {
      setPathsInFlight((prev) => prev.filter((id) => id !== newId));
    }, 6000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>📡 Network Simulation</h1>

      <TopologyEditor graph={graph} setGraph={setGraph} />

      <NodeSelector
        graph={graph}
        sourceNode={sourceNode}
        destinationNode={destinationNode}
        setSourceNode={setSourceNode}
        setDestinationNode={setDestinationNode}
      />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={sendMessage} disabled={pathsInFlight.length >= MAX_PARALLEL_MESSAGES}>
          {pathsInFlight.length >= MAX_PARALLEL_MESSAGES ? '⏳ Sending...' : '📤 Send Message'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            <NetworkVisualization
              nodes={nodes}
              edges={edges}
              animatePath={Object.values(paths)}
            />
          </div>
          <div style={{ width: '450px' }}>
            <TabbedMessagePanel
              logs={logs}
              packetColors={packetColors}
              setActiveSimId={setActiveSimId}
            />
            <GraphMetrics metrics={metricsBySimId[activeSimId] || {}} />

          </div>
        </div>
      )}
    </div>
  );
}

export default App;
