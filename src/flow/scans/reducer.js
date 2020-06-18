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
export const sortingMethods = [
  {
    label: 'name',
    method: 'asc',
    defaultMethod: 'asc',
    type: 'natural'
  },
  {
    label: 'species',
    method: 'asc',
    defaultMethod: 'asc',
    type: 'natural'
  },
  {
    label: 'environment',
    method: 'asc',
    defaultMethod: 'asc',
    type: 'natural'
  },
  {
    label: 'date',
    method: 'desc',
    defaultMethod: 'desc',
    type: 'date'
  }
]

const initialState = {
  searchQuery: null,
  sorting: sortingMethods.find((d) => d.label === 'date'),
  filtering: {}
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.value
      }
    case 'SET_SORTING':
      return {
        ...state,
        sorting: action.value
      }
    case 'SET_FILTERING':
      return {
        ...state,
        filtering: action.value
      }
    default:
      return state
  }
}
