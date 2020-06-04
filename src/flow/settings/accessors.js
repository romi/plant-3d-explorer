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

export const useResetSettings = useAccessor(
  [],
  [
    (value) => ({
      type: 'RESET_SETTINGS',
      value
    })
  ]
)

export const useLayers = useAccessor(
  [
    (state) => {
      return state.settings.layers
    }
  ],
  [
    (value) => ({
      type: 'SET_LAYERS',
      value
    })
  ]
)

export const usePanels = useAccessor(
  [
    (state) => {
      return state.settings.panels
    }
  ],
  [
    (value) => ({
      type: 'SET_PANELS',
      value
    })
  ]
)

export const useMisc = useAccessor(
  [
    (state) => {
      return state.settings.misc
    }
  ],
  [
    (value) => ({
      type: 'SET_MISC',
      value
    })
  ]
)
