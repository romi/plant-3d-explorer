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
 * Renders a graph panel displaying automated and optional manual data with
 * interactive highlighting and tooltips. The panel may be closed via a callback
 * and can be toggled to display complementary angles.
 *
 * @param {object} props - Component properties.
 * @param {string} props.id - Identifier for the panel header.
 * @param {string} props.tooltipId - Identifier used for tooltip reference.
 * @param {function} props.onClose - Callback invoked when the panel close button is pressed.
 * @param {boolean} props.ifGraph - Flag indicating whether the graph view should be shown.
 * @param {object} props.data - Data object containing chart information.
 * @param {Array<number|null|undefined>} props.data.automated - Array of automated values indexed by angle.
 * @param {Array<number|null|undefined>} [props.data.manual] - Optional array of manual values indexed by angle.
 * @param {string} props.data.unit - Unit string appended to displayed values.
 * @param {function(number): number} [props.data.valueTransform] - Optional function to transform raw data values before display.
 * @param {boolean} props.complementaryAngleChecked - Flag indicating if the complementary angle is currently selected.
 * @param {function(boolean): void} props.setComplementaryAngleChecked - Setter for toggling the complementary angle flag.
 *
 * @return {React.ReactElement|null} The rendered panel component or null if no automated data is available.
 */
export default function GraphPanel (props) {
  // Hook to get the angle currently hovered over
  const [hoveredAngle] = useHoveredAngle()
  // Hook to get the angle currently selected
  const [selectedAngle] = useSelectedAngle()

  // Determine the angle that should be highlighted (hovered or selected)
  const highlightedAngle = first([hoveredAngle, selectedAngle]
    .filter((value) => ((value !== null) && (value !== undefined))))

  // If there's no automated data, render nothing
  if (!props.data.automated || props.data.automated.length === 0) return null

  const ifManualData = !!props.data.manual
  // Flag indicating whether an angle is highlighted
  const ifHighligthed = highlightedAngle !== null && highlightedAngle !== undefined
  // Optional value transformation function; defaults to identity
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
      complementaryAngleChecked={props.complementaryAngleChecked}
      setComplementaryAngleChecked={props.setComplementaryAngleChecked}
    />
    <Graph
      unit={props.data.unit}
      data={props.data}
      ifManualData={ifManualData}
      valueTransformFn={valueTransformFn}
    />
  </Container>
}
