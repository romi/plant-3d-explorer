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
import { useLayers } from 'flow/settings/accessors'
import { useScan, useScanFiles,
  useSegmentedPointCloud } from 'flow/scans/accessors'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import { IconStateCatcher } from 'rd/UI/Icon'

import { H3 } from 'common/styles/UI/Text/titles'

import { Interactor } from './index'
import { MeshIcon, PointCloudIcon, SegmentedPointCloudIcon,
  SkeletonIcon, InternodesIcon, BoundingBoxIcon } from './icons'

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

export default function LayersInteractors () {
  const [layers, setLayers] = useLayers()
  const [scan] = useScan()
  const [[meshGeometry], [pointCloudGeometry]] = useScanFiles(scan)
  const [segmentedPointCloud] = useSegmentedPointCloud()

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
        isDisabled={!segmentedPointCloud}
        activated={layers.segmentedPointCloud}
        onClick={() => setLayers({
          ...layers,
          segmentedPointCloud: !layers.segmentedPointCloud
        })} >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <SegmentedPointCloudIcon isActivated={layers.segmentedPointCloud} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-segmentedpointcloud' />
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
          <FormattedMessage id='tooltip-layer-aabb' />
        </H3>
      </TooltipContent>
    </Tooltip>
    <Tooltip>
      <Interactor
        isDisabled={!pointCloudGeometry}
        activated={layers.axisAlignedBoundingBox}
        onClick={() => setLayers({ ...layers, axisAlignedBoundingBox: !layers.axisAlignedBoundingBox})}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <BoundingBoxIcon isActivated={layers.axisAlignedBoundingBox} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-layer-aabb' />
        </H3>
      </TooltipContent>
    </Tooltip>
  </Container>
}
