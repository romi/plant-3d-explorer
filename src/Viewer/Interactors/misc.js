import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { CirclePicker } from 'react-color'

import { useSelectedAngle, useOrganColors } from 'flow/interactions/accessors'
import { useMisc } from 'flow/settings/accessors'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { IconStateCatcher } from 'rd/UI/Icon'

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

const MiscContainer = styled(Container)({
  left: 'auto',
  right: '0%'
})

export default function MiscInteractors () {
  const [selectedAngle] = useSelectedAngle()
  const [organColors, setOrganColors] = useOrganColors()
  const [misc, setMisc] = useMisc()

  return <MiscContainer>
    <MenuBox
      activate={misc.colorPicker}
      callOnChange={
        () => {
          setMisc({ ...misc, colorPicker: false })
        }}
      watchChange={[selectedAngle]}
    >
      <Tooltip>
        <Interactor
          isDisabled={(selectedAngle === undefined || selectedAngle === null)}
          isButton
          activated={misc.colorPicker}
          onClick={() => setMisc({ ...misc, colorPicker: !misc.colorPicker })}
        >
          <IconStateCatcher style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} />
        </Interactor>
        <TooltipContent>
          <H3>
            <FormattedMessage id='tooltip-color-picker' />
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
  </MiscContainer>
}
