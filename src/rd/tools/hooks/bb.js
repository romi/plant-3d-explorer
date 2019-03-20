import { useState, useRef, useEffect } from 'react'

import useMutationObserver from './mutationObserver'

export default function (mutator = true) {
  const ref = useRef()
  const [value, setValue] = useState()

  useEffect(
    () => {
      if (ref.current) setValue(ref.current.getBoundingClientRect())
    },
    [ref.current]
  )

  if (mutator) {
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
