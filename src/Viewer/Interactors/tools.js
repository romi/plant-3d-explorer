import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { SketchPicker } from 'react-color'
import { FormattedMessage } from 'react-intl'

import { useSelectedAngle, useColor, useDefaultColors, usePointCloudZoom, usePointCloudSize } from 'flow/interactions/accessors'
import { useLayerTools, useLayers } from 'flow/settings/accessors'
import { useSegmentedPointCloud } from 'flow/scans/accessors'

import { PaintIcon } from 'Viewer/Interactors/icons'
import { ResetButton } from 'rd/UI/Buttons'
import { H3 } from 'common/styles/UI/Text/titles'
import ToolButton, { tools } from 'Viewer/Interactors/Tools'
import MenuBox, { MenuBoxContent } from 'rd/UI/MenuBox'
import Slider from 'rd/UI/Slider'

const hex2RGB = (hex) => {
  return { r: parseInt(hex[1] + hex[2], 16),
    g: parseInt(hex[3] + hex[4], 16),
    b: parseInt(hex[5] + hex[6], 16) }
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

// Setting the default color values to make sure every component has a base color value in addition to the one given in their file
let defaults = {
  defaultOrgan1Color: '#BD10E0',
  defaultOrgan2Color: '#E79DF6',
  defaultOrganOpacity: '0.5',
  defaultMeshColor: '#96c0a7',
  defaultMeshOpacity: '0.5',
  defaultPointCloudColor: '#f8de96',
  defaultPointCloudOpacity: '1',
  defaultPointCloudSize : '1000',
  defaultSkeletonColor: '#D0021B',
  defaultSkeletonOpacity: '0.7'
}

// for (let key in defaults) {
//   if (!window.localStorage.getItem(key)) {
//     window.localStorage.setItem(key, defaults[key])
//   }
// }

export default function MiscInteractors () {
  const [selectedAngle] = useSelectedAngle()
  const [colors, setColors] = useColor()
  const [resetDefaultColor] = useDefaultColors()
  const [layerTools] = useLayerTools()
  const [layers] = useLayers()
  const [labels, setLabels] = useState()
  const [, segmentation] = useSegmentedPointCloud()
  const [legendPicker, setLegendPicker] = useState()
  const [pointCloudZoom, setPointCloudZoom] = usePointCloudZoom()
  const [pointCloudSize, setPointCloudSize] = usePointCloudSize()

  return null;
}
