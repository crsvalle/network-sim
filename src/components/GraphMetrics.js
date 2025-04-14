
const GraphMetrics = ({ metrics }) => (
  <div style={{ marginTop: '20px', background: '#f9f9f9', padding: '15px', borderRadius: '8px' }}>
    <h2>📈 Graph Metrics</h2>
    <ul style={{ lineHeight: '1.6' }}>
      <li><strong>🧠 Nodes:</strong> {metrics.nodeCount}</li>
      <li><strong>🔗 Links:</strong> {metrics.linkCount}</li>
      <li><strong>🧭 Path Length:</strong> {metrics.pathLength} hops</li>
      <li><strong>⚡ Total Cost:</strong> {metrics.totalCost}</li>
      <li><strong>🔁 Retries:</strong> {metrics.retries}</li>
      <li><strong>❌ Drops:</strong> {metrics.drops}</li>
    </ul>
  </div>
);

export default GraphMetrics;
