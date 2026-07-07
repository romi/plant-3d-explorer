/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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

/**
 * A tooltip component that displays its content only when hovered.
 *
 * The component renders all children that are not of type {@link TooltipContent} normally.
 * Children that are instances of {@link TooltipContent} are rendered invisibly in the DOM
 * to measure their dimensions, and are cloned with additional layout props
 * (`parentBb` and `contentBb`) when the tooltip is hovered.
 *
 * When the mouse enters the outer `<div>` the component sets an internal hover flag,
 * causing the measured content to be rendered. On mouse leave the flag is cleared
 * and the content is hidden again. The outer element is given a `cursor: help`
 * style by default, but accepts custom styles via the `style` prop.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - All child elements of the tooltip.
 * @param {React.CSSProperties} [props.style] - Optional custom styles applied to the outer container.
 *
 * @returns {React.ReactElement} The rendered tooltip container.
 *
 * @remarks
 * Internally the component uses a `useRef` to obtain a reference to the hidden content,
 * a custom `useBB` hook to capture the bounding box of the parent element,
 * and `useState` hooks to track the bounding box of the content and the hover state.
 * It relies on React's `cloneElement` to inject layout information into the child
 * content when the tooltip is active.
 */
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

/**
 * Renders a tooltip content container.
 *
 * @param {Object} props The component properties.
 * @param {number|string} props.top The top position for the content container.
 * @param {string} [props.className] Optional class name to apply to the container.
 * @param {Object} props.parentBb The bounding box of the parent element.
 * @param {Object} props.contentBb The bounding box of the content element.
 * @param {Object} props.style Inline styles to apply to the container.
 * @param {ReactNode} props.children The children to render inside the tooltip.
 * @returns {React.ReactElement} The rendered tooltip content container.
 */
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
