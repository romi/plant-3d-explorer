import React, { useState, useRef, useEffect } from 'react'
import { useWindowSize } from 'react-use'

import { styled } from 'rd/nano'
import { scaleCanvas } from 'rd/tools/canvas'

import { useScan } from 'flow/scans/accessors'

import { green } from 'common/global/colors'

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
  left: 0
})

const Canvas = styled.canvas({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  pointerEvents: 'none'
})

const getSize = (elem) => elem.getBoundingClientRect()

export default function Carousel () {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const windowSider = useWindowSize()
  const [scan] = useScan()
  const [urlList, setUrlList] = useState([])
  const [context, setContext] = useState(null)
  const [picturesLayout, setPicturesLayout] = useState([])
  const [hoveredLayout, setHoveredLayout] = useState(null)
  const [selectedLayout, setSelectedLayout] = useState(null)
  const cameraPoses = ((scan && scan.camera.poses) || [])
  const [imgs] = useImgLoader(urlList)
  const [hovered, setHovered] = useHoveredCamera()
  const [selected, setSelected] = useSelectedcamera()
  const large = moduleHeight * (6000 / 4000)

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
        const sizes = {
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
      const pictureHovered = picturesLayout
        .find((d) => d.x <= e.clientX && (d.x + d.width) >= e.clientX)

      if (hovered !== pictureHovered.item) {
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

  return <Container
    $ref={containerRef}
  >
    <Svg
    >
      <g
        onMouseMove={eventsFn.onMouseMove}
        onMouseLeave={eventsFn.onMouseOut}
        onClick={eventsFn.onClick}
        style={{
          cursor: 'pointer'
        }}
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
          style={{
            cursor: 'pointer'
          }}
          width='100%'
          height='100%'
          x={0}
          y={30}
          fill={'black'}
        />
      </g>
    </Svg>
    <Canvas $ref={canvasRef} />
  </Container>
}
