const initialState = {
  layers: {
    mesh: true,
    pointCloud: true,
    skeleton: true
  },
  selectedCamera: null
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_LAYERS':
      return {
        ...state,
        layers: action.value
      }
    case 'SELECT_CAMERA':
      return {
        ...state,
        selectedCamera: action.value
      }
    default:
      return state
  }
}
