
export default function ControlPanel({ sendMessage, pathsInFlight, algorithm, setAlgorithm }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <label style={{ marginRight: '10px' }}>
        Routing Algorithm:
        <select
          style={{ marginLeft: '10px' }}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="dijkstra">Dijkstra</option>
          <option value="bellman-ford">Bellman-Ford</option>
        </select>
      </label>

      <button
        onClick={sendMessage}
        disabled={pathsInFlight.length >= 2}
        style={{ marginLeft: '20px' }}
      >
        {pathsInFlight.length >= 2 ? '⏳ Sending...' : '📤 Send Message'}
      </button>
    </div>
  );
}
