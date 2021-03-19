/*

Plant 3D Explorer: An browser application for 3D scanned
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
import React, { useState, Children, cloneElement, memo } from 'react'
import styled from '@emotion/styled'

const defaultRules = {
  default: {},
  hover: {},
  active: {}
}

const Container = styled.div({
  display: 'inline-block',

  '& svg': {
    display: 'block'
  }
}, (props) => {
  return {
    ...props.rules.default,
    ...(
      props.hovered || props.isHovered
        ? props.rules.hover
        : {
          '&:hover': props.rules.hover
        }
    ),
    ...(
      (props.activated || props.isActivated)
        ? props.rules.active
        : {
          '&:active': props.rules.active
        }
    )
  }
})

export default function Icon (props) {
  return <Container
    className={'icon'}
    hovered={props.hovered}
    isHovered={props.isHovered}
    isActivated={props.isActivated}
    activated={props.activated}
    rules={{
      ...defaultRules,
      ...(props.rules || {})
    }}
  >
    <img src={props.raw} alt={props.alt} />
  </Container>
}

export function IconHOC (comp) {
  const newComp = memo(comp)
  newComp.icon = true
  return newComp
}

const childWalker = (child, condition, action) => {
  return Children.map(
    child,
    (comp) => {
      if (typeof comp === 'object') {
        if (condition(comp)) {
          return action(comp)
        } else {
          return comp
        }
      } else {
        return comp
      }
    }
  )
}

const StateCatcherContainer = styled.div({
  width: '100%',
  height: '100%'
})

export function IconStateCatcher (props) {
  const [hovered, setHovered] = useState(false)
  const [activated, setActivated] = useState(false)

  const newChildren = Children.map(
    props.children,
    (comp) => {
      return childWalker(
        comp,
        (comp) => comp.type && comp.type.icon,
        (comp) => cloneElement(comp, { hovered, activated })
      )
    }
  )

  return <StateCatcherContainer
    className={props.className || ''}
    style={props.style || {}}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onMouseDown={() => setActivated(true)}
    onMouseUp={() => setActivated(false)}
  >
    {newChildren}
  </StateCatcherContainer>
}
