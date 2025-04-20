export const initialState = {
    logs: {},
    paths: {},
    metricsBySim: {},
    unreadCounts: {},
    nodeSnapshots: {},
  };
  
  export function simulationReducer(state, action) {
    const { simId } = action;
  
    switch (action.type) {
      case 'ADD_LOG':
        return {
          ...state,
          logs: {
            ...state.logs,
            [simId]: [...(state.logs[simId] || []), action.message],
          },
        };
      case 'ADD_PATH':
        return {
          ...state,
          paths: {
            ...state.paths,
            [simId]: action.path,
          },
        };
      case 'ADD_METRICS':
        return {
          ...state,
          metricsBySim: {
            ...state.metricsBySim,
            [simId]: action.metrics,
          },
        };
      case 'ADD_SNAPSHOT':
        return {
          ...state,
          nodeSnapshots: {
            ...state.nodeSnapshots,
            [simId]: [...(state.nodeSnapshots[simId] || []), action.snapshot],
          },
        };
      case 'INCREMENT_UNREAD':
        return {
          ...state,
          unreadCounts: {
            ...state.unreadCounts,
            [simId]: (state.unreadCounts[simId] || 0) + 1,
          },
        };
      case 'CLEAR_UNREAD':
        return {
          ...state,
          unreadCounts: {
            ...state.unreadCounts,
            [simId]: 0,
          },
        };
      case 'REMOVE_SIM':
        const newState = {};
        for (const key in state) {
          newState[key] = { ...state[key] };
          delete newState[key][simId];
        }
        return newState;
  
      default:
        return state;
    }
  }
  