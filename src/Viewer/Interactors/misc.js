import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from '@emotion/styled'

import { useMisc } from 'flow/settings/accessors'
import { useColor, useDefaultColors, useSnapshot }
  from 'flow/interactions/accessors'
import ToolButton, { tools } from 'Viewer/Interactors/Tools'
import { H3 } from 'common/styles/UI/Text/titles'
import { PaintIcon } from 'Viewer/Interactors/icons'

import { SketchPicker } from 'react-color'

import { ResetButton } from 'rd/UI/Buttons'
import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

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

const HoverContainer = styled.div({
  transition: 'all 1s ease',
  opacity: '1',
  cursor: 'pointer',
  '&:hover': {
    transition: 'all 1s ease',
    opacity: '0.3'
  }
})

function GenerateDownloadButton (props) {
  return <a
    style={{ margin: 'auto', cursor: 'pointer' }}
    href={props.image}
    download='snapshot.png'
    onClick={
      !props.image ? props.onGenerateClick : null
    }
  >
    {/* TODO: This is not final, there will be an image */}
    <H3> {props.image
      ? 'Download' : 'Take a snapshot'} </H3>
  </a>
}

function ImagePreview (props) {
  return <Tooltip>
    <HoverContainer
      onClick={props.onClick}>
      <img
        src={props.image}
        width='100%'
        height='100%'
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 0,
          marginBottom: 10,
          maxWidth: '100%',
          height: 'auto'
        }}
        // TODO: Update the react-intl version to translate the alt
        alt='Preview of the snapshot'
      />
    </HoverContainer>
    <TooltipContent
      style={{ top: '50%' }}>
      <H3> <FormattedMessage id='tooltip-delete-snapshot' /> </H3>
    </TooltipContent>
  </Tooltip>
}

export default function () {
  const [snapshot, setSnapshot] = useSnapshot()
  const [snapWidth, setSnapWidth] = useState(0)
  const [snapHeight, setSnapHeight] = useState(0)
  const [colors, setColors] = useColor()
  const [resetDefaultColor] = useDefaultColors()
  const [misc] = useMisc()

  console.log(snapWidth, snapHeight, snapshot)

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
      tool={tools.colorPickers.background}
      interactor={{
        isButton: true
      }}
      tooltipId='tooltip-background-color-picker'
      icon={<PaintIcon
        isActivated={misc.activeTool === tools.colorPickers.background} />}
    >
      <SketchPicker disableAlpha
        onChange={
          (color) => {
            setColors({
              ...colors,
              background: color.hex
            })
          }
        }
        color={colors.background}
      />
      <ResetButton
        onClick={
          () => {
            resetDefaultColor('background')
          }
        }
      />
    </ToolButton>
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
        <Tooltip
          style={{
            padding: 0,
            margin: 'auto',
            width: 40
          }}>
          <ResetButton
            onClick={
              () => {
                setSnapWidth(snapshot.trueResolution.width)
                setSnapHeight(snapshot.trueResolution.height)
              }
            }
          />
          <TooltipContent>
            <H3> <FormattedMessage id='tooltip-reset-resolution' /> </H3>
          </TooltipContent>
        </Tooltip>
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
            onChange={
              (e) => {
                setSnapWidth(parseInt(
                  Math.min(Math.max(e.target.value, 0), 4096)))
              }
            }
            value={
              snapWidth ||
                (snapshot.trueResolution
                  ? snapshot.trueResolution.width
                  : 0)}
          /> <H3> X </H3>
          <InputResolution
            type='number'
            min='0'
            max='2160'
            step='10'
            placeholder='Y'
            onChange={
              (e) => {
                setSnapHeight(parseInt(Math.min(Math.max(
                  e.target.value, 0), 2160)))
              }
            }
            value={
              snapHeight ||
                (snapshot.trueResolution
                  ? snapshot.trueResolution.height
                  : 0)}
          />
        </div>
        { snapshot.image
          ? <div>
            <H3
              style={{ textAlign: 'center' }}>
              <FormattedMessage id='snapshot-preview' />
            </H3>
            <ImagePreview
              image={snapshot.image}
              onClick={
                () => {
                  setSnapshot({
                    ...snapshot,
                    image: null
                  })
                }
              }
            />
          </div>
          : null
        }
        <GenerateDownloadButton
          image={snapshot.image}
          onGenerateClick={
            () => {
              setSnapshot({
                ...snapshot,
                snapResolution: { width: snapWidth, height: snapHeight }
              })
            }
          } />
      </div>
    </ToolButton>
  </MiscContainer>
}
