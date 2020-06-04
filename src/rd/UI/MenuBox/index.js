import React from 'react'

import styled from '@emotion/styled'

export default function (props) {
  const childrenWithoutContent = props.children
    .filter((d) => d.type !== MenuBoxContent)
  const childrenWithContent = props.children
    .filter((d) => d.type === MenuBoxContent)

  return <div
  >
    {childrenWithoutContent}
    {
      props.activate
        ? childrenWithContent
        : null
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
}/* , (props) => {
  return {
    marginLeft: props.contentWidth
      ? props.contentWidth / 2
      : 0
  }
} */)

export function MenuBoxContent (props) {
  return <ContentContainer
    top={props.top}
    className={props.className}
    style={props.style}
  >
    <div>
      {props.children}
    </div>
  </ContentContainer>
}
