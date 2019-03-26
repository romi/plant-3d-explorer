const initialState = {
  hoveredCamera: null,
  selectedCamera: null,

  hoveredAngle: null,
  selectedAngle: null,

  reset3dViewFn: null,
  reset2dViewFn: null
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'RESET_INTERACTIONS':
      return {
        ...state,
        ...initialState
      }
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
    case 'HOVER_ANGLE':
      return {
        ...state,
        hoveredAngle: action.value
      }
    case 'SELECT_ANGLE':
      return {
        ...state,
        selectedAngle: action.value
      }
    case 'SET_RESET_2D_VIEW':
      return {
        ...state,
        reset2dViewFn: action.value
      }
    case 'SET_RESET_3D_VIEW':
      return {
        ...state,
        reset3dViewFn: action.value
      }
    default:
      return state
  }
}
