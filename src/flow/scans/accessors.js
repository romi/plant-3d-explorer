import { useState, useEffect, useMemo } from 'react'

import useReactRouter from 'use-react-router'

import useFetch from 'rd/tools/hooks/fetch'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'

import { getScanFile, getScanURI, getScanPhotoURI } from 'common/api'

export function useScan () {
  const [state, setState] = useState(null)
  const { match } = useReactRouter()
  const selectedid = match.params.scanId
  const [scanData] = useFetch(getScanURI(selectedid), true)
  const newScan = useMemo(
    () => {
      if (scanData) {
        return {
          ...scanData,
          camera: {
            ...scanData.camera,
            poses: scanData.camera.poses.map((d) => {
              return {
                ...d,
                photoUri: getScanPhotoURI(d.photoUri)
              }
            })
          }
        }
      } else {
        return null
      }
    },
    [scanData]
  )

  useEffect(
    () => {
      if (newScan) setState(newScan)
    },
    [newScan]
  )

  return [state]
}

export function useScanFiles (scan) {
  return [
    useFetch3dObject(scan && (getScanFile(scan.filesUri.mesh))),
    useFetch3dObject(scan && (getScanFile(scan.filesUri.pointCloud)))
  ]
}
