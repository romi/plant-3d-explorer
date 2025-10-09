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
import PLYLoader from 'common/thiers/PLYLoader'
import * as THREE from 'three'

const enhancedTHREE = PLYLoader(THREE)
const cache = {}
export const loader = new enhancedTHREE.PLYLoader()

/**
 * Asynchronously loads a resource from the given URL and returns a Promise that resolves with the loaded geometry.
 *
 * @param {string} url - The URL of the resource to load.
 * @return {Promise<any>} A Promise that resolves with the loaded geometry or rejects with an error if the loading fails.
 */
function loadAsync (url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (geometry) => {
      resolve(geometry)
    }, () => {}, (err) => {
      reject(new Error(err))
    })
  })
}

/**
 * Custom hook to fetch or retrieve a 3D object asynchronously.
 *
 * The hook can optionally use cached data to improve performance.
 *
 * @param {string} url The URL of the 3D object to fetch.
 * @param {boolean} [cached=true] A boolean indicating whether to use cached data, if available. Defaults to true.
 * @return {[any, boolean, Error|null]} An array containing the fetched 3D object data, a loading state, and an error object (if an error occurs).
 */
function useFetch3dObject (url, cached = true) {
  // Check if data exists in cache for the given URL
  const cachedData = (cached && cache[url])

  // State management for error, loading status, and fetch results
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(!!cachedData || true) // Start as true if there's cached data or we're fetching
  const [data, setData] = useState(!!cachedData) // Initialize with cached data if available

  useEffect(() => {
    let unmounted = false // Flag to track component mount status

    if (url) {
      if (cached && cache[url]) {
        // If using cache and data exists in cache, set it immediately
        setData(cache[url])
      } else {
        // Otherwise, perform the async fetch operation
        (async () => {
          if (!unmounted) { // Only proceed if component is still mounted
            setData(null) // Reset current data
            setLoading(true) // Set loading to true before fetching

            try {
              const data = await loadAsync(url)
              if (cached) cache[url] = data // Cache the fetched data if caching is enabled
              setData(data) // Update state with fetched data
            } catch (e) {
              setError(e) // Handle errors during fetch
            }

            setLoading(false) // Set loading to false after fetch completes
          }
        })()
      }
    }

    return () => {
      unmounted = true // Cleanup function to set unmounted flag on component unmount
    }
  }, [url]) // Re-run effect when URL changes

  return [data, loading, error] // Return current data, loading status, and any errors
}

export default useFetch3dObject
