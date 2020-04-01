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
import { useState, useEffect } from 'react'

export default function useViewport2d (getSize) {
  const [dragging, setDragging] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [center] = useState({ x: 0, y: 0 })
  const [targetZoom, setTargetZoom] = useState({ x: 0, y: 0 })
  const [event, setEvent] = useState(null)
  const [result, setResult] = useState(null)

  function reset (
    opts = {
      center: true,
      zoom: true
    }
  ) {
    const [width, height] = getSize()
    setDragging(false)

    if (opts.zoom) setZoom(1)
    if (opts.center) initCenter()

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
