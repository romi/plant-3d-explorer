import React, { useState } from 'react'

import styled from '@emotion/styled'

export default function (props) {
  const [displayed, setDisplayed] = useState(false)

  const childrenWithoutContent = props.children
    .filter((d) => d.type !== MenuBoxContent)
  const childrenWithContent = props.children
    .filter((d) => d.type === MenuBoxContent)

  return <div
    onClick={() => setDisplayed(!displayed)}
  >
    {childrenWithoutContent}
    {
      displayed
        ? childrenWithContent
        : null
    }
  </div>
}

const ContentContainer = styled.div({
  midWidth: '25px',
  height: 'auto',
  position: 'absolute',
  boxShadow: '0 1px 1px 0 rgba(10, 61, 33, 0.15)',
  borderRadius: 2,
  padding: '0px 12px',
  background: 'white',
  marginTop: 10,
  zIndex: 1000
})

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
