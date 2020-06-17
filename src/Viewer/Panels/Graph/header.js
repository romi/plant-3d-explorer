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

import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import { H2, H3 } from 'common/styles/UI/Text/titles'
import { grey, blue, red } from 'common/styles/colors'

import helpIcon from '../assets/ico.help.14x14.svg'
import closeIcon from '../assets/ico.close.12.5x12.5.svg'
import downloadIcon from 'common/assets/ico.download.24x24.svg'
import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { Interactor } from 'Viewer/Interactors'

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
  width: 'calc(100% + 40px)',
  marginLeft: '-20px'
})

const LegendItem = styled.div({
  fontSize: 9,
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
  fontSize: 11,
  padding: '0px 7px',
  letterSpacing: '0',
  transition: 'width 0.15s ease',
  fontVariantNumeric: 'tabular-nums'
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

const DownloadIcon = styled.div({
  height: 22,
  width: 22,
  cursor: 'pointer',
  marginLeft: 6,
  marginBottom: -1,
  backgroundSize: 'cover',
  backgroundImage: `url(${downloadIcon})`,
  transition: 'all 0.15s ease',

  '&:hover': {
    transform: 'scale(1.20)'
  }
}, (props) => ({
  filter: props.automated
    ? 'hue-rotate(102deg) brightness(65%) saturate(100%)'
    : props.manual
      ? 'hue-rotate(202deg) brightness(100%) saturate(70%)'
      : null,
  height: props.size || null,
  width: props.size || null
}))

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  alignItems: 'center'
})

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row'
})

const SwitchContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  margin: 5,
  alignContent: 'center',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transition: 'all 0.3 ease',
    boxShadow: '1px 1px 3px 3px limegreen'
  }
})

function createDatafile (data, type = 'csv') {
  if (!Array.isArray(data)) return
  let csv = ''
  const separator = type === 'tsv' ? '\t' : ','
  data.forEach((elem, i) => {
    csv += i + separator + elem + '\n'
  })
  return 'data:text/csv;charset=utf-8,' + encodeURI(csv)
}

function DownloadButton (props) {
  const [link, setLink] = useState(null)

  useEffect(
    () => {
      let data = props.data
      if (props.unit === 'deg') {
        let dataCopy = []
        data.forEach((elem) => {
          dataCopy.push(props.valueTransform(elem))
        })
        data = dataCopy
      }
      setLink(createDatafile(data, props.type))
    }, [props.data, props.type, props.unit]
  )

  return <a
    href={link}
    download={props.download}
    style={{
      margin: 10
    }}>
    <DownloadIcon
      size={props.size}
      automated={props.automated}
      manual={props.manual}
    />
  </a>
}

function SwitchButton (props) {
  return <SwitchContainer>
    <Interactor
      onClick={props.onClickLeft}
      activated={props.switch}
    >
      <H2 style={{
        color: props.switch ? '#00a960' : null
      }}>
        {props.leftContent}
      </H2>
    </Interactor>
    <Interactor
      onClick={props.onClickRight}
      activated={!props.switch}
    >
      <H2 style={{
        color: props.switch ? null : '#00a960'
      }}>
        {props.rightContent}
      </H2>
    </Interactor>
  </SwitchContainer>
}

function DownloadMenu (props) {
  const [activated, setActivated] = useState(false)
  const [type, setType] = useState('csv')
  const [unit, setUnit] = useState('rad')

  return <MenuBox
    activate={activated}
    onClose={() => setActivated(false)}
  >
    <Tooltip>
      <DownloadIcon
        onClick={() => setActivated(!activated)}
      />
      <TooltipContent>
        <H3>
          <FormattedMessage id='tooltip-download-sequence' />
        </H3>
      </TooltipContent>
    </Tooltip>
    <MenuBoxContent>
      <ColumnContainer>
        <SwitchButton
          leftContent='CSV'
          onClickLeft={() => setType('csv')}
          rightContent='TSV'
          onClickRight={() => setType('tsv')}
          switch={type === 'csv'} />
        { props.data.unit === '°' /* Don't display the unit switch if the panel
        is the internodes panels */
          ? <SwitchButton
            leftContent='RAD'
            onClickLeft={() => setUnit('rad')}
            rightContent='DEG'
            onClickRight={() => setUnit('deg')}
            switch={unit === 'rad'} />
          : null }
        <RowContainer>
          <ColumnContainer style={{ marginRight: 20 }}>
            <H3>
              <FormattedMessage id='angles-legend-automated' />
            </H3>
            <Tooltip>
              <DownloadButton
                size={40}
                data={props.data.automated}
                automated
                download='automated.csv'
                type={type}
                unit={unit}
                valueTransform={props.data.valueTransform}
              />
              <TooltipContent>
                <H3>
                  <FormattedMessage id='tooltip-download-auto-sequence' />
                </H3>
              </TooltipContent>
            </Tooltip>
          </ColumnContainer>
          <ColumnContainer>
            <H3>
              <FormattedMessage id='angles-legend-manuel' />
            </H3>
            <Tooltip>
              <DownloadButton
                size={40}
                data={props.data.manual}
                manual
                download='manual.csv'
                type={type}
                unit={unit}
                valueTransform={props.data.valueTransform}
              />
              <TooltipContent>
                <H3>
                  <FormattedMessage id='tooltip-download-man-sequence' />
                </H3>
              </TooltipContent>
            </Tooltip>
          </ColumnContainer>
        </RowContainer>
      </ColumnContainer>
    </MenuBoxContent>
  </MenuBox>
}

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
        <DownloadMenu
          data={props.data}
        />
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
