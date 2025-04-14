import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import NetworkVisualization from './components/NetworkVisualization';
import TopologyEditor from './components/TopologyEditor';

const socket = io('http://localhost:8000');

function App() {
  const [graph, setGraph] = useState({
    '192.168.1.1': { '192.168.1.2': 1 },
    '192.168.1.2': { '192.168.1.3': 2 },
    '192.168.1.3': { '192.168.1.4': 1 },
    '192.168.1.4': {},
  });

  const [messages, setMessages] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges }) => {
      setMessages((prev) => [...prev, message]);
      setNodes(nodes);
      setEdges(edges);
      setLoading(false);
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
    socket.emit('sendMessage', {
      from: '192.168.1.1',
      to: '192.168.1.4',
      graph,
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Network Simulation</h1>

      <TopologyEditor graph={graph} setGraph={setGraph} />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={sendMessage}>Send Message</button>
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

          <div style={{
            width: '450px', maxHeight: '500px', overflowY: 'auto', wordWrap: 'break-word',
            whiteSpace: 'normal',
          }}>
            <h2>Messages</h2>
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
          </div>
        </div>
      )}
    </div>
  );

}

export default App;
