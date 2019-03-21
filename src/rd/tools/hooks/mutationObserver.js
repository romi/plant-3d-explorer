import { useEffect } from 'react'

var config = {
  attributes: true,
  characterData: true,
  subtree: false,
  childList: true
}

function useMutationObserver (ref, callback, options = config) {
  useEffect(() => {
    if (ref.current) {
      const observer = new window.MutationObserver((mutationList, observer) => {
        console.log(mutationList)
        callback(mutationList, observer)
      })

      observer.observe(ref.current, options)

      return () => observer.disconnect()
    }
  }, [ref.current, callback, options])
}

export default useMutationObserver
