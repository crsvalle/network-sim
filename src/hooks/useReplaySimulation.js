import { useState } from 'react';

export default function useReplaySimulation(nodeSnapshots, setNodes) {
  const [replayState, setReplayState] = useState({ simId: null, index: 0 });

  const replaySimulation = (simId) => {
    const snapshots = nodeSnapshots[simId];
    if (!snapshots) return;

    let i = 0;
    setReplayState({ simId, index: 0 });

    const interval = setInterval(() => {
      if (i >= snapshots.length) return clearInterval(interval);
      setNodes(snapshots[i]);

      const activeNode = snapshots[i].find(n => n.color === '#f44336');
      if (activeNode) {
        const updated = snapshots[i].map(n =>
          n.id === activeNode.id ? { ...n, color: '#ffeb3b' } : n
        );
        setNodes(updated);
      }

      setReplayState({ simId, index: i });
      i++;
    }, 800);
  };

  return { replayState, replaySimulation };
}
