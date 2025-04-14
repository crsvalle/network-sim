
const NodeSelector = ({ graph, sourceNode, destinationNode, setSourceNode, setDestinationNode }) => (
  <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '10px' }}>
    <div>
      <label>Source:</label>
      <select value={sourceNode} onChange={(e) => setSourceNode(e.target.value)}>
        <option value="">Select</option>
        {Object.keys(graph).map((node) => (
          <option key={node} value={node}>{node}</option>
        ))}
      </select>
    </div>

    <div>
      <label>Destination:</label>
      <select value={destinationNode} onChange={(e) => setDestinationNode(e.target.value)}>
        <option value="">Select</option>
        {Object.keys(graph).map((node) => (
          <option key={node} value={node}>{node}</option>
        ))}
      </select>
    </div>
  </div>
);

export default NodeSelector;
