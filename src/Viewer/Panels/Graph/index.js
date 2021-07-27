/*

Plant 3D Explorer: An browser application for 3D scanned
plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/

import React from 'react'
import { first } from 'lodash'
import styled from '@emotion/styled'

import { lightGrey } from 'common/styles/colors'

import { useHoveredAngle, useSelectedAngle } from 'flow/interactions/accessors'

import Header from './header'
import Graph from './graph'

export const moduleWidth = 300

const Container = styled.div({
  padding: '30px 40px',
  paddingTop: 12,
  paddingBottom: 19,
  width: moduleWidth,
  height: '100%',
  flexShrink: 0,
  borderTop: `1px solid ${lightGrey}`,
  borderRight: `1px solid ${lightGrey}`,

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
})

export default function GraphPanel (props) {
  const [hoveredAngle] = useHoveredAngle()
  const [selectedAngle] = useSelectedAngle()

  const highlightedAngle = first([hoveredAngle, selectedAngle]
    .filter((value) => ((value !== null) && (value !== undefined))))

  if (!props.data.automated) return null

  const ifManualData = !!props.data.manual
  const ifHighligthed = highlightedAngle !== null && highlightedAngle !== undefined

  const valueTransformFn = (props.data.valueTransform || ((v) => v))

  return <Container>
    <Header
      id={props.id}
      tooltipId={props.tooltipId}
      onClose={props.onClose}
      ifManualData={ifManualData}
      ifHighligthed={ifHighligthed}
      ifGraph={props.ifGraph}
      data={props.data}
      automatedValue={
        ifHighligthed
          ? (props.data.automated[highlightedAngle] !== null && props.data.automated[highlightedAngle] !== undefined)
            ? valueTransformFn(props.data.automated[highlightedAngle]).toFixed(0) + ` ${props.data.unit}`
            : ''
          : ''
      }
      manualValue={
        !!props.data.manual && ifHighligthed
          ? (props.data.manual[highlightedAngle] !== null && props.data.manual[highlightedAngle] !== undefined)
            ? valueTransformFn(props.data.manual[highlightedAngle]).toFixed(0) + ` ${props.data.unit}`
            : ''
          : ''
      }
    />
    <Graph
      unit={props.data.unit}
      data={props.data}
      ifManualData={ifManualData}
      valueTransformFn={valueTransformFn}
    />
  </Container>
}
