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
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'

import { scaleCanvas } from 'rd/tools/canvas' // Utility to scale the canvas
import { useImageSet, useScan } from 'flow/scans/accessors' // Hooks for accessing scan data
import { green, red } from 'common/styles/colors' // Color constants
import closeIco from 'common/assets/ico.deselect-white.20x20.svg'

import { useHoveredCamera, useSelectedcamera } from 'flow/interactions/accessors' // Hooks for tracking hovered and selected cameras
import { useCarousel } from 'flow/settings/accessors' // Hook for accessing carousel settings
import { useFormatMessage } from 'rd/tools/intl' // Hook for internationalization

import useImgLoader from './loader' // Custom hook for loading images
import openIco from './assets/ico.open_photo.16x16.svg'
import dragNdropIco from './assets/ico.drag_photos.40x16.svg'

export const moduleHeight = 70

/**
 * A styled div component used as a container.
 *
 * @type {React.ComponentType}
 */
const Container = styled.div({
  width: '100%',
  height: moduleHeight,
  background: '#1f2426',
  position: 'relative',
  zIndex: 1000 // This is to prevent the close and open buttons to conflict
  // with the graph on the right
})

/**
 * Svg component
 *
 * A styled SVG component with specific styles applied.
 *
 * @type {import('styled-components').StyledComponent<React.SVGProps<SVGElement>, {}, {}, never>}
 */
const Svg = styled.svg({
  width: '100%',
  height: 'calc(100% + 30px)',
  marginTop: -30,
  left: 0,

  '& g': {
    cursor: 'pointer'
  }
})

/**
 * A styled canvas element with specific CSS properties.
 *
 * @type {Object}
 * @property {string} width - The width of the canvas set to 100% of its container.
 * @property {string} height - The height of the canvas set to 100% of its container.
 * @property {string} position - The positioning of the canvas set to absolute.
 * @property {number} top - The top offset of the canvas set to 0.
 * @property {number} left - The left offset of the canvas set to 0.
 * @property {string} pointerEvents - Pointer events are disabled for this canvas element.
 */
const Canvas = styled.canvas({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none'
})

/**
 * A styled SVG component configured for use as a dynamic background.
 *
 * @typedef {Object} SvgDnG
 * @property {string} width - Sets the width of the SVG to fill its container.
 * @property {string} height - Sets the height of the SVG to fill its container.
 * @property {string} pointerEvents - Disables pointer events for the entire SVG, except for rectangles.
 * @property {string} position - Positions the SVG absolutely within its container.
 * @property {number} top - Aligns the SVG to the top of its container.
 * @property {number} left - Aligns the SVG to the left of its container.
 * @property {number} zIndex - Sets the z-index to ensure the SVG appears above other elements.
 */
const SvgDnG = styled.svg({
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,

  '& rect': {
    pointerEvents: 'all'
  }
})

/**
 * Styled component for CTA (Call-To-Action) wording.
 *
 * @type {import('styled-components').StyledComponent<'text', any, {}, never>}
 */
const CTAWording = styled.text({
  fontSize: 11,
  fill: 'white',
  textTransform: 'uppercase',
  fontWeight: 600
})

/**
 * Retrieves the size of an element in the viewport.
 *
 * @param {Element} elem - The DOM element to get the size from.
 * @return {{width: number, height: number}} An object containing the width and height of the element's bounding rectangle.
 */
const getSize = (elem) => elem.getBoundingClientRect()

/**
 * Initializes the Carousel component.
 *
 * This function sets up the carousel with image URLs, canvas context,
 * dragging state, pictures layout, and other necessary states for rendering
 * and interacting with a set of images in a carousel format. It uses various hooks
 * to manage side effects such as updating URL list when the image set changes,
 * initializing the canvas context, and handling drag events.
 *
 * @return {JSX.Element} The rendered Carousel component.
 */
