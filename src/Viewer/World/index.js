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
import React, { useEffect, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import styled from '@emotion/styled'

import { useElementMouse } from 'rd/tools/hooks/mouse'

import { useLayers } from 'flow/settings/accessors'
import {
  useAxisAlignedBoundingBox,
  useClickedPoint,
  useColor,
  useHoveredAngle,
  useHoveredCamera,
  useLabels,
  useOrganInfo,
  usePointCloudSize,
  usePointCloudZoom,
  useReset2dView,
  useReset3dView,
  useRuler,
  useSelectedAngle,
  useSelectedcamera,
  useSelectedLabel,
  useSelectedPoints,
  useSelectionMethod,
  useSnapshot
} from 'flow/interactions/accessors'
import { useScan, useScanFiles, useSegmentedPointCloud } from 'flow/scans/accessors'

import WorldObject from './object'
import useViewport2d from './behaviors/viewport2d'

import { headerHeight } from 'Viewer/Header'
import { moduleHeight as carouselHeight } from 'Viewer/Carousel'
import useViewport3d from './behaviors/viewport3d'

const Container = styled.div({
  position: 'relative', width: '100%', height: '100%'
})

const CanvasContainer = styled.div({
  position: 'absolute', width: '100%', height: '100%'
})

/**
 * Get the size of the viewport excluding certain elements.
 *
 * @returns {{width: number, height: number}} An object containing the width and height of the viewport.
 */
const getSize = () => ({
  width: window.innerWidth, height: window.innerHeight - headerHeight - carouselHeight
})

/**
 * Component representing the World in a 3D/2D visualization environment.
 *
 * @param {Object} props - The properties passed to the component.
 * @return {JSX.Element} - The rendered WorldComponent.
 */
export default function WorldComponent (props) {
  const canvasRef = useRef()
  // Hook to measure container size and bounds
  const [containerRef, bounds] = useMeasure()

  // State variables for various components of the world
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

  // State to track measurement click
  const [measureClick, setMeasureClick] = useState(false)
  // Mouse position in the canvas element
  const mouse = useElementMouse(canvasRef)

  // States for organizing information and clicked points
  const [, setOrganInfo] = useOrganInfo()
  const [clickedPoint, setClickedPoint] = useClickedPoint()

  // Last selected camera state
  const [lastSelectedCamera] = useState({ camera: null })

  // Scan data from the hook
  const [scan] = useScan()

  // Extract all geometries
  const [[meshGeometry], [pointCloudGeometry], [skeletonGeometry], [anglesData], [pointCloudGroundTruthGeometry]] = useScanFiles(scan)

  // Simple helper function to safely get the first item of an array or null
  // const getFirstItem = arr => Array.isArray(arr) && arr.length > 0 && arr[0] !== undefined ? arr[0] : null

  // Extract all geometries with safe access
  // const scanFiles = useScanFiles(scan)
  // const meshGeometry = scanFiles && scanFiles[0] ? getFirstItem(scanFiles[0]) : null
  // const pointCloudGeometry = scanFiles && scanFiles[1] ? getFirstItem(scanFiles[1]) : null
  // const skeletonGeometry = scanFiles && scanFiles[2] ? getFirstItem(scanFiles[2]) : null
  // const anglesData = scanFiles && scanFiles[3] ? getFirstItem(scanFiles[3]) : null
  // const pointCloudGroundTruthGeometry = scanFiles && scanFiles[4] ? getFirstItem(scanFiles[4]) : null

  // Get segmented point cloud data
  const [segmentedPointCloud, segmentation] = useSegmentedPointCloud()

  // States for 2D viewport, events, and clicks
  const [viewport, event2dFns, resetViewport2d, clicked2d] = useViewport2d(bounds.width || getSize().width, bounds.height || getSize().height)

  // States for 3D viewport and events
  const [viewport3d, event3dFns] = useViewport3d(bounds.width || getSize().width, bounds.height || getSize().height)

  // Functions to reset views
  const [, setReset3dView] = useReset3dView()
  const [, setReset2dView] = useReset2dView()

  // Determine which event functions to use based on selected camera
  const eventFns = selectedCamera ? event2dFns : event3dFns

  // States for point cloud zoom and size
  const [pointCloudZoom] = usePointCloudZoom()
  const [pointCloudSize] = usePointCloudSize()

  // Axis-aligned bounding box state
  const [aabb, setAABB] = useAxisAlignedBoundingBox()

  // Initialize world object when canvas ref is created and not already initialized
  useEffect(() => {
    if (canvasRef.current && !world) {
      const world = new WorldObject(bounds.width, bounds.height, canvasRef.current)
      // Set hover callback to update hovered camera state
      world.onHover((data) => setHoveredCamera(data))
      setWorld(world)
    }
    return () => {
      if (world) world.unmount()
    }
  }, [canvasRef.current])

  // Setup reset view functions when world is created
  useEffect(() => {
    if (world) {
      setReset3dView({
        fn: world.resetControls
      })
      setReset2dView({
        fn: resetViewport2d
      })
    }
  }, [world])

  // Update world size and snapshot resolution when bounds or scan changes
  useEffect(() => {
    if (world) { // Check if the world object exists
      world.setSize( // Set the new size for the world
        bounds.width, bounds.height)
      setSnapshot({
        ...snapshot, // Preserve existing snapshot properties
        trueResolution: { // Update resolution with current bounds dimensions
          width: Math.round(bounds.width), height: Math.round(bounds.height)
        }
      })
    }
  }, [world, scan, bounds])

  // Update snapshot image when resolution changes
  useEffect(() => {
    if (world && snapshot.trueResolution && snapshot.snapResolution) {
      setSnapshot({
        ...snapshot,
        image: world.takeSnapshot({
          width: snapshot.snapResolution.width || snapshot.trueResolution.width,
          height: snapshot.snapResolution.height || snapshot.trueResolution.height
        })
      })
    }
  }, [snapshot.snapResolution])

  // Set viewport for the world when it changes
  useEffect(() => {
    if (world) {
      world.setViewport(...viewport)
    }
  }, [world, viewport])

  // Set workspace in the world when scan changes
  useEffect(() => {
    if (world && scan && scan.workspace) {
      world.setWorkSpace(scan.workspace)
    }
  }, [world, scan])

  // Update camera and related data in the world when scan or geometries change
  useEffect(() => {
    if (world && scan && scan.camera) {
      world.setCamera(scan.camera)
    }
  }, [world, scan, meshGeometry, pointCloudGeometry, skeletonGeometry, anglesData, pointCloudGroundTruthGeometry])

  // Set camera points and layers in the world when scan changes
  useEffect(() => {
    if (world && scan && scan.camera) {
      world.setCameraPoints(scan.camera.poses)
      world.setLayers(layers)
    }
  }, [world, scan])

  // Update hovered camera state in the world
  useEffect(() => {
    if (world) {
      world.setHoveredCamera(hoveredCamera)
    }
  }, [world, hoveredCamera])

  // Handle selected camera changes and viewport reset
  useEffect(() => {
    if (world) {
      world.setSelectedCamera(selectedCamera, lastSelectedCamera.camera)
      if (lastSelectedCamera.camera !== selectedCamera) resetViewport2d({ zoom: false, center: false })
      lastSelectedCamera.camera = selectedCamera

      // Reset layers and viewport when no camera is selected
      if (!selectedCamera) {
        resetViewport2d()
        world.setLayers(layers)
      }
    }
  }, [world, selectedCamera])

  // Update highlighted angles in the world
  useEffect(() => {
    if (world) {
      world.setLayers(layers) // Update the layers of the world with the current layers state

      // Set highlighted angles based on selectedAngle and hoveredAngle
      // Filter out any undefined values from the array
      world.setHighlightedAngle([// Conditionally include an object if selectedAngle is defined and not null
        (selectedAngle !== undefined && selectedAngle !== null) && {
          index: selectedAngle, type: 'selected'
        }, // Conditionally include an object if hoveredAngle is defined and not null
        (hoveredAngle !== undefined && hoveredAngle !== null) && {
          index: hoveredAngle, type: 'hovered'
        }]
        .filter((d) => d) // Filter out any falsy values from the array
      )
    }
  }, [world, hoveredAngle, selectedAngle, layers, viewport])

  // Update the organ colors whenever 'colors.organs' changes.
  useEffect(() => {
    if (world) {
      world.setOrganColors(colors.organs)
    }
  }, [colors.organs])

  // This effect runs when 'world' or 'viewport3d' change.
  // When the viewport is clicked, it selects an organ or a segment point based on right-click.
  useEffect(() => {
    if (world) {
      if (viewport3d.clicked) {
        const organInfo = world.selectOrgan()
        // If an organ is selected, update the organ info state
        if (organInfo) setOrganInfo(organInfo + 1)
      }
      if (viewport3d.rightClicked) {
        const selectedPoint = world.selectSegPoint()
        // If a segment point is selected on right-click, update the clicked point state
        if (selectedPoint) {
          setClickedPoint(selectedPoint)
        }
      }
    }
  }, [world, viewport3d])

  // Effect hook to handle measurement and scaling logic
  useEffect(() => {
    if (world && (ruler.scaling || ruler.measuring)) {
      // Check if the user has clicked in either 3D viewport or 2D interface
      if (viewport3d.clicked || clicked2d) {
        // If measureClick is true, end the measurement process
        if (measureClick) {
          const measure = world.endMeasure(ruler.scaling) // End measuring and get result
          setMeasureClick(false) // Reset measure click state
          setRuler({
            ...ruler,
            scaling: false, // Disable scaling mode
            measuring: false, // Disable measuring mode
            measure: measure, // Store measurement result
            scaleSet: ruler.scaling || ruler.scaleSet // Update scale set status
          })
        } else {
          // If not in measureClick state, start a new measurement process
          world.startMeasure() // Start the measurement
          setMeasureClick(true) // Set measure click state to true
        }
      }
    }
  }, [viewport3d, world, clicked2d])

  // Handle measurement functionality with ruler
  useEffect(() => {
    if (measureClick && world) {
      world.updateLine() // Update line visualization during measurement
    }
  }, [mouse, world, measureClick])

  // Clear or color selected points in the world
  useEffect(() => {
    if (world) {
      // If no points are selected, clear selection
      if (!selectedPoints) {
        world.clearSelection()
      }
      // Otherwise, color the selected points
      if (selectedPoints) {
        world.colorSelectedPoints(selectedPoints)
      }
    }
  }, [world, selectedPoints])

  // Set segmented point cloud labels when a label is selected
  useEffect(() => {
    if (selectedLabel && selectedPoints && world) {
      world.setSegmentedPointCloudLabels(selectedLabel, selectedPoints)
      setSelectedPoints(null)
      setSelectedLabel(null)
    }
  }, [selectedLabel, selectedPoints])

  // Handle sphere selection method and update the world with clicked point or end selection
  useEffect(() => {
    if (selectionMethod === 'sphere' && world && clickedPoint) {
      // If sphere selection is active, handle clicks to either update or finalize selection
      if (viewport3d.clicked) {
        setSelectionMethod('sphere end')
      } else {
        world.updateSphere(clickedPoint)
      }
    }
  }, [selectionMethod, world, clickedPoint, mouse, viewport3d])

  // Handle selection methods based on the clicked point
  useEffect(() => {
    if (selectionMethod && world && clickedPoint) {
      switch (selectionMethod) {
        case 'proximity':
          // Select points by proximity to the clicked point
          setSelectedPoints(world.selectSegByProximity(clickedPoint))
          break
        case 'same label':
          // Select points with the same label as the clicked point
          setSelectedPoints(world.selectSegBySameLabel(clickedPoint))
          break
        case 'sphere end':
          // Finalize sphere selection and get selected points
          setSelectedPoints(world.selectSegBySphere(clickedPoint))
          break
        default:
          return
      }
      // Reset selection method and clicked point after handling the selection
      setSelectionMethod(null)
      setClickedPoint(null)
    }
  }, [selectionMethod, clickedPoint, world])

  // Set global organ colors in the world whenever 'colors.globalOrganColors' changes.
  useEffect(() => {
    if (world) {
      world.setGlobalOrganColors(colors.globalOrganColors)
    }
  }, [colors.globalOrganColors])

  // Update mesh color in the world when colors.mesh changes
  useEffect(() => {
    if (world) {
      world.setMeshColor(colors.mesh) // Set the mesh color based on current state
    }
  }, [colors.mesh])

  // Update mesh color in the world when colors.mesh changes
  useEffect(() => {
    if (world) {
      world.setMeshColor(colors.mesh)
    }
  }, [colors.mesh])

  // Update point cloud geometry and related properties in the world
  // It sets point cloud geometry, axis-aligned bounding box, and layers when 'pointCloudGeometry' changes.
  useEffect(() => {
    if (world && pointCloudGeometry) {
      world.setPointcloudGeometry(pointCloudGeometry)
      world.setAxisAlignedBoundingBoxFromPointCloud() // Update the AABB based on new point cloud data
      setAABB(world.getAxisAlignedBoundingBox())
      world.setLayers(layers) // Ensure layers are updated with the new geometry
    }
  }, [world, pointCloudGeometry])

  // Resets or sets the Axis-Aligned Bounding Box (AABB) in the 3D world based on the current state.
  useEffect(() => {
    if (world && pointCloudGeometry) { // Ensure world and geometry exist
      if (aabb.enforceReset) { // If reset is enforced, reset AABB and merge with new bounding box
        world.resetAxisAlignedBoundingBox(aabb)
        const bb = world.getAxisAlignedBoundingBox()
        const merge = (...objects) => objects.reduce((acc, cur) => ({ ...acc, ...cur })) // Merge multiple objects into one
        setAABB(merge(aabb, bb, { enforceReset: false }))
      } else {
        world.setAxisAlignedBoundingBox(aabb) // Otherwise just set AABB without reset
      }
    }
  }, [aabb])

  // Update the point cloud ground truth geometry and layers in the 3D world.
  useEffect(() => {
    if (world && pointCloudGroundTruthGeometry) { // Ensure world and geometry exist
      world.setPointcloudGroundTruthGeometry(pointCloudGroundTruthGeometry)
      world.setLayers(layers) // Update visible layers based on current state
    }
  }, [world, pointCloudGroundTruthGeometry])

  // Update the segmented point cloud geometry and labels in the 3D world.
  useEffect(() => {
    if (world && segmentedPointCloud && segmentation) { // Ensure world, geometry, and segmentation exist
      const uniqueLabels = segmentation.labels.filter((value, index, self) => self.indexOf(value) === index // Filter out duplicate labels
      )
      world.setSegmentedPointCloudGeometry(segmentedPointCloud, segmentation, uniqueLabels)
      world.setLayers(layers)
      setColors({
        ...colors, segmentedPointCloud: world.getSegementedPointCloudColors() // Set colors for segmented point cloud
      })
      setLabels(uniqueLabels) // Update labels state with unique labels
    }
  }, [world, segmentedPointCloud, segmentation])

  // Update the color of the segmented point cloud.
  useEffect(() => {
    if (world && segmentedPointCloud && segmentation) { // Ensure world and geometry exist
      world.setSegmentedPointCloudColor(colors.segmentedPointCloud)
    }
  }, [colors.segmentedPointCloud])

  // Update the color of the point cloud.
  useEffect(() => {
    if (world && pointCloudGeometry) { // Ensure world and geometry exist
      world.setPointCloudColor(colors.pointCloud)
    }
  }, [colors.pointCloud])

  // Sets skeleton points in the 3D world.
  useEffect(() => {
    if (world && skeletonGeometry) { // Ensure world and geometry exist
      world.setSkeletonPoints(skeletonGeometry)
      world.setLayers(layers) // Update visible layers based on current state
    }
  }, [world, skeletonGeometry, scan])

  // Update the color of the skeleton.
  useEffect(() => {
    if (world && skeletonGeometry) { // Ensure world and geometry exist
      world.setSkeletonColor(colors.skeleton)
    }
  }, [colors.skeleton])

  // Sets angles points in the 3D world.
  useEffect(() => {
    if (world && anglesData) { // Ensure world and data exist
      world.setAnglesPoints(anglesData)
      world.setLayers(layers) // Update visible layers based on current state
    }
  }, [world, anglesData, scan])

  // Update the background color of the scene.
  useEffect(() => {
    if (world) { // Ensure world exists
      world.setBackgroundColor(colors.background)
    }
  }, [colors.background])

  // Sets mouse coordinates in the 3D world.
  useEffect(() => {
    if (world) world.setMouse(mouse)
  }, [world, mouse])

  // Update point cloud zoom level.
  useEffect(() => {
    if (world) { // Ensure world exists
      world.setPointCloudZoom(pointCloudZoom.level)
    }
  }, [pointCloudZoom.level])

  // Update the sample size of point clouds.
  useEffect(() => {
    if (world) { // Ensure world exists
      world.setPointCloudSize(pointCloudSize.sampleSize)
    }
  }, [pointCloudSize.sampleSize])

  useEffect(() => {
  }, [aabb])

  return <Container ref={containerRef}>
    <CanvasContainer
      ref={canvasRef}
      onMouseDown={eventFns.onMouseDown}
      onMouseUp={eventFns.onMouseUp}
      onMouseMove={eventFns.onMouseMove}
      onWheel={eventFns.onWheel}
      onClick={eventFns.onClick}
    />
  </Container>
}
