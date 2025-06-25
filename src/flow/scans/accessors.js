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
import { useMemo } from 'react'

import useReactRouter from 'use-react-router'

import useFetch from 'rd/tools/hooks/fetch'
import useAccessor from 'rd/tools/hooks/accessor'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'
import { chain } from 'rd/tools/enhancers'

import { getFullURI, getScanFile, getScanURI, scansURIQuery } from 'common/api'

import { sortingMethods } from './reducer'

import {
  forgeCameraPointsEnhancer,
  forgeImageSetEnhancer,
  relativeScanFilesURIEnhancer,
  relativeScanPhotoURIEnhancer,
  relativeScansFilesURIEnhancer,
  relativeScansPhotoURIEnhancer,
  scanDataEnhancer
} from './enhancers'
import useFetchObject from '../../rd/tools/hooks/useFetchObject'

/**
 * A custom hook that retrieves and enhances scan data using specific enhancers.
 *
 * This hook fetches scan data based on the scan ID obtained from the route parameters,
 * applies a series of enhancers to augment the scan data, and returns the enhanced scan.
 *
 * @return {Array} An array containing the enhanced scan data, or an empty array if no data is available.
 */
export function useScan () {
  /**
   This is a hook used to get info on a scan. For more information
   on the exact structure of a scan, check out the REST API of
   <a href='https://github.com/romi/plantdb'>plantdb</a>.
   */
  const { match } = useReactRouter()
  const selectedId = match.params.scanId
  const scanDataURI = getScanURI(selectedId)
  const [scanData] = useFetch(scanDataURI, true)

  const enhancedScan = useMemo(
    () => {
      if (scanData) {
        return chain([
          relativeScanFilesURIEnhancer,
          relativeScanPhotoURIEnhancer,
          scanDataEnhancer,
          forgeCameraPointsEnhancer
        ], scanData)
      }
    },
    [scanData]
  )

  return [enhancedScan]
}

/**
 * A hook that retrieves and enhances an image set based on the given identifier.
 *
 * @param {string} imageFilesetId - The identifier used to match and retrieve the specific image fileset. Usually 'images', 'undistorted' or 'masks'.
 * @return {Object|null} The enhanced image set object, or null if no matching set is found or if data is unavailable.
 */
export function useImageSet (imageFilesetId) {
  // Extract `match` object from the `useReactRouter` hook which provides access to route parameters
  const { match } = useReactRouter()
  const selectedId = match.params.scanId
  const scanFileURI = getScanFile(selectedId, 'files.json')
  const [fileset] = useFetch(scanFileURI, false)

  return useMemo(() => {
    if (!fileset) {
      return null
    }

    const imageSet = fileset.filesets.find((d) => d.id.toLowerCase().match(imageFilesetId))
    if (!imageSet) {
      return null
    }

    return forgeImageSetEnhancer(imageSet.files
      .map((d) => getScanFile(selectedId, imageSet.id + '/' + d.file)))
  }, [selectedId, imageFilesetId, fileset])
}

/**
 * This hook allows loading a file or fileset from a scan based on specific parameters.
 *
 * @param {string} id - The ID or partial ID of the fileset where the file is located. It should match or be a substring of the fileset ID.
 * @param {string|null} [file=null] - The ID of the individual file to load, such as its name without the extension. If no file is provided, the entire fileset is returned.
 * @param {Object} [options={}] - Optional settings to modify the hook's behavior.
 * @param {boolean} [options.metadata=false] - If true, searches for the file in the metadata folder of the scan.
 * @param {boolean} [options.rawFileName=false] - If true, considers the file name as a full name, including its extension.
 * @return {Array} An array where the first element is the result of the fetch operation (data or loading state) and the second element is the computed file path.
 */
