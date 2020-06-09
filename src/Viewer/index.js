/*

Romi 3D PlantViewer: An browser application for 3D scanned
plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/
import React from 'react'
import styled from '@emotion/styled'

import Header from './Header'
import World from './World'
import Carousel from './Carousel'
import Panels from './Panels'
import Help from './Help'
import {
  LayersInteractors,
  CameraInteractors,
  PanelsInteractor,
  ToolInteractors
} from './Interactors'

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
          <ToolInteractors />
          <PanelsInteractor />
          <Help />
        </WorldContainer>
        <Panels />
      </TopContainer>
      <BottomContainer>
        <Carousel />
      </BottomContainer>
    </ModuleContainer>
  </Container>
}
