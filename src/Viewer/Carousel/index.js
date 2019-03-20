import React, { useState, useRef, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import styled from '@emotion/styled'

import { scaleCanvas } from 'rd/tools/canvas'

import { useScan } from 'flow/scans/accessors'

import { green } from 'common/styles/colors'

import useImgLoader from './loader'
import { useHoveredCamera, useSelectedcamera } from 'flow/interactions/accessors'

const moduleHeight = 70

const Container = styled.div({
  width: '100%',
  height: moduleHeight,
  background: '#1f2426',
  position: 'relative'
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
  const [hoveredLayout, setHoveredLayout] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const cameraPoses = ((scan && scan.camera.poses) || [])
  const [imgs] = useImgLoader(urlList)
  const [hovered, setHovered] = useHoveredCamera()
  const [selected, setSelected] = useSelectedcamera()
  const large = moduleHeight * (6000 / 4000)
  const [update, setUpdate] = useState({ countObj: { value: 1 } })
  let sizes

  useEffect(
    () => {
      setUrlList(
        cameraPoses.map((d) => d.photoUri)
      )
    },
    [cameraPoses]
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
          normal: (width / cameraPoses.length),
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
                ? cameraPoses.length - 1
                : cameraPoses.length
            )
          )
        }

        let last = { x: 0, width: 0, normalX: 0, normalWidth: 0 }

        setHoveredLayout(null)
        setSelectedLayout(null)

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
              item: d,
              x,
              normalX,
              width,
              normalWidth: sizes.normal,
              height,
              hovered: isHovered,
              selected: isSelected
            }

            last = obj

            if (isHovered) setHoveredLayout(obj)
            if (isSelected) setSelectedLayout(obj)

            return obj
          })
        )
      }
    },
    [windowSider, context, cameraPoses, hovered, selected]
  )

  useEffect(
    () => {
      if (context) {
        const { width, height } = getSize(containerRef.current)

        update.countObj.value += 1
        setUpdate(update)

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
    },
    [context, picturesLayout, imgs]
  )

  const eventsFn = {
    onMouseMove: (e) => {
      const dX = hoveredLayout
        ? e.movementX < 0
          ? e.clientX - (hoveredLayout.width * 0.5) + hoveredLayout.normalWidth
          : e.clientX + (hoveredLayout.width * 0.5)
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
    [dragging, picturesLayout]
  )

  return <Container ref={containerRef}>
    <Svg>
      <g
        onMouseMove={eventsFn.onMouseMove}
        onMouseLeave={eventsFn.onMouseOut}
        onClick={eventsFn.onClick}
      >
        {
          (!selectedLayout && hoveredLayout) && <rect
            width={large}
            height={moduleHeight + 30}
            x={hoveredLayout.x}
            y={0}
            fill={green}
            rx={2}
            ry={2}
          />
        }
        {
          selectedLayout && <rect
            width={large}
            height={moduleHeight + 30}
            x={selectedLayout.x}
            y={0}
            fill={green}
            rx={2}
            ry={2}
          />
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
    <Canvas ref={canvasRef} />

    {
      selectedLayout && <SvgDnG>
        <g transform={`translate(0, ${moduleHeight * 0.5})`}>
          <line
            x1={0}
            x2={'100%'}
            y1={0}
            y2={0}
            strokeWidth={1}
            stroke={green}
          />
          <rect
            x={selectedLayout.x}
            y={-15}
            width={selectedLayout.width}
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
        </g>
      </SvgDnG>
    }
  </Container>
}

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