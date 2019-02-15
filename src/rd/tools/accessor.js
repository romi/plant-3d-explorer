import { useCallback } from 'react'
import { useDispatch, useMappedState } from 'redux-react-hook'

export default function accessor (selectors = [], actions = []) {
  return (props) => {
    const dispatch = useDispatch()
    return [
      ...(
        selectors.map((selector) => {
          return useMappedState(
            useCallback(
              (state) => selector(state, props),
              []
            )
          )
        })
      ),
      ...(
        actions.map((action) => {
          return useCallback(
            (value) => dispatch(action(value)),
            []
          )
        })
      )
    ]
  }
}
