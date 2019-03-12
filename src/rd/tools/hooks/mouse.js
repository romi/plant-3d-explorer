import { useState, useEffect } from 'react'

const useMouse = () => {
  const [ state, setState ] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => {
      setState({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('resize', handler)
  }, [1])

  return state
}

export default useMouse

export const useElementMouse = (element) => {
  const [ state, setState ] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => {
      setState({
        x: e.layerX,
        y: e.layerY
      })
    }

    if (element.current) {
      element.current.addEventListener('mousemove', handler)
    }
    return () => element.current.removeEventListener('resize', handler)
  }, [1])

  return state
}
