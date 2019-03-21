const initialState = {
  layers: {
    mesh: true,
    pointCloud: true,
    skeleton: true,
    angles: false,
    cameras: true
  }
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_LAYERS':
      return {
        ...state,
        layers: action.value
      }
    default:
      return state
  }
}
