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

import React, { useMemo, useState } from 'react'
import styled from '@emotion/styled'
import { get } from 'lodash'
import { extent } from 'd3-array'

import { lightGrey, green, darkGreen } from 'common/styles/colors'

import { usePanels, useEvaluation } from 'flow/settings/accessors'
import { useScan } from 'flow/scans/accessors'
import { useColor } from 'flow/interactions/accessors'

import GraphPanel from './Graph'
import Header from './Graph/header'
// import { moduleWidth } from './Graph/header'

import { Bar } from 'react-chartjs-2'

const Container = styled.div(`
  display: flex;
  height: 100%;
  flex-shrink: 0;
  border-top: 1px solid ${lightGrey};

  display: flex;
  justify-content: space-between;
`)

const Button = styled.button(`
  background-color: ${green};
  color: white;
  font-size: 18px;
  padding: 4px 25px;
  border: 0px;
  margin: 0px 10px;
  margin-bottom: 15px;
  cursor: pointer;
  &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;
  }
`)

const ButtonToggle = styled(Button)`
  background-color: ${darkGreen};
  ${({ active }) =>
    active &&
    `
    background-color: ${green};
  `}
`
const ButtonGroup = styled.div`
  display: flex;
  margin-left: 115px;
`
const types = ['Precision', 'Recall', 'MIOU']

const radianToDegree = (v) => v * 57.2958
const valueToValue = (v) => v

export default function Panels () {
  const [scan] = useScan()
  const [panels, setPanels] = usePanels()
  const [evaluation, setEvaluation] = useEvaluation()
  const [active, setActive] = useState(types[0])
  const [colors] = useColor()

  function changeData (label) {
    let data = {
      labels: ['Leaf', 'Fruit', 'Flower',
        'Pedicel', 'Stem'],
      datasets: [
        {
          label: label,
          backgroundColor: [colors.segmentedPointCloud[0],
            colors.segmentedPointCloud[1],
            colors.segmentedPointCloud[2],
            colors.segmentedPointCloud[3],
            colors.segmentedPointCloud[4]],
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
          data: [get(scan, 'data.angles.leaf.' + label),
            get(scan, 'data.angles.fruit.' + label),
            get(scan, 'data.angles.flower.' + label),
            get(scan, 'data.angles.pedicel.' + label),
            get(scan, 'data.angles.stem.' + label)]
        }
      ]
    }
    return data
  }

  function setData (type) {
    setEvaluation({ ...evaluation, data: type.toLowerCase() })
    setActive(type)
  }

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
        isBarChart: false,
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
        isBarChart: false,
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
      },
      'panels-segmentation2D': {
        isBarChart: true,
        tooltipId: 'internodes-tooltip',
        automated: automatedAngles,
        data: changeData(evaluation.data)
      }
    }
  }, [scan])

  return <Container>
    {
      Object.keys(panels)
        .filter((d) => panels[d])
        .map((d) => {
          if (!panelsData[d].isBarChart) {
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
          } else {
            return <div style={{
              width: 500,
              height: 500,
              marginLeft: 20,
              marginRight: 20,
              marginTop: 14
            }}>
              <div style={{
                marginRight: 12,
                marginLeft: 178 // This is not the best solution but I couldn't find another working way to position the header to the right
              }}>
                <Header
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
              <ButtonGroup>
                {types.map(type => (
                  <ButtonToggle
                    key={type}
                    active={active === type}
                    onClick={() => setData(type)}
                  >
                    {type}
                  </ButtonToggle>
                ))}
              </ButtonGroup>
              <Bar
                data={changeData(evaluation.data)}
                height={350}
              />
            </div>
          }
        })
    }
  </Container>
}
