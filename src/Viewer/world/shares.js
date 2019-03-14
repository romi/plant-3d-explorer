import useShares from 'rd/tools/shares'

export const useWorld3dReset = () => {
  return useShares('world:view:3d:reset')
}

export const useWorld2dReset = () => {
  return useShares('world:view:2d:reset')
}
