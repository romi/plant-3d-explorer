import { useState, useEffect } from 'react'
import { get, CancelToken } from 'axios'

import { MakeQuerablePromise } from 'rd/tools/promise'

const cache = {}

function forgeFetchResource (url, source) {
  return {
    data: null,
    query: MakeQuerablePromise(
      get(
        url,
        {
          CancelToken: source.token
        }
      )
    )
  }
}

const useFetch = (url, cached = true) => {
  const cachedData = (cached && cache[url])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!!cachedData || true)
  const [data, setData] = useState(
    cache[url]
      ? cache[url].query.isFulfilled
        ? cache[url].data
        : null
      : false
  )

  useEffect(() => {
    let source
    let unmounted = false
    if (url) {
      if (cached && cache[url]) {
        if (cache[url].data) {
          setLoading(false)
          setData(cache[url].data)
        } else {
          cache[url].query
            .then((response) => {
              setLoading(false)
              setData(response.data)
            })
        }
      } else {
        setData(null)
        setLoading(true)
        source = CancelToken.source()
        const fetchResource = forgeFetchResource(url, source)

        if (cached) cache[url] = fetchResource

        fetchResource.query
          .then((response) => {
            if (!unmounted) {
              if (cached) cache[url].data = response.data
              setData(response.data)
              setLoading(false)
            }
          })
          .catch((error) => {
            if (!unmounted) {
              console.log(error) // DEV
              setError(new Error(error))
              setLoading(false)
            }
          })
      }
    }
    return () => {
      unmounted = true
      if (source) source.cancel('Cancelling in cleanup')
    }
  }, [url])

  return [ data, loading, error ]
}

export default useFetch
