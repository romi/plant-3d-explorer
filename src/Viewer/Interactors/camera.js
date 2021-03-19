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

import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import { useReset2dView, useReset3dView, useSelectedcamera } from 'flow/interactions/accessors'
import { useLayers } from 'flow/settings/accessors'

import { H3 } from 'common/styles/UI/Text/titles'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import { IconStateCatcher } from 'rd/UI/Icon'

import { CamerasIcon, ResetIcon } from './icons'
import { Interactor } from './index'

export const Container = styled.div({
  position: 'absolute',
  top: 20,
  left: 20,
  display: 'flex',

  '& :first-of-type > div': {
    borderRadius: '2px 0 0 2px'
  },

  '& :last-of-type > div': {
    borderRadius: '0 2px 2px 0'
  }
})

const CameraContainer = styled(Container)({
  left: 'auto',
  right: '50%'
})

export default function CameraInteractors () {
  const [layers, setLayers] = useLayers()
  const [reset2dView] = useReset2dView()
  const [reset3dView] = useReset3dView()
  const [selectedCamera] = useSelectedcamera()

  return <CameraContainer>
    {
      !selectedCamera && <Tooltip>
        <Interactor
          activated={layers.cameras}
          onClick={() => setLayers({ ...layers, cameras: !layers.cameras })}
        >
          <IconStateCatcher style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} >
            <CamerasIcon isActivated={layers.cameras} />
          </IconStateCatcher>
        </Interactor>
        <TooltipContent>
          <H3>
            <FormattedMessage
              id={
                layers.cameras
                  ? 'tooltip-cameras-hide'
                  : 'tooltip-cameras-show'
              }
            />
          </H3>
        </TooltipContent>
      </Tooltip>
    }

    <Tooltip>
      <Interactor
        isButton
        activated={false}
        onClick={() => selectedCamera
          ? (reset2dView && reset2dView.fn())
          : (reset3dView && reset3dView.fn())
        }
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <ResetIcon />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-reset' />
        </H3>
      </TooltipContent>
    </Tooltip>

  </CameraContainer>
}
