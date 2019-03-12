import { useMemo } from 'react'

import useReactRouter from 'use-react-router'

import useFetch from 'rd/tools/hooks/fetch'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'
import { chain } from 'rd/tools/enhancers'

import { getScanFile, getScanURI } from 'common/api'

import { relativePhotoURIEnhancer, forgeCameraPointsEnhancer } from './enhancers'

export function useScan () {
  const { match } = useReactRouter()
  const selectedid = match.params.scanId
  const [scanData] = useFetch(getScanURI(selectedid), true)

  const enhancedScan = useMemo(
    () => {
      if (scanData) {
        return chain([
          relativePhotoURIEnhancer,
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
