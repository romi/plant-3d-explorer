import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useWindowSize } from 'react-use'

import { styled } from 'rd/nano'
import { scaleCanvas } from 'rd/tools/canvas'

import { useScan } from 'flow/scans/accessors'

import { forgeCameraPoints } from '../World/index'
import useImgLoader from './loader'
import { useSelectedcamera } from 'flow/settings/accessors'

const moduleHeight = 125

const Container = styled.div({
  width: '100%',
  height: moduleHeight,
  background: '#1f2426'
})

const Canvas = styled.canvas({
  width: '100%',
  height: '100%',
  cursor: 'pointer'
})

const getSize = (elem) => elem.getBoundingClientRect()

export default function Carousel () {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const windowSider = useWindowSize()
  const [scan] = useScan()
  const [urlList, setUrlList] = useState([])
  const [context, setContext] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [picturesLayout, setPicturesLayout] = useState([])
  const cameraPoses = useMemo(
    () => forgeCameraPoints(scan && scan.camera.poses),
    [scan]
  )
  const [imgs] = useImgLoader(urlList)
  const [, setSelectedCamera] = useSelectedcamera()

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
        const large = moduleHeight * (6000 / 4000)
        const sizes = {
          width,
          large,
          normal: (width / cameraPoses.length),
          block: (
            (
              width - (hovered ? large : 0)
            ) /
            (
              hovered
                ? cameraPoses.length - 1
                : cameraPoses.length
            )
          )
        }

        let last = { x: 0, width: 0, normalX: 0, normalWidth: 0 }
        setPicturesLayout(
          cameraPoses.map((d, i) => {
            const isHovered = d === hovered
            const x = last.x + last.width
            const normalX = last.normalX + last.normalWidth

            const obj = {
              item: d,
              x,
              normalX,
              width: isHovered ? sizes.large : sizes.block,
              normalWidth: sizes.normal,
              height,
              hovered: isHovered
            }

            last = obj

            return obj
          })
        )
      }
    },
    [windowSider, context, cameraPoses, hovered]
  )

  useEffect(
    () => {
      if (context) {
        const { width, height } = getSize(containerRef.current)
        const large = moduleHeight * (6000 / 4000)
        context.clearRect(0, 0, width, height)

        picturesLayout.forEach((d, i) => {
          if (imgs[d.item.photoUri]) {
            const imgWidth = imgs[d.item.photoUri].width
            const imgHeight = imgs[d.item.photoUri].height
            const ratio = imgWidth / large
            const sx = (imgWidth / 2) - (d.width * ratio * 0.5)
            const sy = 0

            context.globalAlpha = d.hovered ? 1 : 0.5
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

  return <Container $ref={containerRef}>
    <Canvas
      $ref={canvasRef}
      onMouseMove={(e) => {
        const pictureHovered = picturesLayout.find((d) => d.normalX <= e.clientX && (d.normalX + d.normalWidth) >= e.clientX)
        if (hovered !== pictureHovered.item) {
          setHovered(pictureHovered ? pictureHovered.item : null)
          setSelectedCamera(pictureHovered.item)
        }
      }}
      onMouseOut={(e) => {
        setHovered(null)
        setSelectedCamera(null)
      }}
    />
  </Container>
}
