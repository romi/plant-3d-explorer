import { useState, useEffect } from 'react'
import { get } from 'axios'

import { MakeQuerablePromise } from 'rd/tools/promise'

const cache = {}

function forgeFetchResource (url) {
  return {
    data: null,
    query: MakeQuerablePromise(get(url))
  }
}

const useFetch = (url, cached = true) => {
  const cachedData = (cached && cache[url])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!!cachedData || true)
  const [data, setData] = useState(!!cachedData)

  useEffect(() => {
    if (url) {
      if (cached && cache[url]) {
        setLoading(false)
        if (cache[url].data) {
          setData(cache[url].data)
        } else {
          cache[url].query
            .then((response) => {
              setData(response.data)
            })
        }
      } else {
        setData(null)
        setLoading(true)

        const fetchResource = forgeFetchResource(url)
        if (cached) cache[url] = fetchResource
        fetchResource.query
          .then((response) => {
            if (cached) cache[url] = response.data
            setData(response.data)
            setLoading(false)
          })
          .catch((error) => {
            console.log(error) // DEV
            setError(new Error(error))
            setLoading(false)
          })
      }
    }
  }, [url])

  return [ data, loading, error ]
}

export default useFetch
