import { useState, useEffect } from 'react'
import PLYLoader from 'common/thiers/PLYLoader'
import * as THREE from 'three'

const cache = {}

const enhancedTHREE = PLYLoader(THREE)
var loader = new enhancedTHREE.PLYLoader()
function loadAsync (url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (geometry) => {
        resolve(geometry)
      },
      () => {},
      (err) => {
        reject(new Error(err))
      }
    )
  })
}

function useFetch3dObject (url, cached = true) {
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
          const data = await loadAsync(url)
          if (cached) cache[url] = data
          setData(data)
        } catch (e) {
          setError(e)
        }
        setLoading(false)
      })()
    }
  }, [url])

  return [ data, loading, error ]
}

export default useFetch3dObject
