/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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

  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
})

/**
 * Renders a panel that displays a header and a graph based on the provided data and interaction state.
 *
 * @param {Object} props - The component props.
 * @param {string} props.id - Identifier passed to the {@link Header} component.
 * @param {string} props.tooltipId - Identifier used for tooltip functionality.
 * @param {Function} props.onClose - Callback executed when the header close action is triggered.
 * @param {Object} props.data - Data object containing arrays of values and metadata.
 * @param {Array<number|null|undefined>} props.data.automated - Array of automated values indexed by angle.
 * @param {Array<number|null|undefined>|undefined} props.data.manual - Optional array of manual values indexed by angle.
 * @param {string} props.data.unit - Unit string appended to the displayed values.
 * @param {Function} [props.data.valueTransform] - Optional function to transform raw numeric values before display.
 * @param {boolean} props.ifGraph - Flag indicating whether the graph should be rendered in graph mode.
 * @returns {JSX.Element|null} The rendered panel containing a header and graph, or `null` when no automated data is available.
 */
export default function GraphPanel (props) {
  const [hoveredAngle] = useHoveredAngle() // current hovered angle
  const [selectedAngle] = useSelectedAngle() // currently selected angle

  const highlightedAngle = first([hoveredAngle, selectedAngle]
    .filter((value) => ((value !== null) && (value !== undefined)))) // angle that is either hovered or selected

  if (!props.data.automated || props.data.automated.length === 0) return null

  const ifManualData = !!props.data.manual
  const ifHighligthed = highlightedAngle !== null && highlightedAngle !== undefined

  const valueTransformFn = (props.data.valueTransform || ((v) => v)) // optional value transform function

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
      complementaryAngleChecked={props.complementaryAngleChecked} // Pass new prop to Header
      setComplementaryAngleChecked={props.setComplementaryAngleChecked} // Pass new prop to Header
    />
    <Graph
      unit={props.data.unit}
      data={props.data}
      ifManualData={ifManualData}
      valueTransformFn={valueTransformFn}
    />
  </Container>
}
