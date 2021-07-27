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
import React, { useState, useRef, useEffect, memo } from 'react'
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'

import { scaleCanvas } from 'rd/tools/canvas'

import { useScan, useImageSet } from 'flow/scans/accessors'

import { green } from 'common/styles/colors'
import closeIco from 'common/assets/ico.deselect-white.20x20.svg'

import { useHoveredCamera, useSelectedcamera } from 'flow/interactions/accessors'
import { useCarousel } from 'flow/settings/accessors'
import { useFormatMessage } from 'rd/tools/intl'

import useImgLoader from './loader'
import openIco from './assets/ico.open_photo.16x16.svg'
import dragNdropIco from './assets/ico.drag_photos.40x16.svg'

export const moduleHeight = 70

const Container = styled.div({
  width: '100%',
  height: moduleHeight,
  background: '#1f2426',
  position: 'relative',
  zIndex: 1000 // This is to prevent the close and open buttons to conflict
  // with the graph on the right
})

const Svg = styled.svg({
  width: '100%',
  height: 'calc(100% + 30px)',
  marginTop: -30,
  left: 0,

  '& g': {
    cursor: 'pointer'
  }
})

const Canvas = styled.canvas({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none'
})

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

const CTAWording = styled.text({
  fontSize: 11,
  fill: 'white',
  textTransform: 'uppercase',
  fontWeight: 600
})

const getSize = (elem) => elem.getBoundingClientRect()

