import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { useOrganInfo, useColor, useSelectedPoints, useClickedPoint, useLabels, useSelectedLabel, useSelectionMethod } from 'flow/interactions/accessors'
import { FormattedMessage } from 'react-intl'

import { H2 } from 'common/styles/UI/Text/titles'
import useMouse from 'rd/tools/hooks/mouse'

const ContextMenuContainer = styled.div({
  zIndex: 2000,
  position: 'fixed'
}, (props) => ({
  top: props.pos.y,
  left: props.pos.x
}))

const MenuContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between'
})

const OptionContainer = styled.div({
  cursor: 'pointer',
  border: 'solid 1px transparent',
  transition: 'all 0.3 ease',
  '&:hover': {
    transition: 'all 0.3s ease',
    border: 'solid 1px limegreen'
  },
  whiteSpace: 'nowrap',
  textAlign: 'center',
  padding: 2
})

const OptionTitle = styled(H2)({
  transition: 'all 0.3s ease',
  '&:hover': {
    color: 'limegreen'
  }
})

const Option = (props) => {
  return <OptionContainer {...props}>
    <OptionTitle> { props.children } </OptionTitle>
  </OptionContainer>
}

function Bubble (props) {
  const [colors] = useColor()
  const bubbleColor = colors.organs.length >= props.organInfo &&
    colors.organs[props.organInfo - 1]
    ? colors.organs[props.organInfo - 1].rgb
    : colors.globalOrganColors[props.organInfo % 2 ? 0 : 1].rgb

  const handleMouseDown = (e) => {
    if (e.button !== 0) return
    props.setDragging(true)
    props.setRel({
      x: (e.pageX || e.clientX) - props.pos.x,
      y: (e.pageY || e.clientY) - props.pos.y
    })
  }

  const handleMouseUp = (e) => {
    if (!props.dragging) return
    props.setDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!props.dragging) return
    props.setPos({
      x: (e.pageX || e.clientX) - props.rel.x,
      y: (e.pageY || e.clientY) - props.rel.y
    })
  }

  /* The event listener needs to be removed and set back to have a fresh
    'dragging' state */
  useEffect(
    () => {
      if (props.dragging) {
        document.addEventListener('mousemove', handleMouseMove)
      }
      return () => {
        if (props.dragging) {
          document.removeEventListener('mousemove', handleMouseMove)
        }
      }
    }, [props.dragging, props.rel])

  return <div data-testid={props['data-testid']}
    style={{
      position: 'fixed',
      top: props.pos.y,
      left: props.pos.x,
      cursor: props.dragging ? 'grabbing' : 'grab',
      zIndex: 2000
    }}>
    <MenuBox
      activate
      {...props.menuBox}
    >
      <MenuBoxContent
        style={{
          backgroundColor: bubbleColor
        }}

      >
        <div data-testid={props['data-testid'] + '-content'}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {/* } Organ info can then be fetched from anywhere,
        for the moment it only prints the organ number for testing purposes
      { */}
          <H2 style={{
            color: 'white',
            mixBlendMode: 'difference' // Makes sure the text is visible
          }}>
            <FormattedMessage
              id='organ-bubble'
              values={{ ORGAN_NUMBER: props.organInfo }}
            />
          </H2>
        </div>
      </MenuBoxContent>
    </MenuBox>
  </div>
}

function ContextMenu (props) {
  const [, setSelectedPoints] = useSelectedPoints()
  const [, setSelectionMethod] = useSelectionMethod()
  const [, setClickedPoint] = useClickedPoint()

  return <ContextMenuContainer pos={props.pos} >
    <MenuBox
      activate
      {...props.menuBox}
    >
      <MenuBoxContent
        style={{
          backgroundColor: '#ffffffaa'
        }}>
        <MenuContainer>
          <Option
            onClick={() => {
              setSelectedPoints([props.point])
              setClickedPoint(null)
            }}>
            Select this point
          </Option>
          <Option
            onClick={() => {
              setSelectionMethod('proximity')
            }}>
            Select close points of the same label
          </Option>
          <Option
            onClick={() => {
              setSelectionMethod('same label')
            }}>
            Select all points with the same label
          </Option>
          <Option
            onClick={() => {
              setSelectionMethod('sphere')
            }}>
            Make a custom selection from this point
          </Option>
        </MenuContainer>
      </MenuBoxContent>
    </MenuBox>
  </ContextMenuContainer>
}

