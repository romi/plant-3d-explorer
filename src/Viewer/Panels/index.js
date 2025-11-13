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

import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { get } from 'lodash'
import { extent } from 'd3-array'

import { lightGrey } from 'common/styles/colors'

import { usePanels } from 'flow/settings/accessors'
import { useScan, useScanFiles } from 'flow/scans/accessors'

import GraphPanel from './Graph'

import EvalGraph from './Graph/evaluationGraph'

// import { moduleWidth } from './Graph/header'

const Container = styled.div(`
  display: flex;
  height: 100%;
  flex-shrink: 0;
  border-top: 1px solid ${lightGrey};

  display: flex;
  justify-content: space-between;
`)

const radianToDegree = (v) => v * (180 / Math.PI)
const valueToValue = (v) => v

// Helper function to determine if angles are likely in radians and convert them to degrees
const convertAnglesToDegreesIfApplicable = (anglesArray) => {
  if (!anglesArray || anglesArray.length === 0) {
    return anglesArray
  }

  // Heuristic: If the maximum value is within the typical 0 to 2*PI range (and not a large degree value),
  // it's likely in radians. We add a small epsilon for floating point comparison.
  const maxAngle = Math.max(...anglesArray)
  const isLikelyRadians = maxAngle <= (2 * Math.PI) + 1e-6 && maxAngle > 1.0 // Also check if it's not just very small degrees

  if (isLikelyRadians) {
    return anglesArray.map(radianToDegree)
  }
  return anglesArray
}

export default function Panels () {
  const [scan] = useScan()
  const [panels, setPanels] = usePanels()
  const [complementaryAngleChecked, setComplementaryAngleChecked] = useState(false) // New state for checkbox

  // Call useScanFiles to get all fetched files
  const scanFiles = useScanFiles(scan)
  // Destructure the angles and internodes data from scanFiles[3]
  // useFetchObject returns [data, loading, error]
  const [anglesAndInternodesData, isLoadingAnglesAndInternodes, anglesAndInternodesError] = scanFiles[3] || [null, true, null]

  const panelsData = useMemo(() => {
    // If scan is not yet loaded, or angles and internodes data is loading or has an error, return an empty object
    if (!scan || isLoadingAnglesAndInternodes || anglesAndInternodesError) {
      if (anglesAndInternodesError) {
        console.error('Error loading angles and internodes data:', anglesAndInternodesError)
      } else if (isLoadingAnglesAndInternodes) {
        console.log('Angles and internodes data is still loading...')
      }
      return {}
    }

    // Now, use the fetched anglesAndInternodesData object
    const fruitPoints = get(anglesAndInternodesData, 'fruit_points')
    // ? tempFruitPoints.slice(0, tempFruitPoints.length - 1)
    // : undefined
    const tempAutomatedAngles = get(anglesAndInternodesData, 'angles')
    let automatedAngles = convertAnglesToDegreesIfApplicable(tempAutomatedAngles)
    // Apply complementary angle transformation if checkbox is checked
    if (complementaryAngleChecked) {
      automatedAngles = automatedAngles.map(angle => 360 - angle)
    }
    // ? tempAutomatedAngles.slice(0, tempAutomatedAngles.length - 1)
    // : undefined
    const automatedInternodes = get(anglesAndInternodesData, 'internodes')
    // ? tempAutomatedInternodes.slice(0, tempAutomatedInternodes.length - 1)
    // : undefined
    const internodes = [
      ...(get(anglesAndInternodesData, 'manual_internodes') || []),
      ...(automatedInternodes || [])
    ]
    const interNodesBounds = extent(internodes)

    // Handle cases where internodes might be empty, resulting in undefined bounds
    const lowerBound = (interNodesBounds[0] !== undefined) ? Math.floor(interNodesBounds[0] / 5) * 5 : 0
    const midBound = (interNodesBounds[0] !== undefined && interNodesBounds[1] !== undefined) ? Math.round(interNodesBounds[0] + interNodesBounds[1]) * 0.5 : 0
    const upperBound = (interNodesBounds[1] !== undefined) ? Math.ceil(interNodesBounds[1] / 5) * 5 : 0

    // Get manual angles and convert them to degrees if they appear to be in radians
    const manualAngles = convertAnglesToDegreesIfApplicable(get(anglesAndInternodesData, 'manual_angles'))

    return {
      'panels-angles': {
        isBarChart: false,
        tooltipId: 'angles-tooltip',
        automated: automatedAngles,
        manual: manualAngles,
        fruitPoints: fruitPoints,
        unit: '°',
        bounds: [0, 360],
        valueTransform: valueToValue,
        goal: 137.5,
        ifGraph: true
      },
      'panels-distances': {
        isBarChart: false,
        tooltipId: 'internodes-tooltip',
        automated: automatedInternodes,
        manual: get(anglesAndInternodesData, 'manual_internodes'),
        fruitPoints: fruitPoints,
        unit: 'mm',
        bounds: [
          lowerBound,
          midBound,
          upperBound
        ],
        valueTransform: valueToValue,
        ifGraph: true
      },
      'panels-evaluation': {
        isBarChart: true,
        tooltipId: 'evaluation-tooltip'
      }
    }
  }, [scan, anglesAndInternodesData, isLoadingAnglesAndInternodes, anglesAndInternodesError, complementaryAngleChecked]) // Add new dependencies

  return <Container>
    {
      Object.keys(panels)
        .filter((d) => panels[d])
        .map((d) => {
          // Ensure panelsData[d] exists before trying to render
          if (!panelsData[d]) {
            return null // Don't render if data for this panel is not ready
          }
          if (!panelsData[d].isBarChart) {
            return <GraphPanel
              key={d}
              id={d}
              tooltipId={panelsData[d].tooltipId}
              ifGraph={panelsData[d].ifGraph}
              data={panelsData[d]}
              complementaryAngleChecked={d === 'panels-angles' ? complementaryAngleChecked : undefined} // Pass only to angles panel
              setComplementaryAngleChecked={d === 'panels-angles' ? setComplementaryAngleChecked : undefined} // Pass only to angles panel
              onClose={() => {
                setPanels({
                  ...panels,
                  [d]: false
                })
              }}
            />
          } else {
            return <div>
              <EvalGraph
                id={d}
                ifGraph={false}
                tooltipId={panelsData[d].tooltipId}
                data={panelsData[d]}
                onClose={() => {
                  setPanels({
                    ...panels,
                    [d]: false
                  })
                }}
              />
            </div>
          }
        })
    }
  </Container>
}
