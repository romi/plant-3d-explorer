import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import { H2 } from 'common/styles/UI/Text/titles'
import { grey, green, orange, lightGrey } from 'common/styles/colors'

import { useScan } from 'flow/scans/accessors'

import helpIcon from './assets/ico.help.14x14.svg'
import Graph from './graph'
import { useHoveredAngle, useSelectedAngle } from 'flow/interactions/accessors'

export const moduleWidth = 300

const Container = styled.div({
  padding: '30px 40px',
  paddingBottom: 19,
  width: moduleWidth,
  height: '100%',
  flexShrink: 0,
  borderTop: `1px solid ${lightGrey}`,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
})

const Top = styled.div({
  width: '100%'
})

const Title = styled(H2)({
  display: 'flex',
  alignItems: 'center'
})

const HelpIcon = styled.img({
  marginLeft: 6,
  marginBottom: -3,
  transition: 'all 0.15s ease',

  '&:hover': {
    transform: 'scale(1.20)'
  }
})

const Values = styled.div({
  marginTop: 32
})

const LegendItem = styled.div({
  fontSize: 11,
  color: grey,
  lineHeight: '18px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',

  '& *': {
    display: 'inline-block'
  }
})

const Value = styled.div({
  color: 'white',
  opacity: 0.8,
  borderRadius: 1,
  padding: '0px 7px',
  marginBottom: 5,
  letterSpacing: '0',
  transition: 'width 0.15s ease'
}, (props) => {
  return {
    backgroundColor: !props.secondary ? green : orange,
    padding: !props.condensed
      ? '0px 7px'
      : '0',
    width: !props.condensed
      ? 'auto'
      : 3,
    height: !props.condensed
      ? 'auto'
      : 18
  }
})

const ValueWording = styled.span({
  width: 123,
  display: 'inline-block'
})

export default function () {
  const [scan] = useScan()
  const [hoveredAngle] = useHoveredAngle()
  const [selectedAngle] = useSelectedAngle()

  const highlightedAngle = hoveredAngle || selectedAngle

  if (!(scan && scan.data.angles)) return null

  // Debug
  // @TODO remove
  // scan.data.angles.measured_angles = scan.data.angles.angles
  //   .map((d) => Math.random() * Math.PI)

  const ifManualData = !!scan.data.angles.measured_angles
  const ifHighligthed = (highlightedAngle !== null) && (highlightedAngle !== undefined)

  return <Container>
    <Top>
      <Title>
        <FormattedMessage id='angles-title' />
        <HelpIcon src={helpIcon} />
      </Title>
      <Values>
        <LegendItem>
          <ValueWording>
            <FormattedMessage id='angles-legend-automated' />
          </ValueWording>
          <Value
            condensed={!ifHighligthed}
          >
            {
              ifHighligthed
                ? (scan.data.angles.angles[highlightedAngle] * 57.2958).toFixed(0) + ' °'
                : ''
            }
          </Value>
        </LegendItem>
        {
          ifManualData && <LegendItem>
            <ValueWording>
              <FormattedMessage id='angles-legend-manuel' />
            </ValueWording>
            <Value
              condensed={!ifHighligthed}
              secondary
            >
              {
                ifHighligthed
                  ? (scan.data.angles.measured_angles[highlightedAngle] * 57.2958).toFixed(0) + ' °'
                  : ''
              }
            </Value>
          </LegendItem>
        }
      </Values>
    </Top>

    <Graph data={scan.data.angles} />
  </Container>
}
