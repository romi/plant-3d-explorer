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
import { useMemo } from 'react'

import useReactRouter from 'use-react-router'

import useFetch from 'rd/tools/hooks/fetch'
import useAccessor from 'rd/tools/hooks/accessor'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'
import { chain } from 'rd/tools/enhancers'

import { scansURIQuery, getScanFile, getScanURI } from 'common/api'

import { sortingMethods } from './reducer'

import {
  relativeScansPhotoURIEnhancer,
  relativeScansFilesURIEnhancer,
  relativeScanPhotoURIEnhancer,
  forgeCameraPointsEnhancer
} from './enhancers'

export function useScan () {
  const { match } = useReactRouter()
  const selectedId = match.params.scanId
  const [scanData] = useFetch(getScanURI(selectedId), true)

  const enhancedScan = useMemo(
    () => {
      if (scanData) {
        return chain([
          relativeScanPhotoURIEnhancer,
          forgeCameraPointsEnhancer
        ], scanData)
      }
    },
    [scanData]
  )

  return [enhancedScan]
}

export function useScanFiles (scan) {
  return [
    useFetch3dObject(scan && (getScanFile(scan.filesUri.mesh))),
    useFetch3dObject(scan && (getScanFile(scan.filesUri.pointCloud)))
  ]
}

export function useScans (search) {
  const [scans] = useFetch(scansURIQuery(search), false)

  const enhancedScans = useMemo(
    () => {
      if (scans) {
        return chain([
          relativeScansPhotoURIEnhancer,
          relativeScansFilesURIEnhancer
        ], scans)
      }
    },
    [scans]
  )

  return [enhancedScans]
}

export const useSearchQuery = useAccessor(
  [
    (state) => {
      return state.scans.searchQuery
    }
  ],
  [
    (value) => ({
      type: 'SET_SEARCH_QUERY',
      value
    })
  ]
)

export const useSorting = useAccessor(
  [
    (state) => {
      return state.scans.sorting
    },
    (state) => [
      ...sortingMethods.map((d) => {
        return d.label !== state.scans.sorting.label
          ? d
          : state.scans.sorting
      })
    ]
  ],
  [
    (value) => ({
      type: 'SET_SORTING',
      value
    })
  ]
)

export const useSortingMethod = useAccessor(
  [
    (state) => {
      return state.scans.sorting || 'date'
    }
  ],
  [
    (value) => ({
      type: 'SET_SORTING',
      value
    })
  ]
)

export const useFiltering = useAccessor(
  [
    (state) => {
      return state.scans.filtering
    }
  ],
  [
    (value) => ({
      type: 'SET_FILTERING',
      value
    })
  ]
)
