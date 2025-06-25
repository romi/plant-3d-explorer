/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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
export const initialState = {
  hoveredCamera: null,
  selectedCamera: null,

  hoveredAngle: null,
  selectedAngle: null,

  organInfo: null,

  clickedPoint: null,
  selectedPoints: [],
  labels: [],
  selectedLabel: null,
  selectionMethod: null,

  colors: {
    // Previous color values are left in comments
    mesh: { rgb: '#96c0a7', a: 0.5 }, // a: 1
    pointCloud: { rgb: '#f8de96', a: 1 },
    pointCloudGroundTruth: { rgb: '#f8de96', a: 1 },
    segmentedPointCloud: [],
    skeleton: { rgb: '#D0021B', a: 0.7 }, // { rgb: '#5ca001', a: 1 },
    organs: [],
    globalOrganColors: [
      { rgb: '#BD10E0', a: 0.5 },
      { rgb: '#E691F7', a: 0.5 }
    ], // [{ rgb: '#3a4d45', a: 0.2 }, { rgb: '#00a960', a: 0.2 }],
    background: { rgb: '#000000', a: 1.0 }
  },

  pointCloudZoom: {
    level: 2
  },

  pointCloudSize: {
    sampleSize: 1000
  },

  snapshot: {
    snapResolution: null,
    trueResolution: null,
    image: null
  },

  ruler: {
    scaling: false,
    measuring: false,
    measure: 0,
    scaleSet: false
  },

  aabb: {
    min: {
      x: 0,
      y: 0,
      z: 0
    },
    max: {
      x: 0,
      y: 0,
      z: 0
    },
    enforceReset: false
  },
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
    case 'SET_COLORS':
      return {
        ...state,
        colors: action.value
      }
    case 'RESTORE_DEFAULT_COLOR':
      return {
        ...state,
        colors: {
          ...state.colors,
          [action.value]: initialState.colors[action.value]
        }
      }
    case 'SET_SNAPSHOT':
      return {
        ...state,
        snapshot: action.value
      }
    case 'SET_ORGAN_INFO':
      return {
        ...state,
        organInfo: action.value
      }
    case 'SET_SELECTED_POINTS':
      return {
        ...state,
        selectedPoints: action.value
      }
    case 'SET_CLICKED_POINT':
      return {
        ...state,
        clickedPoint: action.value
      }
    case 'SET_LABELS':
      return {
        ...state,
        labels: action.value
      }
    case 'SET_SELECTED_LABEL':
      return {
        ...state,
        selectedLabel: action.value
      }
    case 'SET_SELECTION_METHOD':
      return {
        ...state,
        selectionMethod: action.value
      }
    case 'SET_RULER':
      return {
        ...state,
        ruler: action.value
      }
    case 'SET_POINT_CLOUD_ZOOM':
      return {
        ...state,
        pointCloudZoom: action.value
      }
    case 'SET_POINT_CLOUD_SIZE':
      return {
        ...state,
        pointCloudSize: action.value
      }
    case 'SET_AABB':
      return {
        ...state,
        aabb: action.value
      }
    default:
      return state
  }
}
