import React, { useState, Children, cloneElement, memo } from 'react'
import styled from '@emotion/styled'

function createMarkup (content) {
  return {
    __html: content
  }
}

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
    dangerouslySetInnerHTML={createMarkup(props.raw)}
  />
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
