import React, { useRef, useEffect, useState } from 'react'
import NaturalSort from 'alphanum-sort'
import * as THREE from 'three'

import { basename } from 'common/routing'

import { styled } from 'rd/nano'
import useFetch3dObject from 'rd/tools/hooks/fetch3dObject'
import useFetch from 'rd/tools/hooks/fetch'

import { useLayers, useSelectedcamera } from 'flow/settings/accessors'

import WorldObject from './object'
import urls from '../assets'

const Container = styled.div({
  width: '100%',
  height: '100%'
})

const getSize = (elem) => elem.getBoundingClientRect()

const imgLoader = new THREE.TextureLoader()

export function useCameraPoses () {
  const [state, setState] = useState(null)
  const [metadata] = useFetch(urls.metadata)
  let index = 0

  if (!state && metadata) {
    setState(
      NaturalSort(
        Object.keys(metadata.poses)
      ).map((key) => {
        const point = metadata.poses[key]
        const file = `${key}.jpg`

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
          id: key,
          file,
          ...point,
          v3position,
          objM4rotation,
          vueM4rotation,
          texture: imgLoader.load(`${basename}images/${file}`)
        }
      })
    )
  }

  return state
}

export default function WorldComponent (props) {
  const canvasRef = useRef(null)
  const [world, setWorld] = useState(null)
  const [meshGeometry] = useFetch3dObject(urls.mesh)
  const [pointCloudGeometry] = useFetch3dObject(urls.pointCloud)
  const [skeletonPoints] = useFetch(urls.skeleton)
  const [metadata] = useFetch(urls.metadata)
  const cameraPoses = useCameraPoses()
  const [layers] = useLayers()
  const [selectedCamera] = useSelectedcamera()

  useEffect(
    () => {
      const { width, height } = getSize(canvasRef.current)
      const world = new WorldObject(width, height, canvasRef.current)
      setWorld(world)
    },
    [canvasRef]
  )

  useEffect(
    () => {
      if (world && metadata) world.setMetaData(metadata)
    },
    [world, metadata, meshGeometry, pointCloudGeometry, skeletonPoints]
  )

  useEffect(
    () => {
      if (world && cameraPoses) world.setCameraPoints(cameraPoses)
    },
    [world, cameraPoses]
  )

  useEffect(
    () => {
      if (world) world.setSelectedCamera(selectedCamera)
    },
    [world, selectedCamera]
  )

  useEffect(
    () => {
      if (world && meshGeometry) world.setMeshGeometry(meshGeometry)
    },
    [world, meshGeometry]
  )
  useEffect(
    () => {
      if (world && pointCloudGeometry) world.setPointcloudGeometry(pointCloudGeometry)
    },
    [world, pointCloudGeometry]
  )

  useEffect(
    () => {
      if (world && skeletonPoints) world.setSkeletonPoints(skeletonPoints)
    },
    [world, skeletonPoints]
  )

  useEffect(
    () => {
      if (world) world.setLayers(layers)
    },
    [world, layers]
  )

  return <Container
    $ref={canvasRef}
  />
}
