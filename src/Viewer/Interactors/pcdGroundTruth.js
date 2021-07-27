import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

import { H3 } from 'common/styles/UI/Text/titles'

import { Interactor } from './index'

import { useLayers } from 'flow/settings/accessors'
import { useScan, useScanFiles } from 'flow/scans/accessors'

import { IconStateCatcher } from 'rd/UI/Icon'

import { PointCloudIcon } from './icons'

export const Container = styled.div({
  position: 'absolute',
  bottom: 40,
  left: 20,
  display: 'flex',

  '& :first-of-type > div': {
    borderRadius: '2px 0 0 2px'
  },

  '& :last-of-type > div': {
    borderRadius: '0 2px 2px 0'
  }
})

export default function GroundTruthInteractors () {
  const [layers, setLayers] = useLayers()
  const [scan] = useScan()
  const [pointCloudGroundTruthGeometry] = useScanFiles(scan)[2]

  return <Container>
    <Tooltip>
      <Interactor
        isDisabled={!pointCloudGroundTruthGeometry}
        activated={layers.pointCloudGroundTruth}
        onClick={() => setLayers({ ...layers, pointCloudGroundTruth: !layers.pointCloudGroundTruth })}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} >
          <PointCloudIcon isActivated={layers.pointCloudGroundTruth} />
        </IconStateCatcher>
      </Interactor>
      <TooltipContent
        top
        style={{
          right: -119
        }}>
        <H3>
          <FormattedMessage id='tooltip-pcd-ground-truth' />
        </H3>
      </TooltipContent>
    </Tooltip>
  </Container>
}
