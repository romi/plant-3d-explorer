import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { CirclePicker } from 'react-color'

import { useSelectedAngle, useOrganColors, usePointCloudColor, useMeshColor } from 'flow/interactions/accessors'
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

export default function MiscInteractors () {
  const [selectedAngle] = useSelectedAngle()
  const [organColors, setOrganColors] = useOrganColors()
  const [pointCloudColor, setPointCloudColor] = usePointCloudColor()
  const [meshColor, setMeshColor] = useMeshColor()
  const [misc, setMisc] = useMisc()
  const [layers] = useLayers()

  return <MiscContainer>
    <ColumnContainer displayed={layers.mesh}>
      <MenuBox
        activate={misc.meshColorPicker}
        callOnChange={
          () => {
            setMisc({ ...misc, meshColorPicker: false })
          }}
        watchChange={[layers.mesh]}
      >
        <Tooltip>
          <Interactor
            activated={misc.meshColorPicker}
            onClick={() => setMisc({ ...misc,
              meshColorPicker: !misc.meshColorPicker })}
          >
            <IconStateCatcher style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }} >
              <PaintIcon isActivated={misc.meshColorPicker} />
            </IconStateCatcher>
          </Interactor>
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-mesh-color-picker' />
            </H3>
          </TooltipContent>
        </Tooltip>
        <MenuBoxContent
          style={{ padding: 10 }} >
          <CirclePicker
            onChange={
              (color) => {
                setMeshColor(color.hex)
              }}
            color={meshColor}
          />
        </MenuBoxContent>
      </MenuBox>
    </ColumnContainer>
    <ColumnContainer displayed={layers.pointCloud}>
      <MenuBox
        activate={misc.pointCloudColorPicker}
        callOnChange={
          () => {
            setMisc({ ...misc, pointCloudColorPicker: false })
          }}
        watchChange={[layers.pointCloud]}
      >
        <Tooltip>
          <Interactor
            activated={misc.pointCloudColorPicker}
            onClick={() => setMisc({ ...misc,
              pointCloudColorPicker: !misc.pointCloudColorPicker })}
          >
            <IconStateCatcher style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }} >
              <PaintIcon isActivated={misc.pointCloudColorPicker} />
            </IconStateCatcher>
          </Interactor>
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-point-cloud-color-picker' />
            </H3>
          </TooltipContent>
        </Tooltip>
        <MenuBoxContent
          style={{ padding: 10 }}
        >
          <CirclePicker
            onChange={
              (color) => {
                setPointCloudColor(color.hex)
              }
            }
            color={pointCloudColor}
          />
        </MenuBoxContent>
      </MenuBox>
    </ColumnContainer>
    <ColumnContainer displayed={layers.angles}>
      <MenuBox
        activate={misc.organColorPicker}
        callOnChange={
          () => {
            setMisc({ ...misc, organColorPicker: false })
          }}
        watchChange={[selectedAngle, layers.angles]}
      >
        <Tooltip>
          <Interactor
            isDisabled={(selectedAngle === undefined || selectedAngle === null)}
            isButton
            activated={misc.organColorPicker}
            onClick={() => setMisc({ ...misc,
              organColorPicker: !misc.organColorPicker })}
          >
            <IconStateCatcher style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }} >
              <PaintIcon isActivated={misc.organColorPicker} />
            </IconStateCatcher>
          </Interactor>
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-organ-color-picker' />
            </H3>
          </TooltipContent>
        </Tooltip>
        <MenuBoxContent
          style={{
            padding: 10
          }}>
          <CirclePicker
            onChange={
              (color) => {
                let copy = organColors.slice()
                const next = selectedAngle + 1
                copy[selectedAngle] = color.hex
                copy[next] = color.hex
                setOrganColors(copy)
              }
            }
            color={organColors[selectedAngle]}
          />
        </MenuBoxContent>
      </MenuBox>
    </ColumnContainer>
  </MiscContainer>
}