export default function Carousel () {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const windowSider = useWindowSize()
  const [scan] = useScan()
  const [urlList, setUrlList] = useState([])
  const [context, setContext] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [picturesLayout, setPicturesLayout] = useState([])
  const cameraPoses = ((scan && scan.camera.poses) || [])
  const [imgs] = useImgLoader(urlList)
  const [hovered, setHovered] = useHoveredCamera()
  const [selected, setSelected] = useSelectedcamera()
  const large = moduleHeight * (6000 / 4000)
  let sizes
  const [carousel] = useCarousel()

  const hoveredLayout = useRef(null)
  const selectedLayout = useRef(null)

  const imageSet = useImageSet(carousel.photoSet)
  useEffect(
    () => {
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
        setUrlList(imageSet.map((d) => d.path))
      }
    },
    [imageSet]
  )

  useEffect(
    () => {
      const { width, height } = getSize(containerRef.current)
      const context = canvasRef.current.getContext('2d')
      scaleCanvas(canvasRef.current, context, width, height)
      context.width = width
      context.height = height
      setContext(context)
    },
    [windowSider, containerRef.current, canvasRef.current]
  )

  useEffect(
    () => {
      if (context) {
        const { width, height } = getSize(containerRef.current)
        sizes = {
          width,
          large,
          normal: (width / urlList.length),
          block: (
            (
              width - (
                (hovered || selected)
                  ? large
                  : 0
              )
            ) /
            (
              (hovered || selected)
                ? urlList.length - 1
                : urlList.length
            )
          )
        }

        let last = { x: 0, width: 0, normalX: 0, normalWidth: 0 }

        hoveredLayout.current = null
        selectedLayout.current = null
        setPicturesLayout(
          cameraPoses.map((d, i) => {
            const isSelected = selected && d.id === selected.id
            const isHovered = hovered && d.id === hovered.id
            const x = last.x + last.width
            const width = selected
              ? isSelected
                ? sizes.large
                : sizes.block
              : isHovered
                ? sizes.large
                : sizes.block
            const normalX = last.normalX + last.normalWidth

            const obj = {
              item: {
                ...d,
                photoUri: imageSet ? imageSet[i].path : null,
                texture: imageSet ? imageSet[i].texture : null
              },
              x,
              normalX,
              width,
              normalWidth: sizes.normal,
              height,
              hovered: isHovered,
              selected: isSelected
            }

            last = obj

            if (isHovered) hoveredLayout.current = obj
            if (isSelected) selectedLayout.current = obj

            return obj
          })
        )
      }
    },
    [windowSider, context, hovered, selected, urlList, cameraPoses]
  )

  if (context) {
    const { width, height } = getSize(containerRef.current)
    context.clearRect(0, 0, width, height)
    picturesLayout.forEach((d, i) => {
      if (imgs[d.item.photoUri]) {
        const imgWidth = imgs[d.item.photoUri].width
        const imgHeight = imgs[d.item.photoUri].height
        const ratio = imgWidth / large
        const sx = (imgWidth / 2) - (d.width * ratio * 0.5)
        const sy = 0

        context.globalAlpha = (d.hovered || d.selected) ? 1 : 0.5
        context.drawImage(
          imgs[d.item.photoUri],
          sx,
          sy,
          d.width * ratio,
          imgHeight,

          d.x,
          0,
          d.width,
          height
        )
      } else {
        context.fillStyle = d.hovered ? 'white' : 'grey'
        context.fillRect(
          d.x,
          0,
          d.width,
          height
        )
        context.fillStyle = 'black'
      }
    })
  }

  useEffect(
    () => {
      const handler = (e) => {
        setDragging(false)
        document.body.style.cursor = null
      }
      const moveHander = (e) => {
        if (dragging && e.movementX !== 0) {
          const dX = e.movementX < 0
            ? e.clientX - (dragging.from - dragging.triggerLeft)
            : e.clientX - (dragging.from - (dragging.triggerLeft + dragging.triggerWidth))
          const pictureDragged = picturesLayout
            .find((d) => d.x <= dX && (d.x + d.width) >= dX)

          if (pictureDragged) {
            setSelected(pictureDragged.item)
          }
        }
      }
      if (dragging) {
        window.addEventListener('mouseup', handler)
        window.addEventListener('mousemove', moveHander)
      } else {
        window.removeEventListener('mouseup', handler)
        window.removeEventListener('mousemove', moveHander)
      }

      return () => {
        window.removeEventListener('mouseup', handler)
        window.removeEventListener('mousemove', moveHander)
      }
    },
    [dragging, picturesLayout, selectedLayout]
  )

  const eventsFn = {
    onMouseMove: (e) => {
      const dX = !selectedLayout.current && hoveredLayout.current
        ? e.movementX < 0
          ? e.clientX - (hoveredLayout.current.width * 0.5) + hoveredLayout.current.normalWidth
          : e.clientX + (hoveredLayout.current.width * 0.5)
        : e.clientX
      const pictureHovered = picturesLayout
        .find((d) => d.x <= dX && (d.x + d.width) >= dX)

      if (pictureHovered && hovered !== pictureHovered.item) {
        setHovered(pictureHovered ? pictureHovered.item : null)
      }
    },
    onMouseOut: (e) => {
      setHovered(null)
    },
    onClick: () => {
      if (hovered) {
        setSelected(
          (selected && selected.id === hovered.id)
            ? null
            : hovered
        )
      }
    }
  }

  return <Container ref={containerRef}>

    <SVGCartridge
      large={large}
      hoveredLayout={hoveredLayout.current}
      selectedLayout={selectedLayout.current}
      eventsFn={eventsFn}
    />

    <Canvas ref={canvasRef} />

    {
      selectedLayout.current && <SvgDnG>
        <g transform={`translate(0, ${moduleHeight * 0.5})`}>
          <line
            x1={0}
            x2={'100%'}
            y1={0}
            y2={0}
            strokeWidth={1}
            stroke={green}
          />
          <g
            transform={`translate(${selectedLayout.current.x}, 0)`}
          >
            <rect
              style={{
                cursor: !dragging && 'grab'
              }}
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
            <image
              xlinkHref={dragNdropIco}
              x={(large * 0.5) - 20}
              y={-8}
            />
          </g>
        </g>
      </SvgDnG>
    }
  </Container>
}

const SVGCartridge = memo(({ hoveredLayout, selectedLayout, large, eventsFn }) => {
  const intl = useFormatMessage()

  return <Svg>
    <g
      onMouseMove={eventsFn.onMouseMove}
      onMouseLeave={eventsFn.onMouseOut}
      onClick={eventsFn.onClick}
    >
      {
        (!selectedLayout && hoveredLayout) && <g
          transform={`translate(${hoveredLayout.x}, 0)`}
        >
          <rect
            width={large}
            height={moduleHeight + 30}
            y={0}
            fill={green}
            rx={2}
            ry={2}
          />
          <CTAWording
            x={10}
            y={20}
          >
            {intl('carrousel-open')}
          </CTAWording>
          <image
            x={large - (10 + 16)}
            y={7}
            xlinkHref={openIco}
          />
        </g>
      }
      {
        selectedLayout && <g
          transform={`translate(${selectedLayout.x}, 0)`}
        >
          <rect
            width={large}
            height={moduleHeight + 30}
            y={0}
            fill={green}
            rx={2}
            ry={2}
          />
          <CTAWording
            x={10}
            y={20}
          >
            {intl('carrousel-close')}
          </CTAWording>
          <image
            x={large - (10 + 16)}
            y={5}
            xlinkHref={closeIco}
          />
        </g>
      }
      <rect
        width='100%'
        height='100%'
        x={0}
        y={30}
        fill={'black'}
      />
    </g>
  </Svg>
})

