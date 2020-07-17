import { useState } from 'react'

export default function useViewport3d (width, height) {
  const [result, setResult] = useState({})
  /* This is used to prevent clicking if the user has
    just been clicking to move the camera. If it's been
    tool long since the user pressed mouseDown, mouseUp won't
    notify of a clic */
  const [dateDown, setDateDown] = useState(Date.now())
  const [currentClick, setCurrentClick] = useState()

  const reset = () => {
  }

  const eventFns = {
    onMouseUp: (e) => {
      if (Date.now() - 1000 < dateDown) {
        setResult({
          ...result,
          clicked: e.button === 0 && currentClick === 0,
          rightClicked: e.button === 2 && currentClick === 2
        })
      }
    },
    onMouseDown: (e) => {
      setDateDown(Date.now())
      setCurrentClick(e.button)
    }

  }

  return [
    result,
    eventFns,
    reset
  ]
}
