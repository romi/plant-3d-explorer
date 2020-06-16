import React, { useEffect, useState } from 'react'

import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { useOrganInfo, useColor } from 'flow/interactions/accessors'

import { H2 } from 'common/styles/UI/Text/titles'
import useMouse from 'rd/tools/hooks/mouse'

function Bubble (props) {
  const [colors] = useColor()
  const bubbleColor = colors.organs.length >= props.organInfo &&
    colors.organs[props.organInfo - 1]
    ? colors.organs[props.organInfo - 1]
    : colors.globalOrganColors[props.organInfo % 2 ? 0 : 1]
  return <div
    style={{
      position: 'fixed',
      top: props.initialPos.y,
      left: props.initialPos.x,
      zIndex: 2000
    }}>
    <MenuBox
      activate
      {...props.menuBox}
    >
      <MenuBoxContent style={{
        backgroundColor: bubbleColor + '30' // Added for opacity on background
        // only
      }}
      >
        <div
        >
          {/* } Organ info can then be fetched from anywhere,
        for the moment it only prints the organ number for testing purposes
      { */}
          <H2> Organ {props.organInfo} </H2>
        </div>
      </MenuBoxContent>
    </MenuBox>
  </div>
}

export default function OverlayInteractors () {
  const [currentBubblePos, setCurrentBubblePos] = useState(null)
  const [organInfo, setOrganInfo] = useOrganInfo()
  const mouse = useMouse()

  useEffect(
    () => {
      if (organInfo) setCurrentBubblePos(mouse)
      else setCurrentBubblePos(null)
    },
    [organInfo]
  )

  return <div>
    { currentBubblePos
      ? <Bubble
        initialPos={currentBubblePos}
        organInfo={organInfo}
        menuBox={{
          onClose: () => {
            setCurrentBubblePos(null)
            setOrganInfo(null)
          }
        }}
      />
      : null
    }
  </div>
}
