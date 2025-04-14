import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import NetworkVisualization from './components/NetworkVisualization';
import TopologyEditor from './components/TopologyEditor';

const socket = io('http://localhost:8000');

function App() {
  const [messages, setMessages] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graph, setGraph] = useState({
    '192.168.1.1': { '192.168.1.2': 1, '192.168.1.3': 4 },
    '192.168.1.2': { '192.168.1.3': 2, '192.168.1.4': 5 },
    '192.168.1.3': { '192.168.1.4': 1 },
    '192.168.1.4': {}
  });
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    pathLength: 0,
    totalCost: 0,
    retries: 0,
    drops: 0,
    nodeCount: 0,
    linkCount: 0,
  });

  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges }) => {
      if (message) setMessages((prev) => [...prev, message]);

      const safeNodes = Array.isArray(nodes) ? nodes.filter(n => n && n.id) : [];
      const safeEdges = Array.isArray(edges) ? edges.filter(e => e && e.from && e.to) : [];

      setNodes(safeNodes);
      setEdges(safeEdges);
      setLoading(false);

      const retries = message.includes('(retry') ? 1 : 0;
      const drops = message.includes('❌') ? 1 : 0;

      setMetrics((prev) => ({
        pathLength: safeNodes.filter(n => n.color === '#4caf50' || n.color === '#f44336').length,
        totalCost: safeEdges
          .filter(e => e.color?.color === '#4caf50')
          .reduce((sum, e) => sum + parseInt(e.label), 0),
        retries: prev.retries + retries,
        drops: prev.drops + drops,
        nodeCount: safeNodes.length,
        linkCount: safeEdges.length,
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
    const from = '192.168.1.1';
    const to = '192.168.1.4';

    if (!graph[from] || !graph[to]) {
      alert('Please ensure both source and destination nodes exist.');
      return;
    }

    setMetrics((prev) => ({
      ...prev,
      pathLength: 0,
      totalCost: 0,
    }));

    socket.emit('sendMessage', { from, to, graph });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>📡 Network Simulation</h1>

      <TopologyEditor graph={graph} setGraph={setGraph} />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={sendMessage}>📤 Send Message</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            {nodes.length === 0 ? (
              <p>No network data yet. Click "Send Message" to start!</p>
            ) : (
              <NetworkVisualization nodes={nodes} edges={edges} />
            )}
          </div>

          <div style={{ width: '450px', maxHeight: '500px', overflowY: 'auto' }}>
            <h2>📨 Messages</h2>
            {messages.map((msg, index) => {
              const isRetry = msg.includes('(retry');
              return (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: isRetry ? '#fff3cd' : '#f0f0f0',
                    border: `1px solid ${isRetry ? '#ffecb5' : '#ccc'}`,
                    borderRadius: '5px',
                  }}
                >
                  {msg}
                </div>
              );
            })}

            <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
              <h2>📈 Graph Metrics</h2>
              <ul style={{ lineHeight: '1.6' }}>
                <li><strong>🧠 Nodes:</strong> {metrics.nodeCount}</li>
                <li><strong>🔗 Links:</strong> {metrics.linkCount}</li>
                <li><strong>🧭 Path Length:</strong> {metrics.pathLength} hops</li>
                <li><strong>⚡ Total Cost:</strong> {metrics.totalCost}</li>
                <li><strong>🔁 Retries:</strong> {metrics.retries}</li>
                <li><strong>❌ Drops:</strong> {metrics.drops}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
