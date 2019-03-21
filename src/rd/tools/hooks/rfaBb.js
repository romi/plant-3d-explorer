import { useEffect, useState, useRef } from 'react'

export default function () {
  const ref = useRef()
  const [value, setValue] = useState()

  function getValue () {
    return value
  }

  useEffect(
    () => {
      let unmounted

      function onFrame () {
        if (ref.current) {
          const bb = ref.current.getBoundingClientRect()
          const v = getValue()

          if (
            !unmounted && (
              (!v) || (
                v.x !== bb.x ||
                v.y !== bb.y ||
                v.top !== bb.top ||
                v.bottom !== bb.bottom ||
                v.left !== bb.left ||
                v.right !== bb.right ||
                v.width !== bb.width ||
                v.height !== bb.height
              )
            )
          ) {
            setValue(bb)
          }
          loop()
        }
      }

      function loop () {
        if (!unmounted && ref.current) window.requestAnimationFrame(onFrame)
      }

      if (ref.current) onFrame()

      return () => {
        unmounted = true
      }
    },
    [ref.current, value]
  )

  return [
    ref,
    value
  ]
}
