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
import { orderBy } from 'natural-orderby'
import * as THREE from 'three'
import { last } from 'lodash'

import { getScanPhotoURI } from 'common/api'

const imgLoader = new THREE.TextureLoader()
imgLoader.crossOrigin = 'Anonymous'

export const relativeScanPhotoURIEnhancer = (scan) => {
  return {
    ...scan,
    camera: {
      ...scan.camera,
      poses: scan.camera.poses.map((d) => {
        return {
          ...d,
          photoUri: getScanPhotoURI(d.photoUri)
        }
      })
    }
  }
}

export const relativeScansPhotoURIEnhancer = (scans) => {
  return scans.map((d) => {
    return {
      ...d,
      thumbnailUri: getScanPhotoURI(d.thumbnailUri)
    }
  })
}

export const relativeScansFilesURIEnhancer = (scans) => {
  return scans.map((d) => {
    return {
      ...d,
      metadata: {
        ...d.metadata,
        files: {
          archive: getScanPhotoURI(d.metadata.files.archive),
          metadatas: getScanPhotoURI(d.metadata.files.metadatas)
        }
      }
    }
  })
}

export const relativeScanFilesURIEnhancer = (scan) => {
  return {
    ...scan,
    metadata: {
      ...scan.metadata,
      files: {
        archive: getScanPhotoURI(scan.metadata.files.archive),
        metadatas: getScanPhotoURI(scan.metadata.files.metadatas)
      }
    }
  }
}

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

export const forgeImageSetEnhancer = (imageSet) => {
  console.log(imageSet)
  return imageSet.map((d) => ({ path: d, texture: imgLoader.load(d) }))
}
