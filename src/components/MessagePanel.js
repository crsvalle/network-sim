const MessagePanel = ({ messages }) => (
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
  </div>
);

export default MessagePanel;
