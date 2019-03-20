import { useState, useRef, useEffect } from 'react'

import useMutationObserver from './mutationObserver'

export default function (obeserver = true) {
  const ref = useRef()
  const [value, setValue] = useState()

  useEffect(
    () => {
      if (ref.current) setValue(ref.current.getBoundingClientRect())
    },
    [ref.current]
  )

  if (obeserver) {
    useMutationObserver(
      ref,
      () => setValue(ref.current.getBoundingClientRect())
    )
  }

  return [
    ref,
    value
  ]
}
