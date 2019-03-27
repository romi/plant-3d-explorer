import React from 'react'
import styled from '@emotion/styled'
import Color from 'color'
import { FormattedMessage } from 'react-intl'
import { omit } from 'lodash'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

import { useSelectedcamera, useHoveredCamera } from 'flow/interactions/accessors'

import { darkGreen } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

import helpIcon from './assets/ico.help.14x14.svg'
import leftMouseIco from './assets/ico.left_click_to_rotate.14x20.svg'
import rightMouseIco from './assets/ico.right_click_to_pan.14x20.svg'
import WheelMouseIco from './assets/ico.scroll_to_zoom.14x20.svg'

const Container = styled((props) => <div {...omit(props, 'onTop')} />)({
  position: 'absolute',
  bottom: 20,
  right: 20
}, (props) => {
  return {
    zIndex: !props.onTop ? 1 : 'normal'
  }
})
const Background = styled.div({
  borderRadius: 2,
  background: Color(darkGreen).alpha(0.4).toString(),
  padding: 8,
  paddingBottom: 1
})

const Image = styled.img({
  width: 14,
  height: 20,
  marginRight: 18
})

const Advice = styled(H3)({
  display: 'flex',
  alignItems: 'center'
})

const Content = styled.div({
  width: 260,
  padding: '13px 2px'
})

export default function Help () {
  const [ hoveredCamera ] = useHoveredCamera()
  const [ selectedCamera ] = useSelectedcamera()
  return <Container onTop={!!(hoveredCamera || selectedCamera)}>
    <Tooltip>
      <Background>
        <img
          alt=''
          src={helpIcon}
        />
      </Background>
      <TooltipContent
        top
        style={{
          left: -119,
          marginTop: !selectedCamera ? 0 : 30
        }}
      >
        <Content>
          <Advice>
            <Image
              alt=''
              src={leftMouseIco}
            />
            <FormattedMessage id={
              !selectedCamera
                ? 'tooltip-help-rotate'
                : 'tooltip-help-pan'
            } />
          </Advice>
          {
            !selectedCamera && <Advice>
              <Image
                alt=''
                src={rightMouseIco}
              />
              <FormattedMessage id='tooltip-help-pan' />
            </Advice>
          }
          <Advice>
            <Image
              alt=''
              src={WheelMouseIco}
            />
            <FormattedMessage id='tooltip-help-zoom' />
          </Advice>
        </Content>
      </TooltipContent>
    </Tooltip>
  </Container>
}
