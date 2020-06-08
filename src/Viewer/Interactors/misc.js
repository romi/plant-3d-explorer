import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { CirclePicker } from 'react-color'

import { useSelectedAngle, useColor, useDefaultColors } from 'flow/interactions/accessors'
import { useMisc, useLayers } from 'flow/settings/accessors'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import { IconStateCatcher } from 'rd/UI/Icon'
import { PaintIcon } from 'Viewer/Interactors/icons'
import { ResetButton } from 'rd/UI/Buttons'

import { H3 } from 'common/styles/UI/Text/titles'

import { Interactor } from './index'

// This enum can be exported later if need be
const tools = {
  colorPickers: {
    mesh: 0,
    pointCloud: 1,
    skeleton: 2,
    organs: 3
  }
}

export const Container = styled.div({
  position: 'absolute',
  top: 60,
  left: 20,
  display: 'flex',

  '& :first-of-type > div': {
    borderRadius: '2px 0 0 2px'
  },

  '& :last-of-type > div': {
    borderRadius: '0 2px 2px 0'
  }
})

const ColumnContainer = styled.div({
}, (props) => {
  return {
    display: 'flex',
    visibility: props.displayed
      ? 'visible'
      : 'hidden',
    flexDirection: 'column',
    marginLeft: 0,
    marginRight: 0
  }
})

const MiscContainer = styled(Container)({
})

/* A general component for displaying tools that can
  be popped up when clicked.
  The tool prop has to be a member of the tools "enum".
*/
function ToolButton (props) {
  const [misc, setMisc] = useMisc()

  const closeTool = () => {
    if (misc.activeTool === props.tool) {
      setMisc({ ...misc, activeTool: null })
    }
  }

  return <MenuBox
    activate={misc.activeTool === props.tool}
    callOnChange={closeTool}
    watchChange={[props.layer]}
    onClose={closeTool}
    {...props.menuBox}
  >
    <Tooltip>
      <Interactor
        activated={misc.activeTool === props.tool}
        onClick={
          () => {
            setMisc({ ...misc,
              activeTool: misc.activeTool === props.tool
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

export default function MiscInteractors () {
  const [selectedAngle] = useSelectedAngle()
  const [colors, setColors] = useColor()
  const [resetDefaultColor] = useDefaultColors()
  const [misc] = useMisc()
  const [layers] = useLayers()

  return <MiscContainer>
    <ColumnContainer displayed={layers.mesh}>
      <ToolButton
        tool={tools.colorPickers.mesh}
        layer={layers.mesh}
        interactor={{
          isButton: true
        }}
        tooltipId='tooltip-mesh-color-picker'
        icon={<PaintIcon isActivated={misc.activeTool ===
          tools.colorPickers.mesh} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              setColors({
                ...colors,
                mesh: color.hex
              })
            }
          }
          color={colors.mesh}
        />
        <ResetButton
          onClick={
            () => {
              resetDefaultColor('mesh')
            }
          }
        />
      </ToolButton>
    </ColumnContainer>
    <ColumnContainer displayed={layers.pointCloud}>
      <ToolButton
        tool={tools.colorPickers.pointCloud}
        layer={layers.pointCloud}
        interactor={{
          isButton: true
        }}
        tooltipId={'tooltip-point-cloud-color-picker'}
        icon={<PaintIcon isActivated={misc.activeTool ===
        tools.colorPickers.pointCloud} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              setColors({
                ...colors,
                pointCloud: color.hex
              })
            }
          }
          color={colors.pointCloud}
        />
        <ResetButton
          onClick={
            () => {
              resetDefaultColor('pointCloud')
            }
          }
        />
      </ToolButton>
    </ColumnContainer>
    <ColumnContainer displayed={layers.skeleton}>
      <ToolButton
        tool={tools.colorPickers.skeleton}
        layer={layers.skeleton}
        interactor={{
          isButton: true
        }}
        tooltipId={'tooltip-skeleton-color-picker'}
        icon={<PaintIcon isActivated={misc.activeTool ===
          tools.colorPickers.skeleton} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              setColors({
                ...colors,
                skeleton: color.hex
              })
            }
          }
          color={colors.skeleton}
        />
        <ResetButton
          onClick={
            () => {
              resetDefaultColor('skeleton')
            }
          }
        />
      </ToolButton>
    </ColumnContainer>
    <ColumnContainer displayed={layers.angles}>
      <ToolButton
        tool={tools.colorPickers.organs}
        layer={layers.angles}
        interactor={{
          isButton: true
        }}
        tooltipId={(selectedAngle === undefined || selectedAngle === null)
          ? 'tooltip-organ-global-color-picker'
          : 'tooltip-organ-color-picker'
        }
        icon={<PaintIcon isActivated={misc.activeTool ===
          tools.colorPickers.organs} />}
      >
        <CirclePicker
          onChange={
            (color) => {
              let color2 = color.hsl
              // Use a lighter color for the second organ of the pair
              color2.l += 0.3
              /* This is a bit ugly but very useful to change the brightness of
               the color */
              const color2String = 'hsl(' + Math.round(color2.h) + ', ' +
                color2.s.toFixed(2) * 100 + '%, ' + color2.l.toFixed(2) * 100 +
                '%)'
              if (selectedAngle !== undefined && selectedAngle !== null) {
                // We slice the array because it has to be an immutable change
                let copy = colors.organs.slice()
                const next = selectedAngle + 1
                copy[selectedAngle] = color.hex
                copy[next] = color2String
                setColors({
                  ...colors,
                  organs: copy
                })
              } else {
                setColors({
                  ...colors,
                  globalOrganColors: [color.hex, color2String]
                })
              }
            }
          }
          color={(selectedAngle !== undefined && selectedAngle !== null)
            ? colors.organs[selectedAngle]
            : colors.globalOrganColors[0]}
        />
        <ResetButton
          onClick={
            () => {
              resetDefaultColor('globalOrganColors')
              resetDefaultColor('organs')
            }
          }
        />
      </ToolButton>
    </ColumnContainer>
  </MiscContainer>
}
