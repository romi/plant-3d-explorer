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
import React, { useRef, useEffect, useState } from 'react'
import useMeasure from 'react-use-measure'
import styled from '@emotion/styled'

import { useElementMouse } from 'rd/tools/hooks/mouse'

import { useLayers } from 'flow/settings/accessors'
import { useSelectedcamera, useHoveredCamera, useReset3dView, useReset2dView, useHoveredAngle, useSelectedAngle, useColor, useClickedPoint, useLabels,
  useSnapshot, useOrganInfo, useSelectedPoints, useSelectedLabel, useSelectionMethod, useRuler } from 'flow/interactions/accessors'
import { useScanFiles, useScan,
  useSegmentedPointCloud } from 'flow/scans/accessors'

import WorldObject from './object'
import useViewport2d from './behaviors/viewport2d'

import { headerHeight } from 'Viewer/Header'
import { moduleHeight as carouselHeight } from 'Viewer/Carousel'
import useViewport3d from './behaviors/viewport3d'

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

const getSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight - headerHeight - carouselHeight
})

export default function WorldComponent (props) {
  const canvasRef = useRef()
  const [containerRef, bounds] = useMeasure()
  const [world, setWorld] = useState(null)
  const [layers] = useLayers()
  const [selectedCamera] = useSelectedcamera()
  const [hoveredCamera, setHoveredCamera] = useHoveredCamera()
  const [hoveredAngle] = useHoveredAngle()
  const [selectedAngle] = useSelectedAngle()
  const [colors, setColors] = useColor()
  const [, setLabels] = useLabels()
  const [selectedLabel, setSelectedLabel] = useSelectedLabel()
  const [selectedPoints, setSelectedPoints] = useSelectedPoints()
  const [selectionMethod, setSelectionMethod] = useSelectionMethod()
  const [snapshot, setSnapshot] = useSnapshot()
  const [ruler, setRuler] = useRuler()
  const [measureClick, setMeasureClick] = useState(false)
  const mouse = useElementMouse(canvasRef)
  const [, setOrganInfo] = useOrganInfo()
  const [clickedPoint, setClickedPoint] = useClickedPoint()
  const [lastSelectedCamera] = useState({ camera: null })

  const [scan] = useScan()

  const [[meshGeometry], [pointCloudGeometry]] = useScanFiles(scan)
  const [segmentedPointCloud, segmentation] = useSegmentedPointCloud()
  const [viewport, event2dFns, resetViewport2d] = useViewport2d(
    bounds.width || getSize().width,
    bounds.height || getSize().height
  )
  const [viewport3d, event3dFns] = useViewport3d(
    bounds.width || getSize().width,
    bounds.height || getSize().height
  )
  const [, setReset3dView] = useReset3dView()
  const [, setReset2dView] = useReset2dView()
  const eventFns = selectedCamera
    ? event2dFns
    : event3dFns

  useEffect(
    () => {
      if (canvasRef.current && !world) {
        const world = new WorldObject(
          bounds.width,
          bounds.height,
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
        world.setSize(
          bounds.width,
          bounds.height
        )
        setSnapshot({
          ...snapshot,
          trueResolution: {
            width: Math.round(bounds.width),
            height: Math.round(bounds.height)
          }
        })
      }
    },
    [world, scan, bounds]
  )

  useEffect(
    () => {
      if (world && snapshot.trueResolution && snapshot.snapResolution) {
        setSnapshot({
          ...snapshot,
          image: world.takeSnapshot({
            width: snapshot.snapResolution.width || snapshot.trueResolution.width,
            height: snapshot.snapResolution.height ||
              snapshot.trueResolution.height
          })
        })
      }
    }, [snapshot.snapResolution]
  )

  useEffect(
    () => {
      if (world) {
        world.setViewport(...viewport)
      }
    },
    [world, viewport]
  )

  useEffect(
    () => {
      if (world && scan && scan.workspace) {
        world.setWorkSpace(scan.workspace)
      }
    },
    [world, scan]
  )

  useEffect(
    () => {
      if (world && scan && scan.camera) {
        world.setCamera(scan.camera)
      }
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
      if (world) {
        world.setSelectedCamera(selectedCamera, lastSelectedCamera.camera)
        if (lastSelectedCamera.camera !== selectedCamera) resetViewport2d({ zoom: false, center: false })
        lastSelectedCamera.camera = selectedCamera
        if (!selectedCamera) {
          resetViewport2d()
          world.setLayers(layers)
        }
      }
    }, [world, selectedCamera])

  useEffect(
    () => {
      if (world) {
        world.setLayers(layers)
        world.setHighlightedAngle(
          [
            (selectedAngle !== undefined && selectedAngle !== null) && {
              index: selectedAngle,
              type: 'selected'
            },
            (hoveredAngle !== undefined && hoveredAngle !== null) && {
              index: hoveredAngle,
              type: 'hovered'
            }
          ]
            .filter((d) => d)
        )
      }
    },
    [world, hoveredAngle, selectedAngle, layers, viewport]
  )

  useEffect(
    () => {
      if (world) {
        world.setOrganColors(colors.organs)
      }
    },
    [colors.organs]
  )

  useEffect(
    () => {
      if (world) {
        if (viewport3d.clicked) {
          const organInfo = world.selectOrgan()
          if (organInfo) setOrganInfo(organInfo + 1)
        }
        if (viewport3d.rightClicked) {
          const selectedPoint = world.selectSegPoint()
          if (selectedPoint) {
            setClickedPoint(selectedPoint)
          }
        }
      }
    },
    [world, viewport3d]
  )

  useEffect(
    () => {
      if (world && (ruler.scaling || ruler.measuring)) {
        if (viewport3d.clicked) {
          if (measureClick) {
            console.log(world.endMeasure(ruler.scaling))
            setMeasureClick(false)
            setRuler({ ...ruler, scaling: false, measuring: false })
          } else {
            world.startMeasure()
            setMeasureClick(true)
          }
        }
      }
    },
    [viewport3d, world]
  )

  useEffect(
    () => {
      if (measureClick && world) {
        world.updateLine()
      }
    },
    [mouse, world, measureClick]
  )

  useEffect(
    () => {
      if (world) {
        if (!selectedPoints) {
          world.clearSelection()
        }
        if (selectedPoints) {
          world.colorSelectedPoints(selectedPoints)
        }
      }
    },
    [world, selectedPoints]
  )

  useEffect(
    () => {
      if (selectedLabel && selectedPoints && world) {
        world.setSegmentedPointCloudLabels(selectedLabel, selectedPoints)
        setSelectedPoints(null)
        setSelectedLabel(null)
      }
    },
    [selectedLabel, selectedPoints]
  )

  useEffect(
    () => {
      if (selectionMethod === 'sphere' && world && clickedPoint) {
        if (viewport3d.clicked) {
          setSelectionMethod('sphere end')
        } else {
          world.updateSphere(clickedPoint)
        }
      }
    },
    [selectionMethod, world, clickedPoint, mouse, viewport3d]
  )

  useEffect(
    () => {
      if (selectionMethod && world && clickedPoint) {
        switch (selectionMethod) {
          case 'proximity':
            setSelectedPoints(world.selectSegByProximity(clickedPoint))
            break
          case 'same label':
            setSelectedPoints(world.selectSegBySameLabel(clickedPoint))
            break
          case 'sphere end':
            setSelectedPoints(world.selectSegBySphere(clickedPoint))
            break
          default:
            return
        }
        setSelectionMethod(null)
        setClickedPoint(null)
      }
    },
    [selectionMethod, clickedPoint, world]
  )

  useEffect(
    () => {
      if (world) {
        world.setGlobalOrganColors(colors.globalOrganColors)
      }
    },
    [colors.globalOrganColors]
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
      if (world) {
        world.setMeshColor(colors.mesh)
      }
    },
    [colors.mesh]
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
      if (world && segmentedPointCloud && segmentation) {
        const uniqueLabels = segmentation.labels.filter(
          (value, index, self) => self.indexOf(value) === index
        )
        world.setSegmentedPointCloudGeometry(segmentedPointCloud,
          segmentation, uniqueLabels)
        world.setLayers(layers)
        setColors({
          ...colors,
          segmentedPointCloud: world.getSegementedPointCloudColors()
        })
        setLabels(uniqueLabels)
      }
    },
    [world, segmentedPointCloud, segmentation]
  )

  useEffect(
    () => {
      if (world && segmentedPointCloud && segmentation) {
        world.setSegmentedPointCloudColor(colors.segmentedPointCloud)
      }
    },
    [colors.segmentedPointCloud]
  )

  useEffect(
    () => {
      if (world && pointCloudGeometry) {
        world.setPointCloudColor(colors.pointCloud)
      }
    },
    [colors.pointCloud]
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
      if (world && scan && scan.data.skeleton) {
        world.setSkeletonColor(colors.skeleton)
      }
    },
    [colors.skeleton]
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
      if (world) {
        world.setBackgroundColor(colors.background)
      }
    }, [colors.background]
  )

  useEffect(
    () => {
      if (world) world.setMouse(mouse)
    },
    [world, mouse]
  )

  return <Container ref={containerRef}>
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
