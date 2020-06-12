import { useState } from 'react'

export default function useViewport3d (width, height) {
  const reset = () => {}
  const [result] = useState(null)

  const eventFns = {
    onMouseMove: (e) => {
    }
  }

  return [
    result,
    eventFns,
    reset
  ]
}
