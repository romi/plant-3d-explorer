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
import styled from '@emotion/styled'

import {
  H1 as rdH1,
  H2 as rdH2,
  H3 as rdH3
} from 'rd/UI/Text/titles'

import { grey, green, darkGreen } from '../../colors'

export const H1 = styled(rdH1)({
  color: green,
  lineHeight: 'normal'
})

export const H2 = styled(rdH2)({
  color: darkGreen,
  lineHeight: 'normal'
})

export const H3 = styled(rdH3)({
  fontWeight: 500,
  textTransform: 'uppercase',
  color: grey,
  lineHeight: 'normal'
})
