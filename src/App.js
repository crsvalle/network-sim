import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on('networkUpdate', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
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
    socket.emit('sendMessage', { from: '192.168.1.1', to: '192.168.1.2' });
  };

  return (
    <div>
      <h1>Network Simulation</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
              {msg}
            </div>
          ))}
        </div>
      )}


      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
