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
import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { scaleLinear } from 'd3-scale'
import { line as lineFactory, area as areaFactory } from 'd3-shape'
import { first, last, omit } from 'lodash'
import Color from 'color'

import sceneWrapper from 'rd/tools/scene'

import { H3 } from 'common/styles/UI/Text/titles'
import { grey, green, orange, darkGreen } from 'common/styles/colors'
import closePicto from 'common/assets/ico.deselect.20x20.svg'

import { useHoveredAngle, useSelectedAngle } from 'flow/interactions/accessors'

const Container = styled.div({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
})

const Title = styled(H3)({
  textTransform: 'initial',
  letterSpacing: 0
})

const Content = styled.div({
  width: '100%',
  height: '100%'
})

const TopPart = styled.div({
  width: '100%'
  // display: 'flex'
}, (props) => ({
  height: props.height
}))

const GraphPart = styled.div({
  display: 'flex'
})

const VerticalAxis = styled.div({
  position: 'relative',
  width: 37,
  height: '100%'
})
const VerticalTick = styled(H3)({
  position: 'absolute',
  width: 'auto',
  height: 1,
  borderRight: `12px solid ${grey}`,
  right: 0,
  paddingRight: 7,
  lineHeight: 0,
  margin: 0,
  marginRight: 5
}, (props) => ({
  top: props.top
}))

const HorizontalAxis = styled.div({
  position: 'relative',
  width: '100%',
  // paddingLeft: 37,
  height: 37
})
const HorizontalTick = styled(H3)({
  position: 'absolute',
  width: 1,
  height: 0,
  borderBottom: `12px solid ${grey}`,
  top: 0,
  paddingBottom: 12,
  lineHeight: 0,
  margin: 0,
  marginTop: 5,

  '& span': {
    display: 'block',
    width: 60,
    textAlign: 'center',
    marginLeft: -24
  }
}, (props) => ({
  left: props.left
}))
const GoalHorizontalTick = styled(HorizontalTick)({
  fontWeight: 700,
  borderTop: `0px`,
  marginTop: 5,
  color: darkGreen
})

const pointsOffset = 3
const SVG = styled.svg((props) => ({
  width: props.width,
  height: props.height + pointsOffset,
  marginLeft: -pointsOffset
}))

const Area = styled.path({
  fill: Color(green).alpha(0.1).toString()
})

const Line = styled.path({
  fill: 'none',
  strokeWidth: 1.5
},
(props) => ({
  stroke: props.orange ? orange : green
})
)

const Point = styled((props) => <circle {...omit(props, ['orange'])} r={3} />)(
  {
    stroke: 'white'
  },
  (props) => ({
    fill: props.orange ? orange : green
  })
)

const GoalLine = styled((props) => <line {...props} strokeDasharray='3 3' />)({
  stroke: darkGreen,
  opacity: 0.6
})

const InteractorContainer = styled.div({
  position: 'absolute',
  top: 37,
  left: 0
}, (props) => ({
  left: props.left,
  width: props.width,
  height: props.height
}))
const Interactor = styled.div({
  position: 'absolute',
  left: 0,
  width: '100%',
  marginLeft: 35,
  background: 'transparent',
  cursor: 'pointer'
}, (props) => {
  return {
    top: props.top,
    height: props.height,
    background: (props.selected || props.hovered)
      ? props.selected
        ? Color(green).rotate(30).lighten(1.1).alpha(0.7).toString()
        : Color(green).alpha(0.7).lighten(1.05).toString()
      : 'transparent',

    ...(
      props.selected
        ? {
          '&:hover:after': {
            transform: 'scale(1.10)',
            boxShadow: '0 1px 4px 0 rgba(10,61,33,0.15)'
          },

          '&:after': {
            position: 'absolute',
            top: 'calc(50% - 11px)',
            right: -10,
            display: 'block',
            content: '""',
            width: 20,
            height: 20,
            borderRadius: 20,
            background: 'white',
            backgroundImage: `url(${closePicto})`,
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 1px 0 rgba(10,61,33,0.15)'
          }
        }
        : {}
    )
  }
})

const HighlightedIndex = styled(H3)({
  position: 'absolute',
  width: 'auto',
  height: 1,
  borderRight: `12px solid ${green}`,
  right: 0,
  paddingRight: 7,
  lineHeight: 0,
  margin: 0,
  marginRight: 5,
  color: green,
  fontWeight: 700
}, (props) => ({
  top: props.top
}))

const HoveredPoint = styled.div({
  width: 10,
  height: 10,
  borderRadius: 10,
  background: green,
  pointerEvents: 'none',
  border: '1px solid white',
  position: 'absolute'
}, (props) => ({
  background: props.orange ? orange : green,
  top: props.top,
  left: props.left
}))

const horizontalScale = scaleLinear()
const verticalScale = scaleLinear()
const area = areaFactory()
  .x0((d) => pointsOffset)
  .x1((d) => d.x)
  .y((d) => d.y)
const line = lineFactory()
  .x((d) => d.x)
  .y((d) => d.y)

