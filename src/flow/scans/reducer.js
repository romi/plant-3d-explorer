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
/**
 * Array of sorting method configurations used for organizing data.
 *
 * Each object in the array specifies sorting behavior for a particular property.
 *
 * Properties of each sorting method object:
 * - `label`: A string representing the name or identifier of the property to sort by.
 * - `method`: The initial sorting direction, such as 'asc' for ascending or 'desc' for descending.
 * - `defaultMethod`: The default sorting direction to be used when a specific method is not provided.
 * - `type`: The sorting type to be applied, such as 'natural' for natural ordering or 'date' for date-based ordering.
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

/**
 * Represents the initial state of an application or component,
 * defining default values for search query, sorting method, and filtering criteria.
 *
 * @typedef {Object} initialState
 * @property {string|null} searchQuery - The current or default query string for searching. Null indicates no query is set.
 * @property {Object|null} sorting - The default sorting method, selected from a predefined list of sorting methods.
 * @property {Object} filtering - An object containing criteria for filtering results, defaults to an empty object.
 */
export const initialState = {
  searchQuery: null,
  sorting: sortingMethods.find((d) => d.label === 'date'),
  filtering: {}
}

/**
 * Reducer function to manage settings state in an application. Processes
 * dispatched actions and updates the state accordingly.
 *
 * @param {Object} state - The current state of the settings. Defaults to the initial state if not provided.
 * @param {Object} action - The dispatched action containing a type and an optional value.
 * @param {string} action.type - The identifier for the type of action to be performed.
 * @param {*} [action.value] - The value associated with the action, used to update the state.
 * @return {Object} The updated state based on the action type and value, or the current state if no matching action type is found.
 */
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
