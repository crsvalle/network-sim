import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import NetworkVisualization from './components/NetworkVisualization';

const socket = io('http://localhost:8000');

function App() {
  const [messages, setMessages] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on('networkUpdate', ({ message, nodes, edges }) => {
      if (message) {
        setMessages((prev) => [...prev, message]);
      }
      if (nodes) setNodes(nodes);
      if (edges) setEdges(edges);
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
    socket.emit('sendMessage', { from: '192.168.1.1', to: '192.168.1.4' });
  };

  return (
    <div>
      <h1>Network Simulation</h1>
      <button onClick={sendMessage}>Send Message</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {nodes.length === 0 ? (
            <p>No network data yet. Click "Send Message" to start!</p>
          ) : (
            <NetworkVisualization nodes={nodes} edges={edges} />
          )}
          <div style={{ marginTop: '20px' }}>
            <h2>Messages</h2>
            {messages.map((msg, index) => {
              const isRetry = msg.includes('(retry');
              return (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    padding: '10px',
                    backgroundColor: isRetry ? '#fff3cd' : '#f0f0f0', // yellowish for retries
                    border: `1px solid ${isRetry ? '#ffecb5' : '#ccc'}`,
                    borderRadius: '5px',
                  }}
                >
                  {msg}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
