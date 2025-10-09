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

/**
 * A custom hook for fetching data with optional caching and state management.
 *
 * @param {string} url - The URL to fetch the data from.
 * @param {boolean} [cached=true] - Flag indicating whether to use cached data if available.
 * @returns {[any, boolean, Error|null]} An array containing:
 *   - The fetched data or cached data (or `false` if no cache and not yet fetched).
 *   - A boolean indicating whether the fetch is in progress.
 *   - Any error encountered during the fetch. */
const useFetch = (url, cached = true) => {
  const [state, setState] = useState(() => {
    if (!url) {
      return { data: null, loading: false, error: null }
    }

    const cachedResource = cached && cache[url]
    if (cachedResource && cachedResource.data) {
      return { data: cachedResource.data, loading: false, error: null }
    }

    return { data: null, loading: true, error: null }
  })

  useEffect(() => {
    let source
    let unmounted = false

    if (!url) {
      setState({ data: null, loading: false, error: null })
      return
    }

    if (cached && cache[url]) {
      if (cache[url].data) {
        setState({ data: cache[url].data, loading: false, error: null })
      } else {
        cache[url].query
          .then(response => {
            if (!unmounted) {
              setState({ data: response.data, loading: false, error: null })
            }
          })
          .catch(error => {
            if (!unmounted) {
              setState({ data: null, loading: false, error: new Error(error) })
            }
          })
      }
    } else {
      setState({ data: null, loading: true, error: null })
      source = CancelToken.source()

      const fetchResource = forgeFetchResource(url)
      if (cached) cache[url] = fetchResource

      fetchResource.query
        .then(response => {
          if (!unmounted) {
            if (cached) cache[url].data = response.data
            setState({ data: response.data, loading: false, error: null })
          }
        })
        .catch(error => {
          if (!unmounted) {
            setState({ data: null, loading: false, error: new Error(error) })
          }
        })
    }

    return () => {
      unmounted = true
      if (source) source.cancel('Component unmounted')
    }
  }, [url, cached])

  return [state.data, state.loading, state.error]
}

export default useFetch
