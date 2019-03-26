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
