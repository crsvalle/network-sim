const ReplayTimeline = ({ path, currentIndex, onStepClick }) => {
    return (
      <div style={{ marginTop: '20px' }}>
        <h3>📅 Replay Timeline</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {path.map((node, i) => (
            <button
              key={i}
              onClick={() => onStepClick(i)}
              style={{
                padding: '6px',
                background: i === currentIndex ? '#4caf50' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: i === currentIndex ? 'bold' : 'normal',
              }}
            >
              {node}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default ReplayTimeline;
  