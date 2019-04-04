import { useState, useEffect } from 'react'

export default function useViewport2d (getSize) {
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [center] = useState({ x: 0, y: 0 })
  const [targetZoom, setTargetZoom] = useState({ x: 0, y: 0 })
  const [event, setEvent] = useState(null)
  const [result, setResult] = useState(null)

  function reset () {
    const [width, height] = getSize()
    setDragging(false)
    setZoom(1)
    initCenter()
    setEvent(null)
    setTargetZoom({
      mx: 0,
      my: 0
    })
    setResult([
      zoom,
      0,
      0,
      width,
      height
    ])
  }

  function initCenter () {
    const [width, height] = getSize()
    if (width && height) {
      center.x = width / 2
      center.y = height / 2
    }
  }

  useState(
    initCenter,
    [1]
  )

  const eventFns = {
    onMouseDown: () => setDragging(true),
    onMouseUp: () => setDragging(false),
    onMouseMove: (e) => {
      if (dragging) {
        setTargetZoom({
          mx: e.movementX,
          my: e.movementY
        })
        setEvent('pan')
      }
    },
    onWheel: (e) => {
      const newZoom = Math.round(
        Math.min(
          Math.max(zoom + (-(e.deltaY) / 200), 1),
          15
        ) * 100
      ) / 100

      if (newZoom !== zoom) {
        setZoom(newZoom)
        setEvent('zoom')
      }
    }
  }

  useEffect(
    () => {
      if (!result) initCenter()
      const [width, height] = getSize()
      if (width && height) {
        const newWidth = width * zoom
        const newHeight = height * zoom

        if (event === 'pan') {
          center.x += (targetZoom.mx / zoom)
          center.y += (targetZoom.my / zoom)
        }

        const margin = {
          x: -(
            (newWidth / 2) -
              ((width / 2) + ((width / 2) - center.x) * -zoom)
          ),
          y: -(
            (newHeight / 2) -
              ((height / 2) + ((height / 2) - center.y) * -zoom)
          )
        }

        setResult([
          zoom,
          margin.x,
          margin.y,
          newWidth,
          newHeight
        ])
      }
    },
    [zoom, targetZoom, event, dragging]
  )

  return [
    result,
    eventFns,
    reset
  ]
}
