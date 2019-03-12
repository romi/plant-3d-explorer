const initialState = {
  selectedCamera: null,
  hoveredCamera: null
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'HOVER_CAMERA':
      return {
        ...state,
        hoveredCamera: action.value
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
