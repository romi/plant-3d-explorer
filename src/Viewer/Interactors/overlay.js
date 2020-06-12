import React from 'react'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { useOverlay } from 'flow/settings/accessors'

import useElementMouse from 'rd/tools/hooks/mouse'

function Bubble (props) {
  return <MenuBox
    style={{
      position: 'absolute',
      top: props.top,
      left: props.left,
      visibility: props.displayed
        ? 'visible' : 'hidden'
    }}
  >
    <MenuBoxContent>
      {props.children}
    </MenuBoxContent>
  </MenuBox>
}

export default function OverlayInteractors () {
  const [bubblePos, setBubblePos] = useOverlay()
  const mouse = useElementMouse() 

  return <div>
    <Bubble
      top={200}
      left={200}
      displayed
    />
  </div>
}