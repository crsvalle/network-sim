import { useState, useCallback } from 'react';
import NetworkVisualization from './components/NetworkVisualization';
import TopologyEditor from './components/TopologyEditor';
import NodeSelector from './components/NodeSelector';
import TabbedMessagePanel from './components/TabbedMessagePanel';
import GraphMetrics from './components/GraphMetrics';
import SwitchMemoryPanel from './components/SwitchMemoryPanel';
import useNetworkSocket from './hooks/useNetworkSocket';
import useSendMessage from './hooks/useSendMessage';
import useReplaySimulation from './hooks/useReplaySimulation';
import { defaultTopology, defaultLabels } from './constants/defaultTopology';

const COLORS = ['#e91e63', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];

function App() {
  const [nodesState, setNodesState] = useState([]);
  const [edgesState, setEdgesState] = useState([]);
  const [sourceNode, setSourceNode] = useState('');
  const [destinationNode, setDestinationNode] = useState('');
  const [loadingState, setLoadingState] = useState(true);
  const [pathsInFlight, setPathsInFlight] = useState([]);
  const [packetColors, setPacketColors] = useState({});
  const [activeSimId, setActiveSimId] = useState(null);
  const [graph, setGraph] = useState(defaultTopology);
  const [switchMemory, setSwitchMemory] = useState({});
  const [disabledLinks, setDisabledLinks] = useState([]); // For link failure

  const setNodes = useCallback((nodes) => setNodesState(nodes), []);
  const setEdges = useCallback((edges) => setEdgesState(edges), []);
  const setLoading = useCallback((val) => setLoadingState(val), []);

  const {
    socket,
    logs,
    paths,
    metricsBySim,
    unreadCounts,
    nodeSnapshots,
    dispatch,
  } = useNetworkSocket(activeSimId, setNodes, setEdges, setLoading, setSwitchMemory);

  const sendMessage = useSendMessage({
    socket,
    graph,
    sourceNode,
    destinationNode,
    pathsInFlight,
    setPathsInFlight,
    setPacketColors,
    COLORS,
    disabledLinks, // Account for failed links
  });

  const { replayState, replaySimulation } = useReplaySimulation(nodeSnapshots, setNodes);

  const onCloseTab = (simId) => {
    dispatch({ type: 'REMOVE_SIM', simId });
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

      <TopologyEditor
        graph={graph}
        setGraph={setGraph}
        disabledLinks={disabledLinks}
        setDisabledLinks={setDisabledLinks}
      />

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

      {loadingState ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            <NetworkVisualization
              nodes={nodesState}
              edges={edgesState}
              animatePath={Object.values(paths)}
              nodeLabels={defaultLabels}
              disabledLinks={disabledLinks}
              setDisabledLinks={setDisabledLinks}
            />
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
              dispatch={dispatch}
              onCloseTab={onCloseTab}
              replaySimulation={replaySimulation}
            />
            <GraphMetrics metrics={currentMetrics} activeSimId={activeSimId} />
            <SwitchMemoryPanel switchMemory={switchMemory} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
