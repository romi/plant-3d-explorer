import { useMemo } from 'react'

import useReactRouter from 'use-react-router'

import useFetch from 'rd/tools/hooks/fetch'
import useAccessor from 'rd/tools/hooks/accessor'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'
import { chain } from 'rd/tools/enhancers'

import { scansURIQuery, getScanFile, getScanURI } from 'common/api'

import {
  relativeScansPhotoURIEnhancer,
  relativeScansFilesURIEnhancer,
  relativeScanPhotoURIEnhancer,
  forgeCameraPointsEnhancer
} from './enhancers'

export function useScan () {
  const { match } = useReactRouter()
  const selectedid = match.params.scanId
  const [scanData] = useFetch(getScanURI(selectedid), true)

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
