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
import useAccessor from 'rd/tools/hooks/accessor'

export const useResetInteraction = useAccessor(
  [],
  [
    (value) => ({
      type: 'RESET_INTERACTIONS',
      value
    })
  ]
)

export const useHoveredCamera = useAccessor(
  [
    (state) => {
      return state.interactions.hoveredCamera
    }
  ],
  [
    (value) => ({
      type: 'HOVER_CAMERA',
      value
    })
  ]
)
export const useSelectedcamera = useAccessor(
  [
    (state) => {
      return state.interactions.selectedCamera
    }
  ],
  [
    (value) => ({
      type: 'SELECT_CAMERA',
      value
    })
  ]
)

export const useHoveredAngle = useAccessor(
  [
    (state) => {
      return state.interactions.hoveredAngle
    }
  ],
  [
    (value) => ({
      type: 'HOVER_ANGLE',
      value
    })
  ]
)
export const useSelectedAngle = useAccessor(
  [
    (state) => {
      return state.interactions.selectedAngle
    }
  ],
  [
    (value) => ({
      type: 'SELECT_ANGLE',
      value
    })
  ]
)

export const useReset2dView = useAccessor(
  [
    (state) => {
      return state.interactions.reset2dViewFn
    }
  ],
  [
    (value) => ({
      type: 'SET_RESET_2D_VIEW',
      value
    })
  ]
)

export const useReset3dView = useAccessor(
  [
    (state) => {
      return state.interactions.reset3dViewFn
    }
  ],
  [
    (value) => ({
      type: 'SET_RESET_3D_VIEW',
      value
    })
  ]
)
