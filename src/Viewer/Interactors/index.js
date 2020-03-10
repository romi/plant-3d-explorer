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
import { FormattedMessage } from 'react-intl'
import { omit } from 'lodash'
import Color from 'color'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import { IconStateCatcher } from 'rd/UI/Icon'

import { useLayers } from 'flow/settings/accessors'
import { useScan, useScanFiles } from 'flow/scans/accessors'

import { darkGreen } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

import { useReset2dView, useReset3dView, useSelectedcamera } from 'flow/interactions/accessors'

import {
  MeshIcon, PointCloudIcon, SkeletonIcon, InternodesIcon,
  CamerasIcon, ResetIcon
} from './icons'

const Container = styled.div({
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
  right: 20
})

const Interactor = styled(
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

export function LayersInteractors () {
  const [layers, setLayers] = useLayers()
  const [scan] = useScan()
  const [[meshGeometry], [pointCloudGeometry]] = useScanFiles(scan)

  return <Container>
    <Tooltip>
      <Interactor
        isDisabled={!meshGeometry}
        activated={layers.mesh}
        onClick={() => setLayers({ ...layers, mesh: !layers.mesh })}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <MeshIcon isActivated={layers.mesh} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-mesh' />
        </H3>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <Interactor
        isDisabled={!pointCloudGeometry}
        activated={layers.pointCloud}
        onClick={() => setLayers({ ...layers, pointCloud: !layers.pointCloud })}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <PointCloudIcon isActivated={layers.pointCloud} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-pointcloud' />
        </H3>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <Interactor
        isDisabled={!(scan && scan.data.skeleton)}
        activated={layers.skeleton}
        onClick={() => setLayers({ ...layers, skeleton: !layers.skeleton })}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <SkeletonIcon isActivated={layers.skeleton} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-skeleton' />
        </H3>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <Interactor
        isDisabled={!(scan && scan.data.angles)}
        activated={layers.angles}
        onClick={() => setLayers({ ...layers, angles: !layers.angles })}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <InternodesIcon isActivated={layers.angles} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-organs' />
        </H3>
      </TooltipContent>
    </Tooltip>
  </Container>
}

export function CameraInteractors () {
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
