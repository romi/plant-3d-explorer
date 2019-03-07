import { useState, useEffect } from 'react'

export default function useViewport2d (getSize) {
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [center] = useState({ x: 0, y: 0 })
  const [targetZoom, setTargetZoom] = useState({ x: 0, y: 0 })
  const [event, setEvent] = useState(null)

  const { width, height } = getSize()
  center.x = width / 2
  center.y = height / 2

  const [result, setResult] = useState([
    zoom,
    center.x, center.y,
    width, height
  ])

  const eventFns = {
    onMouseDown: () => setDragging(true),
    onMouseUp: () => setDragging(false),
    onMouseMove: (e) => {
      if (dragging) {
        setTargetZoom({
          mx: e.movementX,
          my: e.movementY,
          x: targetZoom.x + e.movementX,
          y: targetZoom.y + e.movementY,
          last: targetZoom.last
        })
        setEvent('pan')
      }
    },
    onWheel: (e) => {
      const newZoom = Math.min(
        Math.max(zoom + (-(e.deltaY) / 200), 1),
        15
      )

      if (newZoom !== zoom) {
        setZoom(Math.round(newZoom * 100) / 100)
        setEvent('zoom')
      }
    }
  }

  useEffect(
    () => {
      const { width, height } = getSize()
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
    [zoom, targetZoom, event]
  )

  return [
    result,
    eventFns
  ]
}
