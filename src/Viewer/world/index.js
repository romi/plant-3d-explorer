import React, { useRef, useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'

import { useElementMouse } from 'rd/tools/hooks/mouse'

import { useLayers } from 'flow/settings/accessors'
import { useSelectedcamera, useHoveredCamera } from 'flow/interactions/accessors'
import { useScanFiles, useScan } from 'flow/scans/accessors'

import WorldObject from './object'
import useViewport2d from './behaviors/viewport2d'
import { useWorld3dReset, useWorld2dReset } from './shares'

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
  const [hoveredCamera, setHoveredCamera] = useHoveredCamera()
  const mouse = useElementMouse(canvasRef)
  const [lastSelectedCamera] = useState({ camera: null })

  const [scan] = useScan()

  const [[meshGeometry], [pointCloudGeometry]] = useScanFiles(scan)
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
  const [, setWorldViewResetShare] = useWorld3dReset(null)
  const [, setWorld2dViewResetShare] = useWorld2dReset(null)

  useEffect(
    () => {
      const { width, height } = getSize(canvasRef.current)
      const world = new WorldObject(width, height, canvasRef.current)
      world.onHover((data) => {
        setHoveredCamera(data)
      })
      setWorld(world)
      setWorldViewResetShare(world.resetControls)
      setWorld2dViewResetShare(resetViewport2d)

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
      if (world) world.setHoveredCamera(hoveredCamera)
    },
    [world, hoveredCamera]
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
      if (world) world.setMouse(mouse)
    },
    [world, mouse]
  )

  useEffect(
    () => {
      if (world) world.setLayers(layers)
    },
    [world, layers]
  )

  return <Container
    ref={canvasRef}
    onMouseDown={eventFns.onMouseDown}
    onMouseUp={eventFns.onMouseUp}
    onMouseMove={eventFns.onMouseMove}
    onWheel={eventFns.onWheel}
  />
}

/**
|--------------------------------------------------
| ANIMATION
|--------------------------------------------------
*/

// import { config } from 'react-spring'
// import { Spring } from 'react-spring/renderprops'
//
// <CameraTransitionner world={world} selectedCamera={selectedCamera} />
// function CameraTransitionner ({ world, selectedCamera }) {
//   return <Spring
//     from={{ transition: 0 }}
//     to={{ transition: selectedCamera ? 1 : 0 }}
//   >
//     {
//       props => {
//         if (world) world.animateCamera(props.transition, !!selectedCamera)
//         return null
//       }
//     }
//   </Spring>
// }
