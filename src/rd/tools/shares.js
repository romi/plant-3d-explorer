import { useState, useEffect } from 'react'

const shares = {}

export default function useShares (key) {
  const [sharedValue, setSharedValue] = useState(shares[key] || null)

  useEffect(
    () => {
      if (sharedValue && sharedValue.value !== shares[key]) {
        shares[key] = sharedValue
      } else if (shares[key]) {
        setSharedValue(shares[key])
      }
    },
    [sharedValue, shares[key]]
  )

  return [
    sharedValue && sharedValue.value,
    function (fn) {
      setSharedValue({
        value: fn
      })
    }
  ]
}
