import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import { H3, H2 } from 'common/styles/UI/Text/titles'
import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { Interactor } from 'Viewer/Interactors/'

import downloadIcon from 'common/assets/ico.download.24x24.svg'

export const DownloadIcon = styled.div({
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

export const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  alignItems: 'center'
})

export const RowContainer = styled.div({
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

export function DownloadButton (props) {
  const [link, setLink] = useState(null)

  useEffect(
    () => {
      let data = props.data
      if (props.unit === 'deg') {
        let dataCopy = []
        data.forEach((elem) => {
          dataCopy.push(props.valueTransform(elem).toFixed(1))
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

export function SwitchButton (props) {
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

export function Download (props) {
  const [activated, setActivated] = useState(false)
  const [type, setType] = useState('csv')
  const [unit, setUnit] = useState('rad')

  return <MenuBox
    activate={activated}
    onClose={() => setActivated(false)}
  >
    <Tooltip>
      <DownloadIcon
        onClick={() => setActivated(!activated)} />
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
        {props.data.unit === '°' /* Don't display the unit switch if the panel
    is the internodes panels */

          ? <SwitchButton
            leftContent='RAD'
            onClickLeft={() => setUnit('rad')}
            rightContent='DEG'
            onClickRight={() => setUnit('deg')}
            switch={unit === 'rad'} />
          : null}
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
                download={'automated.' + type}
                type={type}
                unit={unit}
                valueTransform={props.data.valueTransform} />
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
                download={'manual.' + type}
                type={type}
                unit={unit}
                valueTransform={props.data.valueTransform} />
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
