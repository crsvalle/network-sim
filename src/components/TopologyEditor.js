import React, { useState } from 'react';

const TopologyEditor = ({ graph, setGraph }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [weight, setWeight] = useState(1);

  const addNode = () => {
    const existingIps = Object.keys(graph);
    let newIp;

    do {
      const rand = Math.floor(Math.random() * 254) + 1;
      newIp = `192.168.1.${rand}`;
    } while (existingIps.includes(newIp));

    const updated = {
      ...graph,
      [newIp]: {},
    };

    setGraph(updated);
    console.log(`🟢 Added node: ${newIp}`);
  };

  const addLink = () => {
    if (!graph[from] || !graph[to] || from === to) {
      alert('Invalid from/to node.');
      return;
    }

    const updated = { ...graph };
    updated[from] = {
      ...updated[from],
      [to]: parseInt(weight),
    };

    setGraph(updated);
    console.log(`🔗 Link added: ${from} → ${to} (weight ${weight})`);
  };

  const removeNode = () => {
    if (!graph[from]) return;

    const updated = { ...graph };
    delete updated[from];

    for (let key in updated) {
      if (updated[key]?.[from]) {
        delete updated[key][from];
      }
    }

    setGraph(updated);
    setFrom('');
    console.log(`🗑️ Removed node: ${from}`);
  };

  const removeLink = () => {
    if (!graph[from] || !graph[from][to]) return;

    const updated = { ...graph };
    delete updated[from][to];

    setGraph(updated);
    console.log(`❌ Removed link: ${from} → ${to}`);
  };

  const nodeOptions = Object.keys(graph);

  return (
    <div style={{ marginBottom: '20px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
      <h2>Topology Editor</h2>

      <button onClick={addNode}>➕ Add Random Node</button>

      <div style={{ marginTop: '10px' }}>
        <label>From: </label>
        <select value={from} onChange={(e) => setFrom(e.target.value)}>
          <option value="">Select</option>
          {nodeOptions.map((ip) => (
            <option key={ip}>{ip}</option>
          ))}
        </select>

        <label style={{ marginLeft: '10px' }}>To: </label>
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          <option value="">Select</option>
          {nodeOptions.map((ip) => (
            <option key={ip}>{ip}</option>
          ))}
        </select>

        <label style={{ marginLeft: '10px' }}>Weight: </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          style={{ width: '60px' }}
          min="1"
        />

        <button onClick={addLink} style={{ marginLeft: '10px' }}>➕ Add Link</button>
        <button onClick={removeLink} style={{ marginLeft: '10px' }}>❌ Remove Link</button>
        <button onClick={removeNode} style={{ marginLeft: '10px' }}>🗑️ Remove Node</button>
      </div>
    </div>
  );
};

export default TopologyEditor;
