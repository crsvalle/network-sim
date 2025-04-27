const SwitchMemoryPanel = ({ switchMemory }) => (
  <div style={{ background: '#f1f1f1', padding: '10px', borderRadius: '8px', marginTop: '20px' }}>
    <h2>🧠 Switch Memory</h2>
    {Object.keys(switchMemory).length === 0 ? (
      <p>No switch learning data yet.</p>
    ) : (
      Object.entries(switchMemory).map(([switchId, table]) => (
        <div key={switchId} style={{ marginBottom: '12px' }}>
          <strong>🔀 Switch {switchId}</strong>
          <ul style={{ marginLeft: '20px' }}>
            {Object.entries(table).map(([destination, learnedFrom]) => (
              <li key={destination}>
                📍 {destination} ➡ learned via <strong>{learnedFrom}</strong>
              </li>
            ))}
          </ul>
        </div>
      ))
    )}
  </div>
);

export default SwitchMemoryPanel;
