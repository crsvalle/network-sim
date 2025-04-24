const SwitchMemoryPanel = ({ switchMemory }) => (
    <div style={{ marginTop: '20px', background: '#f1f1f1', padding: '10px', borderRadius: '6px' }}>
      <h3>🧠 Switch Memory</h3>
      {Object.keys(switchMemory).length === 0 ? (
        <p>No learned paths yet.</p>
      ) : (
        Object.entries(switchMemory).map(([switchId, table]) => (
          <div key={switchId} style={{ marginBottom: '10px' }}>
            <strong>Switch {switchId}</strong>
            <ul>
              {Object.entries(table).map(([dest, port]) => (
                <li key={dest}>
                  {dest} → {port}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
  
  export default SwitchMemoryPanel;
  