import { useState, useEffect } from 'react';

const TabbedMessagePanel = ({ logs, packetColors, setActiveSimId, onCloseTab }) => {
  const simulationIds = Object.keys(logs);
  const [activeTab, setActiveTab] = useState(simulationIds[0] || null);

  useEffect(() => {
    if (!activeTab && simulationIds.length > 0) {
      setActiveTab(simulationIds[0]);
    }
  }, [simulationIds, activeTab]);

  useEffect(() => {
    if (activeTab) {
      setActiveSimId(activeTab);
    }
  }, [activeTab, setActiveSimId]);

  const handleClose = (id) => {
    if (activeTab === id) {
      const remainingTabs = simulationIds.filter((sim) => sim !== id);
      setActiveTab(remainingTabs[0] || null);
    }
    onCloseTab(id);
  };

  return (
    <div>
      <h2>Messages</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {simulationIds.map((id) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTab(id)}
              style={{
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderBottom: activeTab === id ? '2px solid #2196f3' : 'none',
                background: activeTab === id ? '#e3f2fd' : '#fff',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Sim {id.slice(0, 6)}...
            </button>
            <button
              onClick={() => handleClose(id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f44336',
                fontSize: '16px',
                cursor: 'pointer',
                marginLeft: '4px',
              }}
              title="Close tab"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div>
        {(logs[activeTab] || []).map((msg, i) => {
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
    