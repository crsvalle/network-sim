const MessagePanel = ({ messages, packetColors }) => {
    return (
      <div style={{ marginBottom: '20px' }}>
        <h2>Messages</h2>
        {messages.map((msg, i) => {
          const match = msg.match(/^\[(\d+)\]\s/);
          const colorId = match ? match[1] : null;
          const tagColor = colorId ? packetColors[colorId] : '#ccc';
  
          return (
            <div
              key={i}
              style={{
                padding: '10px',
                marginBottom: '8px',
                borderLeft: `6px solid ${tagColor}`,
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
            >
              {msg}
            </div>
          );
        })}
      </div>
    );
  };
  
  export default MessagePanel;
  