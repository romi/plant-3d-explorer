import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from '@emotion/styled'

import { useFiltering } from 'flow/scans/accessors'
import { H3 } from 'common/styles/UI/Text/titles'
import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import { Icon, MeasuresText } from 'ScanList/list'

import meshIcon from 'common/assets/ico.mesh.21x21.svg'
import pointCloudIcon from 'common/assets/ico.point_cloud.21x21.svg'
import skeletonIcon from 'common/assets/ico.skeleton.21x21.svg'
import nodeIcon from 'common/assets/ico.internodes.21x21.svg'

const ClickableIcon = styled(Icon)({
  cursor: 'pointer'
})

const ClickableMeasures = styled(MeasuresText)({
  '&:hover': {
    filter: 'brightness(120%)'
  },
  cursor: 'pointer'
})

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: 100
})

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column'
})

const ColumTitle = styled(H3)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  marginLeft: -38,
  marginRight: 98
})

function Filter (props) {
  const [filtering, setFiltering] = useFiltering()

  return <>
    <ClickableIcon
      src={props.icon}
      isActive={filtering[props.field]}
      onClick={() => {
        setFiltering({
          ...filtering,
          [props.field]: !filtering[props.field]
        })
      }}
    />
  </>
}

export default function (props) {
  const [filtering, setFiltering] = useFiltering()

  useEffect(() => {
    setFiltering({
      hasMesh: false,
      hasPointCloud: false,
      hasSkeleton: false,
      hasAngleData: false,
      hasManualMeasures: false,
      hasAutomatedMeasures: false
    })
  }, [])

  return <RowContainer data-testid='filtering'>
    <ColumTitle key={'data'}>
      <Tooltip>
        <FormattedMessage id='scanlist-data-availability' />
        <TooltipContent style={{ marginTop: -100 }}>
          <H3>
            <FormattedMessage id='tooltip-scanlist-filter-data-availability' />
          </H3>
        </TooltipContent>
      </Tooltip>
      <RowContainer>
        <Filter icon={meshIcon}
          field={'hasMesh'}
        />
        <Filter icon={pointCloudIcon}
          field={'hasPointCloud'}
        />
        <Filter icon={skeletonIcon}
          field={'hasSkeleton'}
        />
        <Filter icon={nodeIcon}
          field={'hasAngleData'}
        />
      </RowContainer>
    </ColumTitle>
    <ColumTitle>
      <Tooltip>
        <FormattedMessage id='scanlist-measures-availability' />
        <TooltipContent style={{ marginTop: -80 }}>
          <H3>
            <ColumnContainer>
              <FormattedMessage
                id='tooltip-filter-scanlist-measures-availability'
              />
            </ColumnContainer>
          </H3>
        </TooltipContent>
      </Tooltip>
      <ClickableMeasures
        automated
        onClick={() => setFiltering({
          ...filtering,
          hasAutomatedMeasures: !filtering.hasAutomatedMeasures
        })}
        isActive={filtering.hasAutomatedMeasures}
      >
        <FormattedMessage id='angles-legend-automated' />
      </ClickableMeasures>
      <ClickableMeasures
        onClick={() => setFiltering({
          ...filtering,
          hasManualMeasures: !filtering.hasManualMeasures
        })}
        isActive={filtering.hasManualMeasures}
      >
        <FormattedMessage id='angles-legend-manuel' />
      </ClickableMeasures>
    </ColumTitle>
  </RowContainer>
}
