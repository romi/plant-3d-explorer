import React from 'react'
import styled from '@emotion/styled'

import Header from './Header'
import World from './World'
import Carousel from './Carousel'
import Angles from './Angles'

const Container = styled.div({
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  userSelect: 'none'
})

const ModuleContainer = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
})

const TopContainer = styled.div({
  display: 'flex',
  width: '100%',
  flexGrow: 1
})

const BottomContainer = styled.div({
  display: 'flex',
  width: '100%'
})

export default function Viewer (props) {
  return <Container>
    <ModuleContainer>
      <Header />
      <TopContainer>
        <World />
        <Angles />
      </TopContainer>
      <BottomContainer>
        <Carousel />
      </BottomContainer>
    </ModuleContainer>
  </Container>
}
