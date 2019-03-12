import useAccessor from 'rd/tools/accessor'

export const useHoveredCamera = useAccessor(
  [
    (state) => {
      return state.interactions.hoveredCamera
    }
  ],
  [
    (value) => ({
      type: 'HOVER_CAMERA',
      value
    })
  ]
)

export const useSelectedcamera = useAccessor(
  [
    (state) => {
      return state.interactions.selectedCamera
    }
  ],
  [
    (value) => ({
      type: 'SELECT_CAMERA',
      value
    })
  ]
)
