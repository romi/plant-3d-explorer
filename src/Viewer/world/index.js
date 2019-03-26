import React, { useRef, useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { filter } from 'lodash'

import { useElementMouse } from 'rd/tools/hooks/mouse'

import { useLayers } from 'flow/settings/accessors'
import { useSelectedcamera, useHoveredCamera, useReset3dView, useReset2dView, useHoveredAngle, useSelectedAngle } from 'flow/interactions/accessors'
import { useScanFiles, useScan } from 'flow/scans/accessors'

import WorldObject from './object'
import useViewport2d from './behaviors/viewport2d'

import { headerHeight } from 'Viewer/Header'
import { moduleHeight as carouselHeight } from 'Viewer/Carousel'
import { moduleWidth as angleModuleWidth } from 'Viewer/Angles'
import { useWindowSize } from 'react-use'

const Container = styled.div({
  position: 'relative',
  width: '100%',
  height: '100%'
})

const CanvasContainer = styled.div({
  position: 'absolute',
  width: '100%',
  height: '100%'
})

const getSize = (elem) => ({
  width: window.innerWidth,
  height: window.innerHeight - headerHeight - carouselHeight
})

export default function WorldComponent (props) {
  const windowSize = useWindowSize()
  const canvasRef = useRef()
  const [world, setWorld] = useState(null)
  const [layers] = useLayers()
  const [selectedCamera] = useSelectedcamera()
  const [hoveredCamera, setHoveredCamera] = useHoveredCamera()
  const [hoveredAngle] = useHoveredAngle()
  const [selectedAngle] = useSelectedAngle()
  const mouse = useElementMouse(canvasRef)
  const [lastSelectedCamera] = useState({ camera: null })

  const [scan] = useScan()

  const [[meshGeometry], [pointCloudGeometry]] = useScanFiles(scan)
  const [viewport, eventFns, resetViewport2d] = useViewport2d(
    () => {
      let width
      let height
      if (canvasRef.current) {
        const size = getSize()
        width = size.width
        height = size.height
      }
      return [
        scan && scan.data.angles
          ? width - angleModuleWidth
          : width,
        height
      ]
    }
  )
  const [, setReset3dView] = useReset3dView()
  const [, setReset2dView] = useReset2dView()

  useEffect(
    () => {
      if (canvasRef.current && !world) {
        const { width, height } = getSize()
        const world = new WorldObject(
          scan && scan.data.angles
            ? width - angleModuleWidth
            : width,
          height,
          canvasRef.current
        )
        world.onHover((data) => setHoveredCamera(data))
        setWorld(world)
      }

      return () => {
        if (world) world.unmount()
      }
    },
    [canvasRef.current]
  )

  useEffect(
    () => {
      if (world) {
        setReset3dView({
          fn: world.resetControls
        })
        setReset2dView({
          fn: resetViewport2d
        })
      }
    },
    [world]
  )

  useEffect(
    () => {
      if (world) {
        const { width, height } = getSize()

        world.setSize(
          scan && scan.data.angles
            ? width - angleModuleWidth
            : width,
          height
        )
      }
    },
    [world, scan, windowSize]
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
    [world, scan]
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
        world.setLayers(layers)
      }
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (world) world.setHoveredCamera(hoveredCamera)
    },
    [world, hoveredCamera]
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
      if (world) {
        world.setLayers(layers)
        world.setHighlightedAngle(filter([selectedAngle, hoveredAngle]))
      }
    },
    [world, hoveredAngle, selectedAngle, layers]
  )

  useEffect(
    () => {
      if (world && meshGeometry) {
        world.setMeshGeometry(meshGeometry)
        world.setLayers(layers)
      }
    },
    [world, meshGeometry]
  )
  useEffect(
    () => {
      if (world && pointCloudGeometry) {
        world.setPointcloudGeometry(pointCloudGeometry)
        world.setLayers(layers)
      }
    },
    [world, pointCloudGeometry]
  )

  useEffect(
    () => {
      if (world && scan && scan.data.skeleton) {
        world.setSkeletonPoints(scan.data.skeleton)
        world.setLayers(layers)
      }
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (world && scan && scan.data.angles) {
        world.setAnglesPoints(scan.data.angles)
        world.setLayers(layers)
      }
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (world) world.setMouse(mouse)
    },
    [world, mouse]
  )

  return <Container>
    <CanvasContainer
      ref={canvasRef}
      onMouseDown={eventFns.onMouseDown}
      onMouseUp={eventFns.onMouseUp}
      onMouseMove={eventFns.onMouseMove}
      onWheel={eventFns.onWheel}
    />
  </Container>
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
