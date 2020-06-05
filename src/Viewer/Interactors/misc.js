import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { CirclePicker } from 'react-color'

import { useSelectedAngle, useColor } from 'flow/interactions/accessors'
import { useMisc, useLayers } from 'flow/settings/accessors'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { IconStateCatcher } from 'rd/UI/Icon'
import { PaintIcon } from 'Viewer/Interactors/icons'

import { H3 } from 'common/styles/UI/Text/titles'

import { Interactor } from './index'

export const Container = styled.div({
  position: 'absolute',
  top: 20,
  marginRight: 50,
  display: 'flex',

  '& :first-of-type > div': {
    borderRadius: '2px 0 0 2px'
  },

  '& :last-of-type > div': {
    borderRadius: '0 2px 2px 0'
  }
})

const ColumnContainer = styled.div({
}, (props) => {
  return {
    display: props.displayed
      ? 'flex'
      : 'none',
    flexDirection: 'column',
    marginLeft: 2,
    marginRight: 2
  }
})

const MiscContainer = styled(Container)({
  left: 'auto',
  right: '0%'
})

function ToolButton (props) {
  return <MenuBox
    activate={props.activated}
    {...props.menuBox}
  >
    <Tooltip>
      <Interactor
        activated={props.activated}
        {...props.interactor}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {props.icon}
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id={props.tooltipId} />
        </H3>
      </TooltipContent>
    </Tooltip>
    <MenuBoxContent style={{
      padding: 10
    }} >
      {props.children}
    </MenuBoxContent>
  </MenuBox>
}

export default function MiscInteractors () {
  const [selectedAngle] = useSelectedAngle()
  const [colors, setColors] = useColor()
  const [misc, setMisc] = useMisc()
  const [layers] = useLayers()

  return <MiscContainer>
    <ColumnContainer displayed={layers.mesh}>
      <ToolButton
        activated={misc.meshColorPicker}
        menuBox={{
          callOnChange: () => {
            setMisc({ ...misc, meshColorPicker: false })
          },
          watchChange: [layers.mesh]
        }}
        interactor={{
          onClick: () => {
            setMisc({ ...misc,
              meshColorPicker: !misc.meshColorPicker })
          }
        }}
        tooltipId='tooltip-mesh-color-picker'
        icon={<PaintIcon isActivated={misc.meshColorPicker} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              setColors({
                ...colors,
                mesh: color.hex
              })
            }
          }
          color={colors.mesh}
        />
      </ToolButton>
    </ColumnContainer>
    <ColumnContainer displayed={layers.pointCloud}>
      <ToolButton
        activated={misc.pointCloudColorPicker}
        menuBox={{
          callOnChange: () => {
            setMisc({ ...misc, pointCloudColorPicker: false })
          },
          watchChange: [layers.pointCloud]
        }}
        interactor={{
          onClick: () => setMisc({ ...misc,
            pointCloudColorPicker: !misc.pointCloudColorPicker })
        }}
        tooltipId={'tooltip-point-cloud-color-picker'}
        icon={<PaintIcon isActivated={misc.pointCloudColorPicker} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              setColors({
                ...colors,
                pointCloud: color.hex
              })
            }
          }
          color={colors.pointCloud}
        />
      </ToolButton>
    </ColumnContainer>
    <ColumnContainer displayed={layers.skeleton}>
      <ToolButton
        activated={misc.skeletonColorPicker}
        menuBox={{
          callOnChange: () => {
            setMisc({ ...misc, skeletonColorPicker: false })
          },
          watchChange: [layers.skeleton]
        }}
        interactor={{
          onClick: () => setMisc({ ...misc,
            skeletonColorPicker: !misc.skeletonColorPicker })
        }}
        tooltipId={'tooltip-skeleton-color-picker'}
        icon={<PaintIcon isActivated={misc.skeletonColorPicker} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              setColors({
                ...colors,
                skeleton: color.hex
              })
            }
          }
          color={colors.skeleton}
        />
      </ToolButton>
    </ColumnContainer>
    <ColumnContainer displayed={layers.angles}>
      <ToolButton
        activated={misc.organColorPicker}
        menuBox={{
          callOnChange: () => {
            setMisc({ ...misc, organColorPicker: false })
          },
          watchChange: [layers.angles, selectedAngle]
        }}
        interactor={{
          onClick: () => {
            setMisc({ ...misc, organColorPicker: !misc.organColorPicker })
          },
          isButton: true,
          isDisabled: selectedAngle === undefined ||
            selectedAngle === null
        }}
        tooltipId='tooltip-organ-color-picker'
        icon={<PaintIcon isActivated={misc.organColorPicker} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              let copy = colors.organs.slice()
              const next = selectedAngle + 1
              copy[selectedAngle] = color.hex
              copy[next] = color.hex
              setColors({
                ...colors,
                organs: copy
              })
            }
          }
          color={colors.organs[selectedAngle]}
        />
      </ToolButton>
    </ColumnContainer>
  </MiscContainer>
}
