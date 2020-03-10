/*

Romi 3D PlantViewer: An browser application for 3D scanned
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
import PLYLoader from 'common/thiers/PLYLoader'
import * as THREE from 'three'

const enhancedTHREE = PLYLoader(THREE)
const cache = {}
export const loader = new enhancedTHREE.PLYLoader()

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

  return [ data, loading, error ]
}

export default useFetch3dObject
