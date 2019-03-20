import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import { H2 } from 'common/styles/UI/Text/titles'

import helpIcon from './assets/ico.help.14x14.svg'
import { grey, green, orange } from 'common/styles/colors'

const Container = styled.div({
  padding: '30px 40px',
  width: 300,
  height: '100%',
  flexShrink: 0
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
  return <Container>
    <Title>
      <FormattedMessage id='angles-title' />
      <HelpIcon src={helpIcon} />
    </Title>
    <Values>
      <LegendItem>
        <ValueWording>
          <FormattedMessage id='angles-legend-automated' />
        </ValueWording>
        <Value>
          137.5 °
        </Value>
      </LegendItem>
      <LegendItem>
        <ValueWording>
          <FormattedMessage id='angles-legend-manuel' />
        </ValueWording>
        <Value secondary>
          137.5 °
        </Value>
      </LegendItem>
    </Values>
  </Container>
}
