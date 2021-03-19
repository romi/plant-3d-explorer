/*

Plant 3D Explorer: An browser application for 3D scanned
plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/
import { useState, useEffect } from 'react'
import { get, CancelToken } from 'axios'

import { MakeQuerablePromise } from 'rd/tools/promise'

const cache = {}

function forgeFetchResource (url, source, options) {
  return {
    data: null,
    query: MakeQuerablePromise(
      get(url)
    )
  }
}

const useFetch = (url, cached = true, options = {}) => {
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
        const fetchResource = forgeFetchResource(url, source, options)

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
