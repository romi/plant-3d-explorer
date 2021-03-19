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

export const useColor = useAccessor(
  [
    (state) => {
      return state.interactions.colors
    }
  ],
  [
    (value) => ({
      type: 'SET_COLORS',
      value
    })
  ]
)

export const useDefaultColors = useAccessor(
  [],
  [
    (value) => ({
      type: 'RESTORE_DEFAULT_COLOR',
      value
    })
  ]
)

export const useSnapshot = useAccessor(
  [
    (state) => {
      return state.interactions.snapshot
    }
  ],
  [
    (value) => ({
      type: 'SET_SNAPSHOT',
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

export const useOrganInfo = useAccessor(
  [
    (state) => {
      return state.interactions.organInfo
    }
  ],
  [
    (value) => ({
      type: 'SET_ORGAN_INFO',
      value
    })
  ]
)

export const useSelectedPoints = useAccessor(
  [
    (state) => {
      return state.interactions.selectedPoints
    }
  ],
  [
    (value) => ({
      type: 'SET_SELECTED_POINTS',
      value
    })
  ]
)

export const useClickedPoint = useAccessor(
  [
    (state) => {
      return state.interactions.clickedPoint
    }
  ],
  [
    (value) => ({
      type: 'SET_CLICKED_POINT',
      value
    })
  ]
)

export const useLabels = useAccessor(
  [
    (state) => {
      return state.interactions.labels
    }
  ],
  [
    (value) => ({
      type: 'SET_LABELS',
      value
    })
  ]
)

export const useSelectedLabel = useAccessor(
  [
    (state) => {
      return state.interactions.selectedLabel
    }
  ],
  [
    (value) => ({
      type: 'SET_SELECTED_LABEL',
      value
    })
  ]
)

export const useSelectionMethod = useAccessor(
  [
    (state) => {
      return state.interactions.selectionMethod
    }
  ],
  [
    (value) => ({
      type: 'SET_SELECTION_METHOD',
      value
    })
  ]
)

export const useRuler = useAccessor(
  [
    (state) => {
      return state.interactions.ruler
    }
  ],
  [
    (value) => ({
      type: 'SET_RULER',
      value
    })
  ]
)
