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

export const initialState = {
  layers: {
    mesh: false,
    pointCloud: false,
    pointCloudGroundTruth: false,
    skeleton: true,
    angles: true,
    cameras: false,
    segmentedPointCloud: false
  },
  panels: {
    'panels-angles': true,
    'panels-distances': true,
    'panels-evaluation': false
  },
  evaluation: {
    activeEvaluation: 'segmentation2D',
    data: 'precision'
  },
  layerTools: {
    activeTool: null
  },
  misc: {
    activeTool: null,
    scale: 1
  },
  carousel: {
    photoSet: 'images'
  }
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'RESET_SETTINGS':
      return {
        ...state,
        ...initialState
      }
    case 'SET_LAYERS':
      return {
        ...state,
        layers: action.value
      }
    case 'SET_PANELS':
      return {
        ...state,
        panels: action.value
      }
    case 'SET_EVALUATION':
      return {
        ...state,
        evaluation: action.value
      }
    case 'SET_LAYER_TOOLS':
      return {
        ...state,
        layerTools: action.value
      }
    case 'SET_MISC':
      return {
        ...state,
        misc: action.value
      }
    case 'SET_CAROUSEL':
      return {
        ...state,
        carousel: action.value
      }
    default:
      return state
  }
}
