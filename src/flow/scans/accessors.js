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

import { scansURIQuery, getScanFile, getFile, getScanURI } from 'common/api'

import { sortingMethods } from './reducer'

import {
  relativeScansPhotoURIEnhancer,
  relativeScansFilesURIEnhancer,
  relativeScanPhotoURIEnhancer,
  forgeCameraPointsEnhancer,
  relativeScanFilesURIEnhancer,
  forgeImageSetEnhancer
} from './enhancers'

export function useScan () {
  /**
    This is a hook used to get info on a scan. For more information
    on the exact structure of a scan, check out the REST API of
    <a href='https://github.com/romi/romidata'>romidata</a>.
   */
  const { match } = useReactRouter()
  const selectedId = match.params.scanId
  const [scanData] = useFetch(getScanURI(selectedId), true)

  const enhancedScan = useMemo(
    () => {
      if (scanData) {
        return chain([
          relativeScanFilesURIEnhancer,
          relativeScanPhotoURIEnhancer,
          forgeCameraPointsEnhancer
        ], scanData)
      }
    },
    [scanData]
  )

  return [enhancedScan]
}

export function useImageSet (id) {
  const { match } = useReactRouter()
  const selectedId = match.params.scanId
  const [fileset] = useFetch(getScanFile(selectedId, 'files.json'))
  const enhancedSet = useMemo(() => {
    if (!fileset) return null
    const imageSet = fileset.filesets.find((d) => d.id.toLowerCase().match(id))
    return forgeImageSetEnhancer(imageSet.files
      .map((d) => getScanFile(selectedId, imageSet.id + '/' + d.file)))
  }, [selectedId, id, fileset])
  return enhancedSet
}

export function useFile (id, file = null, options = {}) {
  /**
    This hook allows loading any file from a scan.

    - id: The id (string) of the fileset where the file is located. Check
      out the doc of romidata for more info on filesets. The
      string doesn't need to been the exact name of the set, but it
      should be at least a substring of the set id.
    - file: id of the file to load (usually the file name without the
        extension). The full file name can be written with the right options.
        If no file is provided, the fileset in its entierety will be returned.
    - options: Different options that modify the behavior of the hook.
      possible options are:
      <ul>
      <li>
        metadata: if true, instead of the fileset id, search for the file in the
        metadata folder of the scan.
      </li>
      <li>
        rawFileName: if true, the file name is a full file name (exact name with
        extension).
      </li>
      </ul>
  */
  const { match } = useReactRouter()
  const selectedId = match.params.scanId
  const [files] = useFetch(getScanFile(selectedId, 'files.json'))

  const path = useMemo(() => {
    if (!files) return
    const set = files.filesets.find((d) => d.id.match(id))
    if (file && set) {
      return getScanFile(selectedId,
        (options.metadata ? 'metadata/' : '') +
          set.id + '/' +
          (options.rawFileName ? file : set.files.find((d) => d.file.match(file)).file))
    }
    return set
  }, [id, file, files, selectedId, options])
  return [useFetch(path), path]
}

export function useSegmentedPointCloud () {
  const [[pointCloud]] = use3dFile('SegmentedPointCloud', 'SegmentedPointCloud')
  const [[segmentation]] = useFile('SegmentedPointCloud',
    'SegmentedPointCloud.json', { metadata: true, rawFileName: true })
  return [pointCloud, segmentation]
}

export function use3dFile (id, file = null, options = {}) {
  /**
   Hook to load a 3D file form a scan (usually .ply). See
    the useFile hook for info on the parameters.
   */
  const [, path] = useFile(id, file, options)
  return [useFetch3dObject(path), path]
}

export function useScanFiles (scan) {
  /**
    Hook to load the mesh and pointCloud ply files from a scan.

    - scan: An object representing a scan (see the useScan hook).
   */
  return [
    useFetch3dObject(scan && (getFile(scan.filesUri.mesh))),
    useFetch3dObject(scan && (getFile(scan.filesUri.pointCloud)))
  ]
}

export function useScans (search) {
  /**
   Hook to load all scans the server has. For more detail on the
    format of the returned object, check out the REST API at the
    <a href='https://github.com/romi/romidata'> romidata repository </a>.

   - search: A string used to filter the scans. The filtering is made
    server-side.
   */
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
