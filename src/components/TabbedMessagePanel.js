import React, { useState, useEffect } from 'react';

const TabbedMessagePanel = ({ logs, packetColors }) => {
  const simulationIds = Object.keys(logs);
  const [activeSimId, setActiveSimId] = useState(simulationIds[0] || null);

  useEffect(() => {
    if (simulationIds.length > 0) {
      const latest = simulationIds[simulationIds.length - 1];
      setActiveSimId((prev) => (prev === null ? latest : prev));
    }
  }, [simulationIds]);

  return (
    <div>
      <h2>Messages</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {simulationIds.map((id) => (
          <button
            key={id}
            onClick={() => setActiveSimId(id)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderBottom: activeSimId === id ? '2px solid #2196f3' : 'none',
              background: activeSimId === id ? '#e3f2fd' : '#fff',
              cursor: 'pointer',
            }}
          >
            Simulation {id.slice(0, 6)}...
          </button>
        ))}
      </div>

      <div>
        {(logs[activeSimId] || []).map((msg, i) => {
          const match = msg.match(/^\[(\d+)]\s/);
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
    </div>
  );
};

export default TabbedMessagePanel;
