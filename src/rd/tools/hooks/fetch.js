import { useState, useEffect } from 'react'
import { get } from 'axios'

const cache = {}

const useFetch = (url, cached) => {
  const cachedData = (cached && cache[url])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!!cachedData || true)
  const [data, setData] = useState(!!cachedData)

  useEffect(() => {
    if (cached && cache[url]) {
      setData(cache[url])
    } else {
      (async () => {
        setData(null)
        setLoading(true)
        try {
          const response = await get(url)
          if (response.status === 200) {
            if (cached) cache[url] = response.data
            setData(response.data)
          } else {
            setError(new Error(response.statusText))
          }
        } catch (e) {
          setError(e)
        }
        setLoading(false)
      })()
    }
  }, [url])

  return [ data, loading, error ]
}

export default useFetch
