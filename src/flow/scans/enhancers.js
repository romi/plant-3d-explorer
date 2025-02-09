/*

Plant 3D Explorer: An browser application for 3D scanned
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
import { orderBy } from 'natural-orderby'
import * as THREE from 'three'
import { last } from 'lodash'

import { getScanArchiveURI, getFullURI, getScanMetadataURI, getScanSequenceURI, getScanSkeletonURI } from 'common/api'

const imgLoader = new THREE.TextureLoader()
imgLoader.crossOrigin = 'Anonymous'

/**
 * Enhances the given scan object by updating the photo URI for each pose in the camera data.
 *
 * The function takes a scan object as input and modifies its structure by processing the
 * `camera.poses` array. Each pose's `photoUri` property is updated using the `getFullURI` function.
 *
 * @param {Object} scan - The scan object containing camera and pose data.
 * @returns {Object} A new scan object with enhanced photo URIs for the poses.
 */
export const relativeScanPhotoURIEnhancer = (scan) => {
  return {
    ...scan,
    camera: {
      ...scan.camera,
      poses: scan.camera.poses.map((d) => {
        return {
          ...d,
          photoUri: getFullURI(d.photoUri)
        }
      })
    }
  }
}

/**
 * Enhances an array of scan objects by modifying their `thumbnailUri` properties.
 *
 * This function accepts an array of objects, where each object represents a scan.
 * It maps over the array and updates each scan object by applying the `getFullURI` function
 * to its `thumbnailUri` property, while preserving all other existing properties of the object.
 *
 * @param {Array<Object>} scans - An array of scan objects to be processed.
 * @returns {Array<Object>} A new array of scan objects with enhanced `thumbnailUri` properties.
 */
export const relativeScansPhotoURIEnhancer = (scans) => {
  return scans.map((d) => {
    return {
      // Spread the existing object's properties to retain all original key-value pairs
      ...d,
      // Update `thumbnailUri` with a full URL
      thumbnailUri: getFullURI(d.thumbnailUri)
    }
  })
}

/**
 * Enhances the file URIs in the provided scans with updated photo URIs.
 *
 * This function takes an array of scan objects and maps through each scan to modify
 * its metadata. Specifically, it updates the `archive` and `metadata` properties
 * in the `files` field of the `metadata` object using the `getFullURI` function,
 * while keeping the rest of the scan's properties intact.
 *
 * @param {Array<Object>} scans - An array of scan objects to be processed. Each scan object
 * contains metadata and file properties that will be enhanced.
 * @returns {Array<Object>} A new array of scan objects with enhanced file URIs.
 */
export const relativeScansFilesURIEnhancer = (scans) => {
  console.log('Original scans array:', scans) // Debug the provided array
  return scans.map((d) => {
    console.log('Inspecting metadata for scan with ID:', d.id, '; Metadata:', d.metadata) // Debug metadata structure
    const metadata = d.metadata || {} // Fallback to an empty object if metadata is undefined
    const files = metadata.files || {} // Fallback to an empty object if files are undefined

    console.log('Original archive file:', files.archive || 'No archive file found.')
    console.log('Original metadata file:', files.metadata || 'No metadata file found.')

    // Use getScanArchiveURI if getFullURI returns an empty string
    const archiveURI = getFullURI(files.archive || '') || getScanArchiveURI(d.id)
    console.log('Resolved archive URI:', archiveURI)

    // Use getScanMetadata if getFullURI returns an empty string
    const metadataURI = getFullURI(files.metadata || '') || getScanMetadataURI(d.id)
    console.log('Resolved metadata URI:', metadataURI)

    return {
      ...d, // Spread the original scan object to retain all properties
      metadata: {
        ...d.metadata, // Spread the existing metadata
        files: {
          archive: archiveURI, // Either the result of getFullURI or getScanArchiveURI
          metadata: metadataURI // Either the result of getFullURI or getScanMetadata
        }
      }
    }
  })
}

/**
 * Enhances the URIs for files within a scan object by converting relative paths
 * to complete URIs for specific file properties (`archive` and `metadata`)
 * in the scan metadata.
 *
 * @function
 * @name relativeScanFilesURIEnhancer
 * @param {Object} scan - The scan object to be enhanced.
 * @param {Object} scan.metadata - The metadata associated with the scan.
 * @param {Object} scan.metadata.files - The files object within the metadata.
 * @param {string} scan.metadata.files.archive - The relative URI of the archive file.
 * @param {string} scan.metadata.files.metadata - The relative URI of the metadata file.
 * @returns {Object} A new scan object with updated URIs for the `archive` and `metadata` properties.
 */
