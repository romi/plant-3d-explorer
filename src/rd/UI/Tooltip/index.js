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

  return <div
    ref={ref}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    style={{
      cursor: 'help'
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
  marginTop: 10
}, (props) => {
  return {
    marginLeft: props.contentBb
      ? (
        -(props.contentBb.width || 0) / 2
      ) + (props.parentBb.width * 0.5)
      : 0
  }
})

export function TooltipContent (props) {
  return <ContentContainer
    className={props.className}
    parentBb={props.parentBb}
    contentBb={props.contentBb}
  >
    <div>
      {props.children}
    </div>
  </ContentContainer>
}
