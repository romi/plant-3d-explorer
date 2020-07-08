import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { SketchPicker } from 'react-color'

import { useSelectedAngle, useColor, useDefaultColors } from 'flow/interactions/accessors'
import { useLayerTools, useLayers } from 'flow/settings/accessors'
import { useSegmentedPointCloud } from 'flow/scans/accessors'

import { PaintIcon } from 'Viewer/Interactors/icons'
import { ResetButton } from 'rd/UI/Buttons'
import { H3 } from 'common/styles/UI/Text/titles'
import ToolButton, { tools } from 'Viewer/Interactors/Tools'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'

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

const LegendContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
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
  const [labels, setLabels] = useState()
  const [, segmentation] = useSegmentedPointCloud()
  const [legendPicker, setLegendPicker] = useState()

  useEffect(
    () => {
      if (segmentation && segmentation.labels) {
        setLabels(segmentation.labels.filter(
          (value, index, self) => self.indexOf(value) === index
        ))
      }
    }, [segmentation]
  )

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
              if (color.hex === 'transparent') return
              setColors({
                ...colors,
                mesh: { rgb: color.hex, a: color.rgb.a }
              })
            }
          }
          color={colors.mesh.rgb +
          Math.round((colors.mesh.a * 0xff)).toString(16)}

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
              if (color.hex === 'transparent') return
              setColors({
                ...colors,
                pointCloud: { rgb: color.hex, a: color.rgb.a }
              })
            }
          }
          color={colors.pointCloud.rgb +
            Math.round(colors.pointCloud.a * 0xff).toString(16)}
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
    <ColumnContainer displayed={layers.segmentedPointCloud}>
      <ToolButton
        toolsList={useLayerTools()}
        tool={tools.colorPickers.segmentedPointCloud}
        layer={layers.segmentedPointCloud}
        Interactor={{
          isButton: true
        }}
        tooltipId={'tooltip-segmentedpointcloud-color-picker'}
        icon={<PaintIcon isActivated={layerTools.activeTool ===
          tools.colorPickers.segmentedPointCloud} />}
      >
        { labels && colors.segmentedPointCloud.length
          ? labels.map((d, i) => {
            return <LegendContainer key={d}>
              <H3 style={{ fontSize: 13 }}> {d} </H3>
              <MenuBox
                activate={legendPicker === i}
                onClose={() => { setLegendPicker(null) }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 10,
                    backgroundColor: colors.segmentedPointCloud[i],
                    cursor: 'pointer'
                  }}
                  onClick={() => { setLegendPicker(i) }}
                />
                <MenuBoxContent>
                  <SketchPicker disableAlpha
                    onChange={(val) => {
                      let copy = colors.segmentedPointCloud.slice()
                      copy[i] = val.hex
                      setColors({ ...colors, segmentedPointCloud: copy })
                    }}
                    color={colors.segmentedPointCloud[i]}
                  />
                </MenuBoxContent>
              </MenuBox>
            </LegendContainer>
          })
          : null
        }
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
              if (color.hex === 'transparent') return
              setColors({
                ...colors,
                skeleton: { rgb: color.hex, a: color.rgb.a }
              })
            }
          }
          color={colors.skeleton.rgb +
            Math.round(colors.skeleton.a * 0xff).toString(16)}
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
              if (color.hex === 'transparent') return
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
                copy[selectedAngle] = { rgb: color.hex, a: color.rgb.a }
                copy[next] = { rgb: color2String, a: color.rgb.a }
                setColors({
                  ...colors,
                  organs: copy
                })
              } else {
                setColors({
                  ...colors,
                  globalOrganColors: [
                    { rgb: color.hex, a: color.rgb.a },
                    { rgb: color2String, a: color.rgb.a }
                  ]
                })
              }
            }
          }
          color={(selectedAngle !== undefined && selectedAngle !== null &&
            colors.organs[selectedAngle])
            ? colors.organs[selectedAngle].rgb +
              Math.round(colors.organs[selectedAngle].a * 0xff).toString(16)
            : colors.globalOrganColors[0].rgb +
              Math.round(colors.globalOrganColors[0].a * 0xff).toString(16)}
        />
        <ResetButton
          onClick={
            () => {
              if (selectedAngle !== undefined && selectedAngle !== null) {
                if (colors.organs.length > selectedAngle + 1) {
                  let copy = colors.organs.slice()
                  copy[selectedAngle] = null
                  copy[selectedAngle + 1] = null
                  setColors({
                    ...colors,
                    organs: copy
                  })
                }
              } else {
                resetDefaultColor('globalOrganColors')
              }
            }
          }
        />
      </ToolButton>
    </ColumnContainer>
  </ToolContainer>
}
