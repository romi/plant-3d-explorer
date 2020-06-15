import React, { useEffect, useRef, Children, cloneElement, useState } from 'react'

import useBB from 'rd/tools/hooks/bb'
import styled from '@emotion/styled'

import closePicto from 'common/assets/ico.deselect.20x20.svg'

const InvisibleContent = styled.div({
  pointerEvents: 'none',
  display: 'block',
  minWidth: '25px',
  height: 'auto',
  position: 'static',
  visibility: 'hidden'
})

const Close = styled.div({
  position: 'absolute',
  backgroundImage: `url(${closePicto})`,
  top: 0,
  right: -25,
  width: 20,
  height: 20,
  zIndex: 1000,
  cursor: 'pointer'
})

/* This is a general component for display menus that appear when
  a button is clicked. This component is heavily inspired by the Tooltip
  component. */
export default function (props) {
  const contentRef = useRef()
  const [ref, BB] = useBB(false)
  const [contentBb, setContentBb] = useState()

  if (Array.isArray(props.children)) {
    var childrenWithoutContent = props.children
      .filter((d) => d.type !== MenuBoxContent)
    var childrenWithContent = props.children
      .filter((d) => d.type === MenuBoxContent)
  } else {
    if (props.children.type === MenuBoxContent) {
      childrenWithContent = props.children
      childrenWithoutContent = null
    } else {
      childrenWithContent = null
      childrenWithoutContent = props.children
    }
  }

  if (props.callOnChange) {
    useEffect(props.callOnChange, props.watchChange)
  }

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
    style={props.style}
  >
    {childrenWithoutContent}
    {
      props.activate
        ? Children.map(childrenWithContent, (child) => {
          return cloneElement(child, { parentBb: BB,
            contentBb: contentBb,
            onClose: props.onClose })
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
      // This is used to prevent the element from going out of the
      // screen on the left side
      ? (props.contentBb.x > props.contentBb.width / 2)
        ? (
          -(props.contentBb.width || 0) / 2
        ) + (props.parentBb.width * 0.5)
        : -props.contentBb.x
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
    <Close
      onClick={props.onClose}
    />
    <div>
      {props.children}
    </div>
  </ContentContainer>
}
