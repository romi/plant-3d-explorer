import { useEffect, useState } from 'react'
import { get } from 'axios'

const cache = {}

/**
 * Asynchronously loads JSON data from the given URL.
 *
 * @param {string} url - The URL of the JSON resource to load.
 * @return {Promise<any>} A Promise that resolves with the parsed JSON data.
 */
function loadAsync (url) {
  return new Promise((resolve, reject) => {
    get(url)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(new Error(err))
      })
  })
}

/**
 * Custom hook to fetch or retrieve JSON data asynchronously.
 *
 * @param {string} url The URL of the JSON data to fetch.
 * @param {boolean} [cached=true] Whether to use cached data if available.
 * @return {[any, boolean, Error|null]} Array containing the fetched data, loading state, and error.
 */
function useFetchObject (url, cached = true) {
  // Check if data exists in cache for the given URL
  const cachedData = (cached && cache[url])

  // State management for error, loading status, and fetch results
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!!cachedData || true)
  const [data, setData] = useState(!!cachedData)

  useEffect(() => {
    let unmounted = false

    if (url) {
      if (cached && cache[url]) {
        setData(cache[url])
      } else {
        (async () => {
          if (!unmounted) {
            setData(null)
            setLoading(true)
            try {
              const data = await loadAsync(url)
              if (cached) cache[url] = data
              setData(data)
            } catch (e) {
              setError(e)
            }
            setLoading(false)
          }
        })()
      }
    }

    return () => {
      unmounted = true
    }
  }, [url])

  return [data, loading, error]
}

export default useFetchObject