export default function Carousel () {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const windowSider = useWindowSize()
  const [scan] = useScan()
  const [urlList, setUrlList] = useState([]) // List of image URLs
  const [context, setContext] = useState(null) // Canvas context
  const [dragging, setDragging] = useState(false) // Track dragging state
  const [picturesLayout, setPicturesLayout] = useState([]) // Layout information for pictures
  const cameraPoses = (scan && scan.camera.poses) || [] // Array of camera poses from scan data
  const [imgs] = useImgLoader(urlList) // Load images using custom hook
  const [hovered, setHovered] = useHoveredCamera() // Currently hovered camera
  const [selected, setSelected] = useSelectedcamera() // Currently selected camera
  const large = moduleHeight * (6000 / 4000) // Large size for thumbnails
  const [carousel] = useCarousel() // Carousel settings

  const hoveredLayout = useRef(null)
  const selectedLayout = useRef(null)

  const imageSet = useImageSet(carousel.photoSet) // Get the current image set from carousel settings

  // Load URLs when the image set changes
  useEffect(() => {
    if (imageSet) {
      // Portion of code to get only 'rgb' images in dataset (doesn't work)
      // if(carousel.photoSet == 'images'){
      //   let index = 0
      //   imageSet.forEach(function(image){
      //     if(image.path.includes('rgb')){
      //       //imageSet.splice(index, 1)
      //       index--
      //     }
      //     index++
      //   })
      // }
      setUrlList(imageSet.map((d) => d.path)) // Update URL list with paths from image set
    }
  }, [imageSet])

  // Initialize canvas context when component mounts or window size changes
  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const { width, height } = getSize(containerRef.current)
      const context = canvasRef.current.getContext('2d')
      scaleCanvas(canvasRef.current, context, width, height) // Scale the canvas to fit container
      setContext(context) // Store canvas context for later use
    }
  }, [windowSider])

  // Update pictures layout when relevant dependencies change
  useEffect(() => {
    if (context && containerRef.current) {
      const { width } = getSize(containerRef.current)
      const newSizes = {
        width,
        large,
        normal: width / urlList.length, // Normal size for thumbnails
        block:
          (width - (hovered || selected ? large : 0)) /
          (hovered || selected ? urlList.length - 1 : urlList.length) // Size for blocks when not hovered/selected
      }

      let last = { x: 0, width: 0, normalX: 0, normalWidth: 0 }
      hoveredLayout.current = null
      selectedLayout.current = null

      const newPicturesLayout = cameraPoses.map((d, i) => {
        const isSelected = selected && d.id === selected.id // Check if this camera is the selected one
        const isHovered = hovered && d.id === hovered.id // Check if this camera is currently hovered
        const x = last.x + last.width // Calculate position based on previous item's size
        const width = selected
          ? isSelected
            ? newSizes.large // Use large size for selected item
            : newSizes.block // Use block size for non-selected items when one is selected
          : isHovered
            ? newSizes.large // Use large size for hovered item
            : newSizes.block // Use block size for non-hovered/selected items
        const normalX = last.normalX + last.normalWidth

        const obj = {
          item: {
            ...d,
            photoUri: imageSet ? imageSet[i].path : null, // Path to the photo
            texture: imageSet ? imageSet[i].texture : null // Texture data for the photo
          },
          x,
          normalX,
          width,
          normalWidth: newSizes.normal,
          height: moduleHeight,
          hovered: isHovered,
          selected: isSelected
        }

        last = obj
        if (isHovered) hoveredLayout.current = obj // Store reference to currently hovered item
        if (isSelected) selectedLayout.current = obj // Store reference to currently selected item

        return obj
      })

      setPicturesLayout(newPicturesLayout) // Update layout with new sizes and positions
    }
  }, [context, hovered, selected, urlList, cameraPoses, imageSet, large])

  // Draw pictures on canvas when layout or images change
  useEffect(() => {
    if (context && containerRef.current && picturesLayout.length > 0) {
      const { width } = getSize(containerRef.current)
      context.clearRect(0, 0, width, moduleHeight) // Clear previous drawing

      picturesLayout.forEach((d, i) => {
        if (imgs[d.item.photoUri]) {
          const imgWidth = imgs[d.item.photoUri].width
          const imgHeight = imgs[d.item.photoUri].height
          const ratio = imgWidth / large
          const sx = imgWidth / 2 - d.width * ratio * 0.5

          context.globalAlpha = d.hovered || d.selected ? 1 : 0.5 // Full opacity for hovered/selected, half for others
          context.drawImage(
            imgs[d.item.photoUri],
            sx,
            0,
            d.width * ratio,
            imgHeight,
            d.x,
            0,
            d.width,
            moduleHeight
          )

          if (!d.item.isMatched) {
            context.fillStyle = 'rgba(255, 85, 95, 0.4)'
            context.fillRect(d.x, 0, d.width, imgHeight)
          }
        } else {
          context.fillStyle = d.hovered ? 'white' : 'grey'
          context.fillRect(d.x, 0, d.width, moduleHeight)
          context.fillStyle = 'black'
        }
      })
    }
  }, [context, picturesLayout, imgs, large])

  // Handle drag events
  useEffect(() => {
    /**
     * Handles the event to stop dragging and reset cursor style.
     *
     * @param {Event} e - The event object triggered by the action.
     */
    const handler = (e) => {
      setDragging(false) // Stop dragging when mouse is released
      document.body.style.cursor = null // Reset cursor style
    }

    /**
     * Handles mouse movement events during dragging to update the selected picture.
     *
     * @param {MouseEvent} e - The mouse event object containing movement details.
     */
    const moveHandler = (e) => {
      if (dragging && e.movementX !== 0) { // Only process if dragging and there's movement
        const dX =
          e.movementX < 0
            ? e.clientX - (dragging.from - dragging.triggerLeft)
            : e.clientX -
            (dragging.from - (dragging.triggerLeft + dragging.triggerWidth))

        const pictureDragged = picturesLayout.find(
          (d) => d.x <= dX && d.x + d.width >= dX
        )

        if (pictureDragged) {
          setSelected(pictureDragged.item) // Update selected item based on drag position
        }
      }
    }

    if (dragging) {
      window.addEventListener('mouseup', handler)
      window.addEventListener('mousemove', moveHandler)
    } else {
      window.removeEventListener('mouseup', handler)
      window.removeEventListener('mousemove', moveHandler)
    }

    return () => {
      window.removeEventListener('mouseup', handler)
      window.removeEventListener('mousemove', moveHandler)
    }
  }, [dragging, picturesLayout])

  /**
   * Handles various mouse events for the layout.
   *
   * @typedef {Object} EventsFn
   * @property {Function} onMouseMove - Event handler for mouse movement. It calculates the new position of the cursor relative to the hovered layout and updates the hover state accordingly.
   * @property {Function} onMouseOut - Event handler for mouse out events. Resets the hover state.
   * @property {Function} onClick - Event handler for click events. Toggles selection between null and the currently hovered item if it exists.
   */
  const eventsFn = {
    onMouseMove: (e) => {
      const dX =
        !selectedLayout.current && hoveredLayout.current
          ? e.movementX < 0
            ? e.clientX -
            hoveredLayout.current.width * 0.5 +
            hoveredLayout.current.normalWidth
            : e.clientX + hoveredLayout.current.width * 0.5
          : e.clientX

      const pictureHovered = picturesLayout.find(
        (d) => d.x <= dX && d.x + d.width >= dX
      )

      if (pictureHovered && hovered !== pictureHovered.item) {
        setHovered(pictureHovered ? pictureHovered.item : null)
      }
    },
    onMouseOut: () => setHovered(null),
    onClick: () => {
      if (hovered) {
        setSelected(selected && selected.id === hovered.id ? null : hovered)
      }
    }
  }

  return (
    <Container ref={containerRef}>
      <SVGCartridge
        large={large}
        hoveredLayout={hoveredLayout.current}
        selectedLayout={selectedLayout.current}
        eventsFn={eventsFn}
      />

      <Canvas ref={canvasRef} />
      {selectedLayout.current && (
        <SvgDnG>
          <g transform={`translate(0, ${moduleHeight * 0.5})`}>
            <line
              x1={0}
              x2={'100%'}
              y1={0}
              y2={0}
              strokeWidth={1}
              stroke={green}
            />
            <g transform={`translate(${selectedLayout.current.x}, 0)`}>
              <rect
                style={{ cursor: !dragging && 'grab' }}
                y={-15}
                width={selectedLayout.current.width}
                height={30}
                rx={15}
                ry={15}
                fill={green}
                onMouseDown={(e) => {
                  const bb = e.target.getBoundingClientRect()
                  document.body.style.cursor = 'grabbing'
                  setDragging({
                    from: e.clientX,
                    triggerLeft: bb.left,
                    triggerWidth: bb.width
                  })
                }}
              />
              <image xlinkHref={dragNdropIco} x={large * 0.5 - 20} y={-8} />
            </g>
          </g>
        </SvgDnG>
      )}
    </Container>
  )
}

