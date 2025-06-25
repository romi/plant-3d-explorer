/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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

import { useEffect, useState } from 'react'
import { CancelToken, get } from 'axios'

import { MakeQuerablePromise } from 'rd/tools/promise'

// Cache object to store fetch results and avoid redundant network requests
const cache = {}

// Creates a queryable fetch request for a given URL
function forgeFetchResource (url) {
  return {
    data: null, // Initial data state
    query: MakeQuerablePromise(get(url)) // Wraps axios get request in queryable promise
  }
}

const useFetch = (url, cached = true, options = {}) => {
  // Check if data exists in cache for the given URL
  const cachedData = (cached && cache[url])

  // State management for error, loading status, and fetch results
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!!cachedData || true)

  // Initialize data state based on cache availability
  const [data, setData] = useState(
    cache[url]
      ? cache[url].query.isFulfilled
        ? cache[url].data
        : null
      : false
  )

  useEffect(() => {
    let source // For request cancellation
    let unmounted = false // Track component unmount state

    if (url) {
      // Handle cached data scenario
      if (cached && cache[url]) {
        if (cache[url].data) {
          // Use cached data if available
          setLoading(false)
          setData(cache[url].data)
        } else {
          // Wait for pending cached request to complete
          cache[url].query
            .then((response) => {
              setLoading(false)
              setData(response.data)
            })
        }
      } else {
        // Handle new fetch request
        setData(null)
        setLoading(true)
        source = CancelToken.source()

        // Create new fetch resource
        const fetchResource = forgeFetchResource(url, source, options)
        if (cached) cache[url] = fetchResource // Store in cache if caching enabled

        // Execute fetch request
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
              console.log(error)
              setError(new Error(error))
              setLoading(false)
            }
          })
      }
    }

    // Cleanup function to prevent memory leaks and cancel pending requests
    return () => {
      unmounted = true
      if (source) source.cancel('Cancelling in cleanup')
    }
  }, [url]) // Effect depends on URL changes

  return [data, loading, error]
}

export default useFetch
