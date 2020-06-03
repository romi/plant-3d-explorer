import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'

import { useSelectedAngle, useSelectedColor } from 'flow/interactions/accessors'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { IconStateCatcher } from 'rd/UI/Icon'

import { H3 } from 'common/styles/UI/Text/titles'

import { Interactor } from './index'

export const Container = styled.div({
  position: 'absolute',
  top: 20,
  marginRight: 20,
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
  const [, setColor] = useSelectedColor()

  return <MiscContainer>
    <MenuBox>
      <Tooltip>
        <Interactor
          isDisabled={(selectedAngle === undefined || selectedAngle === null)}
          isButton
          activated={false} // TODO: Activate when the color palette is displayed
          onClick={() => setColor(0xFF0000)} // Dispatch an action to change the
          // selected color.
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
      <MenuBoxContent>
        <H3> Hello world !</H3>
      </MenuBoxContent>
    </MenuBox>
  </MiscContainer>
}
