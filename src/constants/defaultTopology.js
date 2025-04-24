export const defaultTopology = {
  // Core Router
  '10.0.0.1': {
    '10.0.1.1': 1, // Switch A
    '10.0.2.1': 1, // Switch B
  },

  // Switch A (Office A)
  '10.0.1.1': {
    '10.0.0.1': 1, // Back to Core Router
    '10.0.1.2': 1, // Host A1
    '10.0.1.3': 1, // Host A2
    '10.0.1.4': 1, // Printer A
  },

  // Switch B (Office B)
  '10.0.2.1': {
    '10.0.0.1': 1, // Back to Core Router
    '10.0.2.2': 1, // Host B1
    '10.0.2.3': 1, // Host B2
    '10.0.2.4': 1, // Printer B
  },

  // End Devices (A)
  '10.0.1.2': { '10.0.1.1': 1 }, // Host A1 to Switch A
  '10.0.1.3': { '10.0.1.1': 1 }, // Host A2 to Switch A
  '10.0.1.4': { '10.0.1.1': 1 }, // Printer A to Switch A

  // End Devices (B)
  '10.0.2.2': { '10.0.2.1': 1 }, // Host B1 to Switch B
  '10.0.2.3': { '10.0.2.1': 1 }, // Host B2 to Switch B
  '10.0.2.4': { '10.0.2.1': 1 }, // Printer B to Switch B
};
export const defaultLabels = {
  '10.0.0.1': 'router',

  '10.0.1.1': 'switch',
  '10.0.2.1': 'switch',

  '10.0.1.2': 'host A1',
  '10.0.1.3': 'host A2',
  '10.0.1.4': 'printer A',

  '10.0.2.2': 'host B1',
  '10.0.2.3': 'host B2',
  '10.0.2.4': 'printer B',
};