function LabelMenu (props) {
  const [labels] = useLabels()
  const [, setSelectedLabel] = useSelectedLabel()

  return <ContextMenuContainer pos={props.pos} >
    <MenuBox
      activate
      {...props.menuBox}
    >
      <MenuBoxContent
        style={{
          backgroundColor: '#ffffffaa'
        }} >
        {
          labels.map((d) => <Option
            key={d}
            onClick={() => {
              setSelectedLabel(d)
            }}>
            {d}
          </Option>
          )
        }
      </MenuBoxContent>
    </MenuBox>
  </ContextMenuContainer>
}

export default function OverlayInteractors () {
  const [tempBubblePos, setTempBubblePos] = useState(null)
  const [organInfo, setOrganInfo] = useOrganInfo()
  const [clickedPoint, setClickedPoint] = useClickedPoint()
  const [selectedPoints, setSelectedPoints] = useSelectedPoints()
  const [selectionMethod] = useSelectionMethod()
  const [bubblePositions, setBubblePositions] = useState([])
  const [contextPosition, setContextPosition] = useState(null)
  const [draggingBubble, setDraggingBubble] = useState()
  const [, setSelectedLabel] = useSelectedLabel()
  const [rel, setRel] = useState({ x: 0, y: 0 })
  const mouse = useMouse()

  useEffect(
    () => {
      if (organInfo) {
        setTempBubblePos(mouse)
      } else {
        setTempBubblePos(null)
      }
    },
    [organInfo]
  )

  useEffect(
    () => {
      if (clickedPoint) setContextPosition(mouse)
    },
    [clickedPoint]
  )

  return <div data-testid='overlay-interactors'>
    {clickedPoint && contextPosition && !selectionMethod
      ? <ContextMenu
        point={clickedPoint}
        pos={contextPosition}
        menuBox={{
          onClose: () => {
            setClickedPoint(null)
          }
        }}
      />
      : null
    }
    {!clickedPoint && contextPosition && selectedPoints && selectedPoints.length
      ? <LabelMenu
        pos={contextPosition}
        onAnyClick={() => {
          setSelectedPoints(null)
          setSelectedLabel(null)
        }}
        menuBox={{
          onClose: () => { setSelectedPoints(null) }
        }}
      />
      : null
    }
    {(tempBubblePos && !bubblePositions[organInfo])
      ? <Bubble data-testid={'temp-bubble-' + organInfo}
        pos={tempBubblePos}
        organInfo={organInfo}
        dragging={draggingBubble === organInfo}
        setDragging={(b) => {
          setDraggingBubble(b ? organInfo : null)
        }}
        rel={rel}
        setRel={setRel}
        setPos={(pos) => {
          setTempBubblePos(null)
          let copy = bubblePositions.slice()
          copy[organInfo] = pos
          setBubblePositions(copy)
          setOrganInfo(null)
        }}
        menuBox={{
          onClose: () => {
            setTempBubblePos(null)
            setOrganInfo(null)
          }
        }}
      />
      : null
    }
    {bubblePositions.map((pos, id) => {
      if (pos) {
        return <Bubble data-testid={'permanent-bubble-' + id}
          key={id}
          pos={pos}
          organInfo={id}
          dragging={draggingBubble === id}
          rel={rel}
          setRel={setRel}
          setDragging={(b) => {
            setDraggingBubble(b ? id : null)
          }}
          setPos={(pos) => {
            let copy = bubblePositions.slice()
            copy[id] = pos
            setBubblePositions(copy)
          }}
          menuBox={{
            onClose: () => {
              let copy = bubblePositions.slice()
              copy[id] = null
              setBubblePositions(copy)
              if (organInfo === id) setOrganInfo(null)
            }
          }} />
      }
      return null
    })}
  </div>
}
