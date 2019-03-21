import useAccessor from 'rd/tools/hooks/accessor'

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

export const useReset2dView = useAccessor(
  [
    (state) => {
      return state.interactions.reset2dViewFn
    }
  ],
  [
    (value) => ({
      type: 'SET_RESET_2D_VIEW',
      value
    })
  ]
)

export const useReset3dView = useAccessor(
  [
    (state) => {
      return state.interactions.reset3dViewFn
    }
  ],
  [
    (value) => ({
      type: 'SET_RESET_3D_VIEW',
      value
    })
  ]
)
