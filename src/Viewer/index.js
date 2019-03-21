import React from 'react'
import styled from '@emotion/styled'

import Header from './Header'
import World from './World'
import { LayersInteractors, CameraInteractors } from './Interactors'
import Carousel from './Carousel'
import Angles from './Angles'

const Container = styled.div({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
  userSelect: 'none'
})

const ModuleContainer = styled.div({
  position: 'relative',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
})

const TopContainer = styled.div({
  position: 'relative',
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  flexGrow: 1
})

const WorldContainer = styled.div({
  position: 'relative',
  height: '100%',
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
        <WorldContainer>
          <World />
          <LayersInteractors />
          <CameraInteractors />
        </WorldContainer>
        <Angles />
      </TopContainer>
      <BottomContainer>
        <Carousel />
      </BottomContainer>
    </ModuleContainer>
  </Container>
}
