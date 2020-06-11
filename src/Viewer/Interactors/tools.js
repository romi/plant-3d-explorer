import React from 'react'
import styled from '@emotion/styled'
import { SketchPicker } from 'react-color'

import { useSelectedAngle, useColor, useDefaultColors } from 'flow/interactions/accessors'
import { useLayerTools, useLayers } from 'flow/settings/accessors'

import { PaintIcon } from 'Viewer/Interactors/icons'
import { ResetButton } from 'rd/UI/Buttons'
import ToolButton, { tools } from 'Viewer/Interactors/Tools'

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

const ToolContainer = styled(Container)({
})

export default function MiscInteractors () {
  const [selectedAngle] = useSelectedAngle()
  const [colors, setColors] = useColor()
  const [resetDefaultColor] = useDefaultColors()
  const [layerTools] = useLayerTools()
  const [layers] = useLayers()

  return <ToolContainer>
    <ColumnContainer displayed={layers.mesh}>
      <ToolButton
        toolsList={useLayerTools()}
        tool={tools.colorPickers.mesh}
        layer={layers.mesh}
        interactor={{
          isButton: true
        }}
        tooltipId='tooltip-mesh-color-picker'
        icon={<PaintIcon isActivated={layerTools.activeTool ===
          tools.colorPickers.mesh} />}
      >
        <SketchPicker
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
        toolsList={useLayerTools()}
        tool={tools.colorPickers.pointCloud}
        layer={layers.pointCloud}
        interactor={{
          isButton: true
        }}
        tooltipId={'tooltip-point-cloud-color-picker'}
        icon={<PaintIcon isActivated={layerTools.activeTool ===
        tools.colorPickers.pointCloud} />}
      >
        <SketchPicker
          onChange={
            (color) => {
              console.log(color)
              setColors({
                ...colors,
                pointCloud: color.rgb
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
        toolsList={useLayerTools()}
        tool={tools.colorPickers.skeleton}
        layer={layers.skeleton}
        interactor={{
          isButton: true
        }}
        tooltipId={'tooltip-skeleton-color-picker'}
        icon={<PaintIcon isActivated={layerTools.activeTool ===
          tools.colorPickers.skeleton} />}
      >
        <SketchPicker
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
        toolsList={useLayerTools()}
        tool={tools.colorPickers.organs}
        layer={layers.angles}
        interactor={{
          isButton: true
        }}
        tooltipId={(selectedAngle === undefined || selectedAngle === null)
          ? 'tooltip-organ-global-color-picker'
          : 'tooltip-organ-color-picker'
        }
        icon={<PaintIcon isActivated={layerTools.activeTool ===
          tools.colorPickers.organs} />}
      >
        <SketchPicker
          onChange={
            (color) => {
              let color2 = color.hsl
              // Use a lighter color for the second organ of the pair
              color2.l += 0.3
              /* This is a bit ugly but very useful to change the brightness of
               the color */
              const color2String = 'hsl(' + Math.round(color2.h) + ', ' +
                Math.round(color2.s * 100) + '%, ' +
                Math.round(color2.l * 100) + '%)'
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
  </ToolContainer>
}
