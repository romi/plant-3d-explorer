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
import { useEffect, useState, useRef } from 'react'

export default function () {
  const ref = useRef()
  const [value, setValue] = useState()

  function getValue () {
    return value
  }

  useEffect(
    () => {
      let unmounted

      function onFrame () {
        if (ref.current) {
          const bb = ref.current.getBoundingClientRect()
          const v = getValue()

          if (
            !unmounted && (
              (!v) || (
                v.x !== bb.x ||
                v.y !== bb.y ||
                v.top !== bb.top ||
                v.bottom !== bb.bottom ||
                v.left !== bb.left ||
                v.right !== bb.right ||
                v.width !== bb.width ||
                v.height !== bb.height
              )
            )
          ) {
            setValue(bb)
          }
          loop()
        }
      }

      function loop () {
        if (!unmounted && ref.current) window.requestAnimationFrame(onFrame)
      }

      if (ref.current) onFrame()

      return () => {
        unmounted = true
      }
    },
    [ref.current, value]
  )

  return [
    ref,
    value
  ]
}
