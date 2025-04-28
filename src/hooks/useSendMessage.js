export default function useSendMessage({
  socket,
  graph,
  sourceNode,
  destinationNode,
  pathsInFlight,
  setPathsInFlight,
  setPacketColors,
  COLORS,
  disabledLinks,
}) {
  const MAX_PARALLEL_MESSAGES = 2;

  const sendMessage = () => {
    if (pathsInFlight.length >= MAX_PARALLEL_MESSAGES) {
      alert('Please wait – packet limit reached.');
      return;
    }

    if (!sourceNode || !destinationNode) {
      alert('Please select both source and destination.');
      return;
    }

    if (!graph[sourceNode] || !graph[destinationNode]) {
      alert('Selected nodes do not exist in the graph.');
      return;
    }

    if (sourceNode === destinationNode) {
      alert('Source and destination cannot be the same.');
      return;
    }

    const adjustedGraph = JSON.parse(JSON.stringify(graph)); // deep copy
    disabledLinks.forEach(({ from, to }) => {
      if (adjustedGraph[from] && adjustedGraph[from][to]) {
        delete adjustedGraph[from][to];
      }
    });

    const newId = pathsInFlight.length;
    const assignedColor = COLORS[newId % COLORS.length];

    setPathsInFlight((prev) => [...prev, newId]);
    setPacketColors((prev) => ({ ...prev, [newId]: assignedColor }));

    socket.emit('sendMessage', {
      from: sourceNode,
      to: destinationNode,
      graph: adjustedGraph, 
      colorId: newId,
    });

    setTimeout(() => {
      setPathsInFlight((prev) => prev.filter((id) => id !== newId));
    }, 6000);
  };

  return sendMessage;
}
