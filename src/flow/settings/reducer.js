const initialState = {
  layers: {
    mesh: true,
    pointCloud: true,
    skeleton: true,
    angles: false,
    cameras: false
  }
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'RESET_SETTINGS':
      return {
        ...state,
        ...initialState
      }
    case 'SET_LAYERS':
      return {
        ...state,
        layers: action.value
      }
    default:
      return state
  }
}
