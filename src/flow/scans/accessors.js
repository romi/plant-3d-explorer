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
