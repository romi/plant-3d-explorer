import React, { useRef, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { styled } from 'rd/nano'

import { useLayers } from 'flow/settings/accessors'
import { useSelectedcamera } from 'flow/interactions/accessors'
import { useScanFiles, useScan } from 'flow/scans/accessors'

import WorldObject from './object'
import useViewport2d from './behaviors/viewport2d'

const Container = styled.div({
  width: '100%',
  height: '100%'
})

const getSize = (elem) => elem.getBoundingClientRect()

export default function WorldComponent (props) {
  const windowSider = useWindowSize()
  const canvasRef = useRef(null)
  const [world, setWorld] = useState(null)
  const [layers] = useLayers()
  const [selectedCamera] = useSelectedcamera()
  const [lastSelectedCamera] = useState({ camera: null })
  const [viewport, eventFns, resetViewport2d] = useViewport2d(
    () => {
      let width
      let height
      if (canvasRef.current) {
        const size = getSize(canvasRef.current)
        width = size.width
        height = size.height
      }
      return [width, height]
    }
  )

  const [scan] = useScan()
  const [
    [meshGeometry],
    [pointCloudGeometry]
  ] = useScanFiles(scan)

  useEffect(
    () => {
      const { width, height } = getSize(canvasRef.current)
      const world = new WorldObject(width, height, canvasRef.current)
      setWorld(world)

      return () => world.unmount()
    },
    [canvasRef]
  )

  useEffect(
    () => {
      if (world) {
        const { width, height } = getSize(canvasRef.current)
        world.setSize(width, height)
      }
    },
    [windowSider, world]
  )

  useEffect(
    () => {
      if (world) world.setViewport(...viewport)
    },
    [world, viewport]
  )

  useEffect(
    () => {
      if (world && scan && scan.workspace) world.setWorkSpace(scan.workspace)
    },
    [world, scan, meshGeometry, pointCloudGeometry]
  )

  useEffect(
    () => {
      if (world && scan && scan.camera) world.setCamera(scan.camera)
    },
    [world, scan, meshGeometry, pointCloudGeometry]
  )

  useEffect(
    () => {
      if (world && scan && scan.camera) {
        world.setCameraPoints(scan.camera.poses)
      }
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (world) world.setSelectedCamera(selectedCamera)
      if (lastSelectedCamera.camera !== selectedCamera) resetViewport2d()
      lastSelectedCamera.camera = selectedCamera
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
      if (world && pointCloudGeometry) {
        world.setPointcloudGeometry(pointCloudGeometry)
      }
    },
    [world, pointCloudGeometry]
  )

  useEffect(
    () => {
      if (
        world && scan && scan.data.skeleton
      ) world.setSkeletonPoints(scan.data.skeleton)
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (
        world && scan && scan.data.angles
      ) world.setAnglesPoints(scan.data.angles)
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (world) world.setLayers(layers)
    },
    [world, layers]
  )

  return <Container
    onMouseDown={eventFns.onMouseDown}
    onMouseUp={eventFns.onMouseUp}
    onMouseMove={eventFns.onMouseMove}
    onWheel={eventFns.onWheel}

    $ref={canvasRef}
  />
}
