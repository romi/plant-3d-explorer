import React from 'react'
import { FormattedMessage } from 'react-intl'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { IconStateCatcher } from 'rd/UI/Icon'
import { H3 } from 'common/styles/UI/Text/titles'
import { Interactor } from 'Viewer/Interactors'

export const tools = {
  colorPickers: {
    mesh: 0,
    pointCloud: 1,
    skeleton: 2,
    organs: 3,
    background: 4,
    segmentedPointCloud: 5
  },
  misc: {

    snapshot: 6,
    photoSets: 7
  }
}

/* A general component for displaying tools that can
  be popped up when clicked.
  The tool prop has to be a member of the tools "enum".

  At least the toolsList and tooltipId properties must be provided
*/
export default function ToolButton (props) {
  const [toolsList, setToolsList] = props.toolsList

  const closeTool = () => {
    if (toolsList.activeTool === props.tool) {
      setToolsList({ ...toolsList, activeTool: null })
    }
  }

  return <MenuBox
    activate={toolsList.activeTool === props.tool}
    callOnChange={closeTool}
    watchChange={[props.layer]}
    onClose={closeTool}
    {...props.menuBox}
  >
    <Tooltip>
      <Interactor
        activated={toolsList.activeTool === props.tool}
        onClick={
          () => {
            setToolsList({ ...toolsList,
              activeTool: toolsList.activeTool === props.tool
                ? null
                : props.tool
            })
          }
        }
        {...props.interactor}
      >
        <IconStateCatcher style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {props.icon}
        </IconStateCatcher>
      </Interactor>
      <TooltipContent>
        <H3>
          <FormattedMessage id={props.tooltipId} />
        </H3>
      </TooltipContent>
    </Tooltip>
    <MenuBoxContent style={{
      padding: 10
    }} >
      {props.children}
    </MenuBoxContent>
  </MenuBox>
}
