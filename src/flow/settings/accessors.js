import useAccessor from 'rd/tools/hooks/accessor'

export const useLayers = useAccessor(
  [
    (state) => {
      return state.settings.layers
    }
  ],
  [
    (value) => ({
      type: 'SET_LAYERS',
      value
    })
  ]
)
