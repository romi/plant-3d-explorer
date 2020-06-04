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
const initialState = {
  hoveredCamera: null,
  selectedCamera: null,

  hoveredAngle: null,
  selectedAngle: null,

  organColors: [],

  reset3dViewFn: null,
  reset2dViewFn: null
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'RESET_INTERACTIONS':
      return {
        ...state,
        ...initialState
      }
    case 'HOVER_CAMERA':
      return {
        ...state,
        hoveredCamera: action.value
      }
    case 'SELECT_CAMERA':
      return {
        ...state,
        selectedCamera: action.value
      }
    case 'HOVER_ANGLE':
      return {
        ...state,
        hoveredAngle: action.value
      }
    case 'SELECT_ANGLE':
      return {
        ...state,
        selectedAngle: action.value,
        selectedColor: null
      }
    case 'SET_RESET_2D_VIEW':
      return {
        ...state,
        reset2dViewFn: action.value
      }
    case 'SET_RESET_3D_VIEW':
      return {
        ...state,
        reset3dViewFn: action.value
      }
    case 'SET_ORGAN_COLORS':
      return {
        ...state,
        organColors: action.value
      }
    default:
      return state
  }
}
