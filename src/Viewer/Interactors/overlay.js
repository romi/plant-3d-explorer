import React, { useEffect, useState } from 'react'

import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { useOrganInfo, useColor } from 'flow/interactions/accessors'
import { FormattedMessage } from 'react-intl'

import { H2 } from 'common/styles/UI/Text/titles'
import useMouse from 'rd/tools/hooks/mouse'

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
      x: e.pageX - props.pos.x,
      y: e.pageY - props.pos.y
    })
  }

  const handleMouseUp = (e) => {
    if (!props.dragging) return
    props.setDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!props.dragging) return
    props.setPos({
      x: e.pageX - props.rel.x,
      y: e.pageY - props.rel.y
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

  return <div
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
        <div
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

export default function OverlayInteractors () {
  const [tempBubblePos, setTempBubblePos] = useState(null)
  const [organInfo, setOrganInfo] = useOrganInfo()
  const [bubblePositions, setBubblePositions] = useState([])
  const [draggingBubble, setDraggingBubble] = useState()
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

  return <div>
    {(tempBubblePos && !bubblePositions[organInfo])
      ? <Bubble
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
        return <Bubble
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
