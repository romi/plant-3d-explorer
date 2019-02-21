import React from 'react'

import { styled } from 'rd/nano'

import World from './world'
import Controls from './controls'

const Container = styled.div({
  width: '100vw',
  height: '100vh'
})

export default function Viewer (props) {
  return <Container>
    <World />
    <Controls />
  </Container>
}
