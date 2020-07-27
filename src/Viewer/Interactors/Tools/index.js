import React from 'react'
import { FormattedMessage } from 'react-intl'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { IconStateCatcher } from 'rd/UI/Icon'
import { H3 } from 'common/styles/UI/Text/titles'
import { Interactor } from 'Viewer/Interactors'

import t from 'prop-types'

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
    ruler: 6,
    snapshot: 7,
    photoSets: 8
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

ToolButton.propTypes = {
  /**
  * An array with 2 elements :
  * - An object with the field `activeTool`.
  * - A function to change this object.
  * In practice, this is the return value of an
  * accessor hook (see Redux)
  */
  toolsList: t.array,
  /**
  * An integer representing the tool.
  */
  tool: t.number,
  /**
  * A bool representing whether the layer this tool is in is activated or not.
  */
  layer: t.bool,
  /**
  * An object representing props to pass to the MenuBox component that is
  * rendered by the ToolButton
  */
  menuBox: t.object,
  /**
  * An object representing props to pass to the Interactor component
  * that is rendered by the ToolButton.
   */
  interactor: t.object,
  /**
  * The icon to display on the interactor.
  */
  icon: t.object,
  /**
  * The id of the text to display in the Tooltip (when hovering the ToolButton)
  */
  tooltipId: t.string
}