export function useFile (id, file = null, options = {}) {
  /**
   This hook allows loading any file from a scan.

   - id: The id (string) of the fileset where the file is located. Check
   out the doc of plantdb for more info on filesets. The
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
  const scanFilesURI = getScanFile(selectedId, 'files.json')
  const [files] = useFetch(scanFilesURI)

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

/**
 * Custom hook to retrieve and manage a segmented point cloud dataset.
 * Combines point cloud data and its corresponding segmentation file for use in the application.
 *
 * @return {Array} An array where the first element is the point cloud and the second element is its segmentation data.
 */
export function useSegmentedPointCloud () {
  const [[pointCloud]] = use3dFile('SegmentedPointCloud', 'SegmentedPointCloud')
  const [[segmentation]] = useFile('SegmentedPointCloud',
    'SegmentedPointCloud.json', { metadata: true, rawFileName: true })
  return [pointCloud, segmentation]
}

/**
 * A hook to load a 3D file (usually .ply) from a scan. It utilizes the useFile hook
 * to manage the file loading process and retrieves the 3D object using useFetch3dObject.
 *
 * @param {string} id - The unique identifier for the 3D file.
 * @param {File|null} [file=null] - The optional file object to be loaded.
 * @param {Object} [options={}] - Additional options to configure the file loading process.
 * @return {Array} Returns an array where the first element is the fetched 3D object and the second element is the file path.
 */
export function use3dFile (id, file = null, options = {}) {
  /**
   Hook to load a 3D file form a scan (usually .ply). See
   the useFile hook for info on the parameters.
   */
  const [, path] = useFile(id, file, options)
  return [useFetch3dObject(path), path]
}

export function useScanFiles (scan) {
  return [
    // Fetch the mesh file if scan exists, otherwise returns undefined
    useFetch3dObject(scan && getFullURI(scan.filesUri.mesh), true),

    // Fetch the point cloud file if scan exists
    useFetch3dObject(scan && getFullURI(scan.filesUri.pointCloud), true),

    // Fetch the skeleton file if scan exists
    useFetchObject(scan && getFullURI(scan.skeleton), true),

    // Fetch the angles file if scan exists
    useFetchObject(scan && getFullURI(scan.angles), true),

    // Fetch the ground truth PCD file if scan exists
    useFetch3dObject(scan && getFullURI(scan.filesUri.pcdGroundTruth), true)
  ]
}

/**
 * Hook to load all scans from the server.
 *
 * It provides enhanced scan data after applying transformations to include relative URIs to photos and files.
 * For more detail on the format of the returned object, check out the REST API at the
 * <a href='https://github.com/romi/plantdb'> plantdb repository </a>.
 *
 * @param {string} search A string used to filter the scans. The filtering is performed server-side.
 * @return {Array} An array containing the enhanced scan data with additional URIs for photos and files.
 */
export function useScans (search) {
  const [scans] = useFetch(scansURIQuery(search), true)

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

/**
 * A state accessor and setter for managing the search query in the application's state.
 *
 * The `useSearchQuery` variable acts as a custom hook or utility function to retrieve
 * the current value of `searchQuery` from the state and dispatch updates to modify it.
 *
 * It performs two primary operations:
 * 1. Accessing the `searchQuery` value from the `scans` portion of the state.
 * 2. Dispatching an action to update the `searchQuery` value by creating an action
 *    object with the type `'SET_SEARCH_QUERY'` and the new value.
 *
 * This is typically used for querying data or filtering results within the application.
 */
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

/**
 * A hook-like variable that manages and updates sorting methods within the application state.
 *
 * This variable leverages `useAccessor` to retrieve and update sorting information for a list of scans.
 * It utilizes an array of getter and setter functions to handle the current sorting selection and the availability of sorting methods.
 *
 * The first getter function retrieves the current sorting method from the application state.
 * It ensures the sorting state is updated in alignment with the state management system.
 * The second getter function returns an array of sorting methods, ensuring the currently selected sorting method reflects any changes.
 *
 * The setter function dispatches an action to update the state with a newly selected sorting method.
 * It emits a `SET_SORTING` action with the specified value to modify the sorting configuration within the state.
 *
 * @type {Object} useSorting - Provides state and action management for sorting operations in the application.
 */
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

/**
 * A variable that manages the sorting method used for a set of scans.
 * It utilizes the `useAccessor` function to define the getter and setter for the sorting state.
 * The getter retrieves the current sorting method from the state, defaulting to 'date' if no method is specified.
 * The setter creates an action with the type 'SET_SORTING' and the specified value to update the sorting method.
 */
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

/**
 * A state management accessor for handling the filtering state in the application.
 *
 * `useFiltering` provides a way to access and modify the `filtering` */
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