/**
|--------------------------------------------------
| ANIMATION SAMPLE
| @TODO TO REMOVE
|--------------------------------------------------
*/

// {/* <RenderSpring key='render' update={update} /> */}
// const RenderSpring = ({ update, imgs, large, height, d, context, debug }) => {
//   const [activated, setActivated] = useState(false)
//   return <Spring
//     from={{ t: 0 }}
//     to={{ t: activated ? update.countObj.value : 1 }}
//   >
//     {
//       ({ t }) => {
//         if (t === 1) setActivated(true)
//         console.log(
//           t / (update.countObj.value - 1)
//         )
//         // console.log(
//         //   ((update.countObj.value - t) - 2) > 0
//         //     ? 0
//         //     : ((update.countObj.value - t) - 2)
//         // )

//         return null
//       }
//     }
//   </Spring>
// }

/* <Svg style={{
    pointerEvents: 'none',
    marginTop: -70
  }}>
    {
      picturesLayout
        .map((d) => {
          return <Image key={d.item.id} height={moduleHeight} large={large} imgs={imgs} context={context} d={d} />
        })
    }
  </Svg>
*/

// const Image = memo(({ imgs, large, height, d, context, debug }) => {
//   return <Spring
//     from={{ x: d.x, width: d.width }}
//     to={{ x: d.x, width: d.width }}>
//     {({ x, width }) => {
//       // if (imgs[d.item.photoUri]) {
//       //   const imgWidth = imgs[d.item.photoUri].width
//       //   const imgHeight = imgs[d.item.photoUri].height
//       //   const ratio = imgWidth / large
//       //   const sx = (imgWidth / 2) - (width * ratio * 0.5)
//       //   const sy = 0

//       //   // context.globalAlpha = (d.hovered || d.selected) ? 1 : 0.5
//       //   context.drawImage(
//       //     imgs[d.item.photoUri],
//       //     sx,
//       //     sy,
//       //     width * ratio,
//       //     imgHeight,

//       //     x,
//       //     0,
//       //     width,
//       //     height
//       //   )
//       // } else {
//       //   context.fillStyle = d.hovered ? 'white' : 'grey'
//       //   context.fillRect(
//       //     x,
//       //     0,
//       //     width,
//       //     height
//       //   )
//       //   context.fillStyle = 'black'
//       // }

//       if (debug) console.log(x, width)

//       return <image
//         xlinkHref={d.item.photoUri}
//         x={x}
//         y={0}
//         width={width}
//         height={height}
//       />
//     }}
//   </Spring>
// })

// const Image = memo(({ imgs, large, height, d, context }) => {
//   return <Spring
//     from={{ x: d.x, width: d.width }}
//     to={{ x: d.x, width: 10 }}>
//     {({ x, width }) => {
//       if (imgs[d.item.photoUri]) {
//         const imgWidth = imgs[d.item.photoUri].width
//         const imgHeight = imgs[d.item.photoUri].height
//         const ratio = imgWidth / large
//         const sx = (imgWidth / 2) - (width * ratio * 0.5)
//         const sy = 0

//         // context.globalAlpha = (d.hovered || d.selected) ? 1 : 0.5
//         context.drawImage(
//           imgs[d.item.photoUri],
//           sx,
//           sy,
//           width * ratio,
//           imgHeight,

//           x,
//           0,
//           width,
//           height
//         )
//       } else {
//         context.fillStyle = d.hovered ? 'white' : 'grey'
//         context.fillRect(
//           x,
//           0,
//           width,
//           height
//         )
//         context.fillStyle = 'black'
//       }
//       return null
//     }}
//   </Spring>
// })
