import { useState, useEffect } from 'react'

const useFocus = (initialWidth = Infinity, initialHeight = Infinity) => {
  const [ state, setState ] = useState(true)

  const onFocus = () => setState(true)
  const onBlur = () => setState(false)

  useEffect(() => {
    window.addEventListener('focus', onFocus, false)
    window.addEventListener('blur', onBlur, false)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, [1])

  return state
}

export default useFocus
