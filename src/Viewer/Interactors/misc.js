import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

import { useMisc } from 'flow/settings/accessors'
import { useSnapshot } from 'flow/interactions/accessors'
import ToolButton, { tools } from 'Viewer/Interactors/Tools'
import { H3 } from 'common/styles/UI/Text/titles'

export const Container = styled.div({
  position: 'absolute',
  top: 20,
  right: 50,
  display: 'flex',

  '& :first-of-type > div': {
    borderRadius: '2px 0 0 2px'
  },

  '& :last-of-type > div': {
    borderRadius: '0 2px 2px 0'
  }
})

const MiscContainer = styled(Container)({})

const DownloadButton = styled.a({
  cursor: 'pointer',
  margin: 'auto'
})

const InputResolution = styled.input({
  width: 70,
  border: 0,
  fontSize: '2em',
  textAlign: 'center',
  borderBottom: '2px solid black',
  MozAppearance: 'textfield',
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0
  },
  '&:focus': {
    transition: 'border-bottom 0.5s ease',
    border: 0,
    borderBottom: '3px solid #00a960',
    outline: 0,
    outlineOffset: 0,
    padding: 0
  }
})

export default function () {
  const [snapshot, setSnapshot] = useSnapshot()
  const [snapWidth, setSnapWidth] = useState(0)
  const [snapHeight, setSnapHeight] = useState(0)
  const [misc] = useMisc()

  useEffect(() => {
    if (misc.activeTool === null) {
      setSnapshot({
        ...snapshot,
        snapResolution: null
      })
    }
  }, [misc.activeTool])

  return <MiscContainer>
    <ToolButton
      toolsList={useMisc()}
      tool={tools.misc.snapshot}
      interactor={{
        isButton: true
      }}
      tooltipId='tooltip-snapshot'
    >
      <div style={{
        minWidth: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          margin: 'auto'
        }} >
          <InputResolution
            type='number'
            min='0'
            max='4096'
            step='10'
            placeholder='X'
            defaultValue={
              snapWidth || (snapshot.trueResolution
                ? snapshot.trueResolution.width
                : 0)
            }
            onChange={(e) => { setSnapWidth(parseInt(e.target.value)) }}
          /> <H3> X </H3>
          <InputResolution
            type='number'
            min='0'
            max='2160'
            step='10'
            placeholder='Y'
            defaultValue={
              snapHeight || (snapshot.trueResolution
                ? snapshot.trueResolution.height
                : 0)
            }
            onChange={(e) => { setSnapHeight(parseInt(e.target.value)) }}
          />
        </div>
        <DownloadButton
          onClick={
            () => {
              setSnapshot({
                ...snapshot,
                snapResolution: { width: snapWidth, height: snapHeight }
              })
            }
          }> <H3> Photo Icon </H3> </DownloadButton>
      </div>
    </ToolButton>
  </MiscContainer>
}
