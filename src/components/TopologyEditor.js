import { useState } from 'react';

export default function TopologyEditor({ graph, setGraph }) {
  const [node, setNode] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [weight, setWeight] = useState('');

  const addNode = () => {
    if (!graph[node]) {
      setGraph({ ...graph, [node]: {} });
      setNode('');
    }
  };

  const addLink = () => {
    if (!from || !to || isNaN(weight)) return;
    setGraph((prev) => {
      const updated = { ...prev };
      if (!updated[from]) updated[from] = {};
      updated[from][to] = Number(weight);
      return updated;
    });
    setFrom('');
    setTo('');
    setWeight('');
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Topology Editor</h2>

      <div>
        <input
          placeholder="New node (e.g., 192.168.1.5)"
          value={node}
          onChange={(e) => setNode(e.target.value)}
        />
        <button onClick={addNode}>Add Node</button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          placeholder="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          placeholder="Weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button onClick={addLink}>Add Link</button>
      </div>
    </div>
  );
}
