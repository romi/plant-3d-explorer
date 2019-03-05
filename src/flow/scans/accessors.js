import { useState, useEffect } from 'react'

import useAccessor from 'rd/tools/accessor'
import useReactRouter from 'use-react-router'

import useFetch from 'rd/tools/hooks/fetch'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'

import { basename } from 'common/routing'
import scans from 'data/index.json'

console.log(
  scans
)

export function useScan () {
  const [state, setState] = useState(null)
  const { match } = useReactRouter()
  const [scans] = useScans()
  const selectedid = match.params.scanId
  const [scanData] = useFetch(basename + scans[selectedid])

  useEffect(
    () => {
      if (scanData) {
        setState(scanData)
      }
    },
    [scanData]
  )

  return [
    state,
    scans
  ]
}

export function useScanFiles (scan) {
  console.log(
    scan
  )
  return [
    useFetch3dObject(scan && (basename + scan.filesUri.mesh)),
    useFetch3dObject(scan && (basename + scan.filesUri.pointCloud))
  ]
}

export const useScans = useAccessor(
  [
    (state, props) => {
      return scans
    }
  ]
)
