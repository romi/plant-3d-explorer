import React, { useRef, useEffect, useState } from 'react'

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

export default function WorldComponent (props) {
  const canvasRef = useRef(null)
  const [world, setWorld] = useState(null)
  const [meshGeometry] = useFetch3dObject(urls.mesh)
  const [pointCloudGeometry] = useFetch3dObject(urls.pointCloud)
  const [skeletonPoints] = useFetch(urls.skeleton)
  const [metadata] = useFetch(urls.metadata)
  const [cameraPoints] = useFetch(urls.cameraPoints)
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
      if (world && cameraPoints) world.setCameraPoints(cameraPoints)
    },
    [world, cameraPoints]
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
