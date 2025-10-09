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
  const cachedData = (cached && cache[url]) ? cache[url] : null

  // State management for error, loading status, and fetch results
  const [error, setError] = useState(null)
  // Fix the loading state initialization
  const [loading, setLoading] = useState(cachedData === null)
  const [data, setData] = useState(cachedData)

  useEffect(() => {
    let unmounted = false

    if (url) {
      if (cached && cache[url]) {
        setData(cache[url])
        setLoading(false)
      } else {
        const fetchData = async () => {
          if (!unmounted) {
            setData(null)
            setLoading(true)
            try {
              const fetchedData = await loadAsync(url)
              if (!unmounted) {
                if (cached) cache[url] = fetchedData
                setData(fetchedData)
                setLoading(false)
              }
            } catch (e) {
              if (!unmounted) {
                setError(e)
                setLoading(false)
              }
            }
          }
        }

        fetchData()
      }
    } else {
      // No URL provided, reset states
      setData(null)
      setLoading(false)
      setError(null)
    }

    return () => {
      unmounted = true
    }
  }, [url, cached])

  return [data, loading, error]
}

export default useFetchObject
