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
import styled from '@emotion/styled'

import resetArrow from 'common/assets/ico.reset.25x25.svg'

export const ResetButton = styled.div({
  backgroundImage: `url(${resetArrow})`,
  width: 25,
  height: 25,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 10,
  cursor: 'pointer',
  transition: 'transform 0.5s ease',
  transform: 'rotate(0deg)',
  '&:hover': {
    transition: 'transform 0.5s ease',
    transform: 'rotate(-360deg)'
  }
})
