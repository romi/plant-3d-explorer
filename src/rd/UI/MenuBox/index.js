import React, { useEffect, useRef, Children, cloneElement, useState } from 'react'

import useBB from 'rd/tools/hooks/bb'
import styled from '@emotion/styled'

const InvisibleContent = styled.div({
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

  const childrenWithoutContent = props.children
    .filter((d) => d.type !== MenuBoxContent)
  const childrenWithContent = props.children
    .filter((d) => d.type === MenuBoxContent)

  useEffect(props.callOnChange, props.watchChange)

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
  >
    {childrenWithoutContent}
    {
      props.activate
        ? Children.map(childrenWithContent, (child) => {
          return cloneElement(child, { parentBb: BB, contentBb: contentBb })
        })
        : null
    }
    {
      !contentBb && <InvisibleContent ref={contentRef}>
        {childrenWithContent}
      </InvisibleContent>
    }
  </div>
}

const ContentContainer = styled.div({
  minWidth: '25px',
  height: 'auto',
  position: 'absolute',
  boxShadow: '0 1px 1px 0 rgba(10, 61, 33, 0.15)',
  borderRadius: 2,
  padding: '0px 12px',
  background: 'white',
  marginTop: 10,
  zIndex: 1000
}, (props) => {
  return {
    top: (props.contentBb && props.top)
      ? -props.contentBb.height - 20
      : 'normal',
    marginLeft: props.contentBb
      ? (
        -(props.contentBb.width || 0) / 2
      ) + (props.parentBb.width * 0.5)
      : 0
  }
})

export function MenuBoxContent (props) {
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
