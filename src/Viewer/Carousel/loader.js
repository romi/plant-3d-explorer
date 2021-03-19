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
import { useState, useEffect } from 'react'

import { scaleCanvas } from 'rd/tools/canvas'

const moduleHeight = 125
const imgWidth = moduleHeight * (6000 / 4000)

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
scaleCanvas(canvas, context, imgWidth, moduleHeight)

export default function useImgLoader (urls) {
  const [imgs, setImgs] = useState({})
  const tmpImgs = {}

  useEffect(
    () => {
      let unmounted = false
      urls.forEach((url) => {
        const image = new window.Image()
        image.crossOrigin = 'Anonymous'
        image.width = imgWidth * 2
        image.height = moduleHeight * 2

        image.onload = () => {
          if (!unmounted) {
            const croppedImg = new window.Image()
            croppedImg.crossOrigin = 'Anonymous'
            context.drawImage(
              image,
              0,
              0,
              imgWidth,
              moduleHeight
            )
            croppedImg.src = canvas.toDataURL()
            tmpImgs[url] = croppedImg

            setImgs({ ...tmpImgs })
          }
        }

        image.src = url
      })

      return () => {
        unmounted = true
      }
    },
    [urls]
  )

  return [imgs]
}
