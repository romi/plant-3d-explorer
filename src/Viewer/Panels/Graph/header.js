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

import { H2, H3 } from 'common/styles/UI/Text/titles'
import { grey, blue, red } from 'common/styles/colors'

import helpIcon from '../assets/ico.help.14x14.svg'
import closeIcon from '../assets/ico.close.12.5x12.5.svg'
import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

export const moduleWidth = 300

const Top = styled.div({
  width: '100%',
  marginBottom: 20
})

const Title = styled(H2)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 40
})

const HelpIcon = styled.img({
  marginLeft: 6,
  marginBottom: -1,
  transition: 'all 0.15s ease',

  '&:hover': {
    transform: 'scale(1.20)'
  }
})

const CloseIcon = styled.img({
  cursor: 'pointer',
  marginLeft: 6,
  marginBottom: -1,
  transition: 'all 0.15s ease',

  '&:hover': {
    transform: 'scale(1.20)'
  }
})

const Values = styled.div({
  marginTop: 22,
  marginBottom: 10,
  display: 'flex',
  justifyContent: 'space-between',
  background: '#ECF3F0',
  borderRadius: 5,
  alignItems: 'center',
  padding: 7,
  width: '105%',
  marginLeft: -'2.5%'
})

const LegendItem = styled.div({
  fontSize: 9,
  color: grey,
  lineHeight: '18px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  marginBottom: 5,

  '& *': {
    display: 'inline-block'
  }
})

const Value = styled.div({
  color: 'white',
  opacity: 0.8,
  borderRadius: 1,
  fontSize: 11,
  padding: '0px 7px',
  letterSpacing: '0',
  transition: 'width 0.15s ease'
}, (props) => {
  return {
    backgroundColor: !props.secondary ? blue : red,
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
  marginRight: 7,
  display: 'inline-block'
})

const HelpContent = styled(H3)({
  width: 220,
  padding: 10,
  textTransform: 'initial',
  lineHeight: '17px',
  letterSpacing: 'normal'
})

export default function Header (props) {
  return <>
    <Top>
      <Title>
        <FormattedMessage id={props.id} />
        <div style={{ position: 'relative' }}>
          <Tooltip>

            <HelpIcon src={helpIcon} />

            <TooltipContent style={{
              left: -40,
              boxShadow: '0 1px 3px 0 rgba(10,61,33,0.2)'
            }}>
              <HelpContent>
                <FormattedMessage id={props.tooltipId} />
              </HelpContent>
            </TooltipContent>
          </Tooltip>
        </div>
        <CloseIcon
          src={closeIcon}
          onClick={props.onClose}
        />
      </Title>
      <Values>
        <LegendItem>
          <ValueWording>
            <FormattedMessage id='angles-legend-automated' />
          </ValueWording>
          <Value
            condensed={!props.automatedValue}
          >
            {props.automatedValue}
          </Value>
        </LegendItem>
        {
          props.ifManualData && <LegendItem>
            <ValueWording>
              <FormattedMessage id='angles-legend-manuel' />
            </ValueWording>
            <Value
              condensed={!props.manualValue}
              secondary
            >
              {props.manualValue}
            </Value>
          </LegendItem>
        }
      </Values>
    </Top>
  </>
}
