import { useEffect, useState } from 'react';

const TabbedMessagePanel = ({
  logs,
  packetColors,
  activeSimId,
  setActiveSimId,
  unreadCounts,
  setUnreadCounts,
  dispatch,
  onCloseTab,
  replaySimulation,
}) => {
  const simulationIds = Object.keys(logs);
  const [activeTab, setActiveTab] = useState(simulationIds[0] || null);

  useEffect(() => {
    if (activeTab) {
      setActiveSimId(activeTab);
      dispatch({ type: 'CLEAR_UNREAD', simId: activeTab });
    }
  }, [activeTab, dispatch, setActiveSimId]);
  

  useEffect(() => {
    if (!activeTab && simulationIds.length > 0) {
      setActiveTab(simulationIds[0]);
    }
  }, [simulationIds, activeTab]);

  return (
    <div>
      <h2>Messages</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {simulationIds.map((id) => {
          const isActive = activeTab === id;
          const unread = unreadCounts[id] || 0;

          return (
            <div key={id} style={{ position: 'relative' }}>
              <button
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #ccc',
                  borderBottom: isActive ? '2px solid #2196f3' : 'none',
                  background: isActive ? '#e3f2fd' : '#fff',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Sim {id.slice(0, 6)}...
                {unread > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: '#f44336',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '999px',
                    }}
                  >
                    {unread}
                  </span>
                )}
              </button>
              <button
                onClick={() => onCloseTab(id)}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  fontSize: '10px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#f44336',
                }}
                title="Close Tab"
              >
                ✕
              </button>
              {isActive && (
                <button
                  onClick={() => replaySimulation(id)}
                  style={{
                    marginLeft: '4px',
                    fontSize: '10px',
                    background: '#eee',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                  }}
                >
                  ▶ Replay
                </button>
              )}
            </div>
          );
        })}
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
