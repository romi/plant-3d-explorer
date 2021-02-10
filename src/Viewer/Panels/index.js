/*

Romi 3D PlantViewer: An browser application for 3D scanned
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

import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { get } from 'lodash'
import { extent } from 'd3-array'

import { lightGrey } from 'common/styles/colors'

import { usePanels } from 'flow/settings/accessors'
import { useScan } from 'flow/scans/accessors'

import GraphPanel from './Graph'

const Container = styled.div(`
  display: flex;
  height: 100%;
  flex-shrink: 0;
  border-top: 1px solid ${lightGrey};

  display: flex;
  justify-content: space-between;
`)

const radianToDegree = (v) => v * 57.2958
const valueToValue = (v) => v

export default function Panels () {
  const [scan] = useScan()
  const [panels, setPanels] = usePanels()

  const panelsData = useMemo(() => {
    const tempFruitPoints = get(scan, 'data.angles.fruit_points')
    const fruitPoints = tempFruitPoints
    // ? tempFruitPoints.slice(0, tempFruitPoints.length - 1)
    // : undefined
    const tempAutomatedAngles = get(scan, 'data.angles.angles')
    const automatedAngles = tempAutomatedAngles
    // ? tempAutomatedAngles.slice(0, tempAutomatedAngles.length - 1)
    // : undefined

    const tempAutomatedInternodes = get(scan, 'data.angles.internodes')
    const automatedInternodes = tempAutomatedInternodes
    // ? tempAutomatedInternodes.slice(0, tempAutomatedInternodes.length - 1)
    // : undefined
    const internodes = [
      ...(get(scan, 'data.angles.measured_internodes') || []),
      ...(get(scan, 'data.angles.internodes') || [])
    ]
    const interNodesBounds = extent(internodes)

    return {
      'panels-angles': {
        tooltipId: 'angles-tooltip',
        automated: automatedAngles,
        manual: get(scan, 'data.angles.measured_angles'),
        fruitPoints: fruitPoints,
        unit: '°',
        bounds: [0, 360],
        valueTransform: radianToDegree,
        goal: 137.5
      },
      'panels-distances': {
        tooltipId: 'internodes-tooltip',
        automated: automatedInternodes,
        manual: get(scan, 'data.angles.measured_internodes'),
        fruitPoints: fruitPoints,
        unit: 'mm',
        bounds: [
          Math.floor(interNodesBounds[0] / 5) * 5,
          Math.round(interNodesBounds[0] + interNodesBounds[1]) * 0.5,
          Math.ceil(interNodesBounds[1] / 5) * 5
        ],
        valueTransform: valueToValue
      }
    }
  }, [scan])

  return <Container>
    {
      Object.keys(panels)
        .filter((d) => panels[d])
        .map((d) => {
          return <GraphPanel
            key={d}
            id={d}
            tooltipId={panelsData[d].tooltipId}
            data={panelsData[d]}
            onClose={() => {
              setPanels({
                ...panels,
                [d]: false
              })
            }}
          />
        })
    }
  </Container>
}