/**
 * A React component that renders an SVG cartridge with hover and selected states.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.hoveredLayout - Layout information when the item is hovered.
 * @param {number} props.selectedLayout - Layout information when the item is selected.
 * @param {boolean} props.large - A boolean to determine if the cartridge should be large.
 * @param {Object} props.eventsFn - Event handlers for mouse interactions.
 */
const SVGCartridge = React.memo(
  ({ hoveredLayout, selectedLayout, large, eventsFn }) => {
    const intl = useFormatMessage() // Hook to get formatted messages

    return (
      <Svg>
        <g
          onMouseMove={eventsFn.onMouseMove} // Event handler for mouse move
          onMouseLeave={eventsFn.onMouseOut} // Event handler for mouse leave
          onClick={eventsFn.onClick} // Event handler for click
        >
          {/* Render when hovered but not selected */}
          {!selectedLayout && hoveredLayout && (
            <g transform={`translate(${hoveredLayout.x}, 0)`}>
              <rect
                width={large}
                height={moduleHeight + 30}
                y={0}
                fill={green} // Green background for hover state
                rx={2}
                ry={2}
              />
              <CTAWording x={10} y={20}> {/* CTA text */}
                {intl('carrousel-open')}
              </CTAWording>
              <image x={large - (10 + 16)} y={7} xlinkHref={openIco} />
              {/* Open icon */}
            </g>
          )}
          {/* Render when selected */}
          {selectedLayout && (
            <g transform={`translate(${selectedLayout.x}, 0)`}>
              <rect
                width={large}
                height={moduleHeight + 30}
                y={0}
                fill={red} // Red background for selected state
                rx={2}
                ry={2}
              />
              <CTAWording x={10} y={20}> {/* CTA text */}
                {intl('carrousel-close')}
              </CTAWording>
              <image x={large - (10 + 16)} y={5} xlinkHref={closeIco} />
              {/* Close icon */}
            </g>
          )}
          {/* Background rectangle */}
          <rect width='100%' height='100%' x={0} y={30} fill={'black'} />
        </g>
      </Svg>
    )
  }
)
