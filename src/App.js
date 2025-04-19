import { useState } from 'react';
import NetworkVisualization from './components/NetworkVisualization';
import TopologyEditor from './components/TopologyEditor';
import NodeSelector from './components/NodeSelector';
import TabbedMessagePanel from './components/TabbedMessagePanel';
import GraphMetrics from './components/GraphMetrics';
import useNetworkSocket from './hooks/useNetworkSocket';
import useSendMessage from './hooks/useSendMessage';
import useReplaySimulation from './hooks/useReplaySimulation';

const COLORS = ['#e91e63', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

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
  const [activeSimId, setActiveSimId] = useState(null);

  const {
    socket,
    logs,
    paths,
    metricsBySim,
    unreadCounts,
    nodeSnapshots,
  } = useNetworkSocket(activeSimId, setNodes, setEdges, setLoading);

  const sendMessage = useSendMessage({
    socket,
    graph,
    sourceNode,
    destinationNode,
    pathsInFlight,
    setPathsInFlight,
    setPacketColors,
    COLORS,
  });

  const { replayState, replaySimulation } = useReplaySimulation(nodeSnapshots, setNodes);

  const onCloseTab = (simId) => {
    // clean up per-simulation data
    ['logs', 'paths', 'metricsBySim', 'unreadCounts', 'nodeSnapshots'].forEach((key) => {
      const setter = {
        logs: () => socket.setLogs,
        paths: () => socket.setPaths,
        metricsBySim: () => socket.setMetricsBySim,
        unreadCounts: () => socket.setUnreadCounts,
        nodeSnapshots: () => socket.setNodeSnapshots,
      }[key];

      setter((prev) => {
        const updated = { ...prev };
        delete updated[simId];
        return updated;
      });
    });

    if (simId === activeSimId) {
      const remaining = Object.keys(logs).filter((id) => id !== simId);
      setActiveSimId(remaining[0] || null);
    }
  };

  const currentMetrics = metricsBySim[activeSimId] || {
    pathLength: 0,
    totalCost: 0,
    retries: 0,
    drops: 0,
    nodeCount: 0,
    linkCount: 0,
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
        <button onClick={sendMessage} disabled={pathsInFlight.length >= 2}>
          {pathsInFlight.length >= 2 ? '⏳ Sending...' : '📤 Send Message'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            <NetworkVisualization nodes={nodes} edges={edges} animatePath={Object.values(paths)} />
            {replayState.simId && (
              <div style={{ marginTop: '10px', textAlign: 'center' }}>
                🕒 Step {replayState.index + 1} / {nodeSnapshots[replayState.simId]?.length || 0}
              </div>
            )}
          </div>
          <div style={{ width: '450px' }}>
            <TabbedMessagePanel
              logs={logs}
              packetColors={packetColors}
              setActiveSimId={setActiveSimId}
              activeSimId={activeSimId}
              unreadCounts={unreadCounts}
              setUnreadCounts={() => {}}
              onCloseTab={onCloseTab}
              replaySimulation={replaySimulation}
            />
            <GraphMetrics metrics={currentMetrics} activeSimId={activeSimId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
