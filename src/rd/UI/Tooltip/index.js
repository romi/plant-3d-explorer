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
import React, { Children, cloneElement, useState, useRef, useEffect } from 'react'

import useBB from 'rd/tools/hooks/bb'
import styled from '@emotion/styled'

const InivisibleContent = styled.div({
  pointerEvents: 'none',
  display: 'block',
  minWidth: '25px',
  height: 'auto',
  position: 'static',
  visibility: 'hidden'
})

export default function (props) {
  const contentRef = useRef()
  const [ref, BB] = useBB(false)
  const [contentBb, setContentBb] = useState()
  const [hovered, setHovered] = useState(false)

  const childrenWithoutContent = props.children
    .filter((d) => d.type !== TooltipContent)
  const childrenContent = props.children
    .filter((d) => d.type === TooltipContent)

  useEffect(
    () => {
      if (contentRef.current) {
        setContentBb(contentRef.current.children[0].getBoundingClientRect())
      }
    },
    [contentRef.current]
  )

  return <div data-testid='tooltip'
    ref={ref}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    style={{
      cursor: 'help',
      ...props.style
    }}
  >
    {childrenWithoutContent}
    {
      hovered
        ? Children.map(childrenContent, (child) => {
          return cloneElement(child, { parentBb: BB, contentBb: contentBb })
        })
        : null
    }
    {
      !contentBb && <InivisibleContent ref={contentRef}>
        {childrenContent}
      </InivisibleContent>
    }
  </div>
}

const ContentContainer = styled.div({
  minWidth: '25px',
  height: 'auto',
  position: 'absolute',
  boxShadow: '0 1px 1px 0 rgba(10,61,33,0.15)',
  borderRadius: 2,
  padding: '0px 12px',
  background: 'white',
  pointerEvents: 'none',
  marginTop: 10,
  zIndex: 1000
}, (props) => {
  return {
    top: (props.contentBb && props.top)
      ? -props.contentBb.height - 20
      : 'normal',
    marginLeft: props.contentBb
      ? (props.contentBb.x > props.contentBb.width / 2)
        ? (
          -(props.contentBb.width || 0) / 2
        ) + (props.parentBb.width * 0.5)
        : -props.contentBb.x
      : 0
  }
})

export function TooltipContent (props) {
  return <ContentContainer
    top={props.top}
    className={props.className}
    parentBb={props.parentBb}
    contentBb={props.contentBb}
    style={props.style}
  >
    <div>
      {props.children}
    </div>
  </ContentContainer>
}