const Chart = sceneWrapper(({ valueTransformFn, ifManualData, data, unit, containerWidth, containerHeight }) => {
  const [hoveredAngle, setHoveredAngle] = useHoveredAngle()
  const [selectedAngle, setSelectedAngle] = useSelectedAngle()

  const goal = data.goal

  const vertiaclTickNb = Math.max(
    data.fruitPoints.length,
    data.automated.length,
    (data.manual ? data.manual.length : 0)
  )

  const verticalTicks = Array(Math.ceil(vertiaclTickNb / 5))
    .fill()
    .map((_, i) => (i * 5) - (i !== 0 ? 1 : 0))
    .filter((d) => (vertiaclTickNb - d) > 3)
    .concat(data.fruitPoints.length - 1)
    .concat(vertiaclTickNb)
  verticalScale
    .domain([first(verticalTicks), last(verticalTicks)])
    .rangeRound([containerHeight - 37, 0])

  const horizontalTicks = [
    0, Math.round(data.bounds[1])
  ]

  horizontalScale
    .domain([first(horizontalTicks), last(horizontalTicks)])
    .rangeRound([0, containerWidth - 37])

  const barHeight = Math.floor(containerHeight / vertiaclTickNb)

  const points = data.automated
    .map((rad, i) => {
      return {
        x: horizontalScale(valueTransformFn(rad)) + pointsOffset,
        y: verticalScale(i + 0.5)
      }
    })
  const manualPoints = (!ifManualData ? [] : data.manual)
    .map((rad, i) => {
      return {
        x: horizontalScale(valueTransformFn(rad)) + pointsOffset,
        y: verticalScale(i + 0.5)
      }
    })

  return <Content>
    <TopPart height={containerHeight - 37}>
      <HorizontalAxis>
        {
          horizontalTicks.map((index) => {
            return <HorizontalTick
              key={`horizontal-tick-${index}`}
              left={horizontalScale(index) + 34}
            >
              <span>
                {index} {unit}
              </span>
            </HorizontalTick>
          })
        }
        {
          goal && <GoalHorizontalTick
            key={'horizontal-tick-goal'}
            left={horizontalScale(goal) + 34}
          >
            <span>
              {goal} {unit}
            </span>

          </GoalHorizontalTick>
        }
      </HorizontalAxis>
      <GraphPart>
        <VerticalAxis>
          {
            verticalTicks.map((index) => {
              return <VerticalTick
                key={`vertical-tick-${index}`}
                top={verticalScale(index)}
              >
                {index + 1}
              </VerticalTick>
            })
          }
        </VerticalAxis>
        <SVG
          width={containerWidth - 37}
          height={containerHeight - 37}
        >
          <Area d={area(points)} />
          <g>
            <Line d={line(points)} />
            {
              points.map((d, index) => {
                return <Point
                  key={`point-${index}`}
                  cx={d.x}
                  cy={d.y}
                />
              })
            }
          </g>
          {
            ifManualData && <g>
              <Line d={line(manualPoints)} orange />
              {
                manualPoints.map((d, index) => {
                  return <Point
                    orange
                    key={`manual-point-${index}`}
                    cx={d.x}
                    cy={d.y}
                  />
                })
              }
            </g>
          }
          {
            goal && <GoalLine
              x1={horizontalScale(goal)}
              x2={horizontalScale(goal)}
              y1={0}
              y2={containerHeight - 37}
            />
          }
        </SVG>
      </GraphPart>
    </TopPart>
    <InteractorContainer
      width={containerWidth - 37}
      height={containerHeight - 37}
      onMouseLeave={() => setHoveredAngle(null)}
    >
      {
        points.map((d, i) => {
          return <Interactor
            key={`interactor-${i}`}
            top={d.y - (barHeight * 0.5)}
            height={barHeight}
            selected={selectedAngle === i}
            hovered={hoveredAngle === i}
            onMouseEnter={() => setHoveredAngle(i)}
            onClick={() => {
              selectedAngle === i ? setSelectedAngle(null) : setSelectedAngle(i)
            }}
          />
        })
      }
      {
        (hoveredAngle !== null && hoveredAngle !== undefined) && <div
          style={{
            position: 'absolute',
            width: 37,
            top: 0,
            left: 0
          }}
        >
          <HighlightedIndex
            top={verticalScale(hoveredAngle + 1)}
          >
            {hoveredAngle + 2}
          </HighlightedIndex>
          <HighlightedIndex
            top={verticalScale(hoveredAngle)}
          >
            {hoveredAngle + 1}
          </HighlightedIndex>
        </div>
      }
      {
        [selectedAngle, hoveredAngle]
          .filter((d) => d !== null && d !== undefined)
          .map((d, i) => {
            return <div
              key={`interacted-angle-${i}`}
            >
              <HoveredPoint
                key={'main'}
                top={verticalScale(d + 1) + (barHeight / 2) - 5}
                left={horizontalScale(
                  valueTransformFn(data.automated[d])
                ) + 37 - 5}
              />
              {
                ifManualData && <HoveredPoint
                  orange
                  key={'secondary'}
                  top={verticalScale(d + 1) + (barHeight / 2) - 5}
                  left={horizontalScale(
                    valueTransformFn(data.manual[d])
                  ) + 37 - 5}
                />
              }
            </div>
          })
      }
    </InteractorContainer>
  </Content>
})

export default function Graph ({ ifManualData, data, unit, valueTransformFn }) {
  return <Container>
    <Title>
      <FormattedMessage id='angles-axis-y' />
    </Title>

    <Chart
      ifManualData={ifManualData}
      valueTransformFn={valueTransformFn}
      data={data}
      unit={unit}
    />
  </Container>
}
