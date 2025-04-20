// src/constants/defaultTopology.js

const defaultTopology = {
  // Core Router
  '10.0.0.1': {
    '10.0.1.1': 1, // Switch A
    '10.0.2.1': 1, // Switch B
  },

  // Switch A (Office A)
  '10.0.1.1': {
    '10.0.1.2': 1, // Host A1
    '10.0.1.3': 1, // Host A2
    '10.0.1.4': 1, // Printer A
  },

  // Switch B (Office B)
  '10.0.2.1': {
    '10.0.2.2': 1, // Host B1
    '10.0.2.3': 1, // Host B2
    '10.0.2.4': 1, // Printer B
  },

  // End Devices
  '10.0.1.2': {}, // Host A1
  '10.0.1.3': {}, // Host A2
  '10.0.1.4': {}, // Printer A
  '10.0.2.2': {}, // Host B1
  '10.0.2.3': {}, // Host B2
  '10.0.2.4': {}, // Printer B
};

export default defaultTopology;