export const relativeScanFilesURIEnhancer = (scan) => {
  return {
    ...scan,
    metadata: {
      ...scan.metadata,
      files: {
        archive: getFullURI(scan.metadata.files.archive), // Generate URI for the archive file using the relative URI
        metadata: getFullURI(scan.metadata.files.metadata) // Generate URI for the metadata file using the relative URI
      }
    }
  }
}

export const scanDataEnhancer = (scan) => {
  return {
    ...scan,
    data: {
      skeleton: getScanSkeletonURI(scan.id),
      angles: getScanSequenceURI(scan.id, 'all')
    }
  }
}

/**
 * Enhances the camera points data within a given scan object, transforming the positional and rotational
 * data for easier downstream usage. The function processes the poses within the `camera` object of the scan,
 * applying transformations and additional computations to add key attributes to the output data.
 *
 * The processed `camera.poses` array is ordered by `photoUri` and each pose is enhanced with new attributes
 * such as `v3position`, `objM4rotation`, `vueM4rotation`, `index`, and `fileName`. These attributes include
 * transformed positions and rotation matrices for different view representations and additional metadata.
 *
 * @param {Object} scan - The input scan object containing camera pose data.
 * @param {Object} scan.camera - Camera-related data for the scan.
 * @param {Array} scan.camera.poses - Array of pose objects, each representing a camera's position and rotation in space.
 * @param {string} scan.camera.poses[].photoUri - URI of the photo corresponding to the pose.
 * @param {Array<Array<number>>} scan.camera.poses[].rotmat - 3x3 rotation matrix representing the pose's orientation.
 * @param {Array<number>} scan.camera.poses[].tvec - Translation vector representing the pose's position.
 * @returns {Object} A modified scan object with enhanced camera data. The `camera.poses` array is enriched
 *                   with transformed poses containing additional metadata and computed attributes.
 */
export const forgeCameraPointsEnhancer = (scan) => {
  const poses = scan.camera.poses
  let index = 0

  return {
    ...scan,
    camera: {
      ...scan.camera,
      poses: orderBy(
        poses,
        (d) => d.photoUri
      ).map((point) => {
        const m3rotation = new THREE.Matrix3()
        m3rotation.set(
          ...point.rotmat[0],
          ...point.rotmat[1],
          ...point.rotmat[2]
        )
        m3rotation.transpose()
        m3rotation.multiplyScalar(-1)

        const v3position = new THREE.Vector3(
          point.tvec[0],
          point.tvec[1],
          point.tvec[2]
        ).applyMatrix3(m3rotation)

        function createM4Rot (rotmat) {
          const m4rotation = new THREE.Matrix4()
          m4rotation.set(
            ...point.rotmat[0], 0,
            ...point.rotmat[1], 0,
            ...point.rotmat[2], 0,
            0, 0, 0, 1
          )
          return m4rotation
        }

        const objM4rotation = createM4Rot()
        const objT = new THREE.Matrix4().makeRotationX(-Math.PI / 2)
        objM4rotation.transpose()
        objM4rotation.multiply(objT)

        const vueM4rotation = createM4Rot()
        const vueT = new THREE.Matrix4().makeRotationX(-Math.PI)
        vueM4rotation.transpose()
        vueM4rotation.multiply(vueT)

        return {
          index: index++,
          id: point.photoUri,
          fileName: last(point.photoUri.split('/')),
          ...point,
          v3position,
          objM4rotation,
          vueM4rotation
        }
      })
    }
  }
}

/**
 * Enhances an array of image paths by converting them into objects containing
 * the original path and a loaded texture.
 *
 * @param {string[]} imageSet - An array of image file paths to be processed and enhanced.
 * @returns {Object[]} An array of objects, each containing:
 *                     - `path`: The original image path.
 *                     - `texture`: The loaded texture corresponding to the image path.
 */
export const forgeImageSetEnhancer = (imageSet) => {
  return imageSet.map((d) => ({ path: d, texture: imgLoader.load(d) }))
}
