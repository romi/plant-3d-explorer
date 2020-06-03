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
import React from 'react'
import styled from '@emotion/styled'

import { omit } from 'lodash'
import Color from 'color'

import { darkGreen } from 'common/styles/colors'

import LayersInteractors from './layers'
import CameraInteractors from './camera'
import PanelsInteractor from './panels'
import MiscInteractors from './misc'

export const Interactor = styled(
  (props) => <div
    {...omit(props, ['activated', 'isDisabled', 'onClick', 'isButton'])}
    onClick={!props.isDisabled ? props.onClick : () => {}}
  />
)({
  width: 41,
  height: 30,
  marginRight: 1,
  boxShadow: '0 0px 0px 0 rgba(10,61,33,0.15)',
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& img': {
    transition: 'all 0.15s ease',
    userDrag: 'none',
    userSelect: 'none'
  },

  '&:hover': {
    zIndex: 1
  }
}, (props) => {
  if (!props.isDisabled) {
    return {
      background: props.activated
        ? 'white'
        : Color(darkGreen).alpha(0.4).toString(),

      '& img': {
        filter: props.activated
          ? ''
          : 'invert(100%) brightness(500%)'
      },

      '&:hover': {
        background: props.activated
          ? Color('white').alpha(0.6).toString()
          : Color(darkGreen).alpha(0.6).toString()
      },

      '&:active': {
        transform: 'scale(1.10)',
        boxShadow: '0 1px 1px 0 rgba(10,61,33,0.15)',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',

        background: props.activated
          ? Color(darkGreen).alpha(0.4).toString()
          : 'white',

        '& img': {
          filter: props.activated
            ? 'invert(100%) brightness(500%) !important'
            : 'invert(0%) !important'
        }
      }
    }
  } else {
    return {
      opacity: 1,
      background: Color(darkGreen).alpha(0.1).toString(),
      cursor: 'not-allowed',

      '& img': {
        opacity: 0.5,
        filter: 'invert(100%) brightness(500%)'
      }
    }
  }
})

export {
  LayersInteractors,
  CameraInteractors,
  MiscInteractors,
  PanelsInteractor
}
