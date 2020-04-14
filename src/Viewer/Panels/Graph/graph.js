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
import { grey, blue, red, darkGreen } from 'common/styles/colors'
import closePicto from 'common/assets/ico.deselect.20x20.svg'

import { useHoveredAngle, useSelectedAngle } from 'flow/interactions/accessors'

const Container = styled.div({
  position: 'relative',
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
})

const Title = styled(H3)({
  position: 'absolute',
  textTransform: 'initial',
  letterSpacing: 0,
  left: -20,
  top: 10
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
  right: -2,
  paddingRight: 5,
  lineHeight: 0,
  margin: 0,
  marginRight: 5,
  fontVariantNumeric: 'tabular-nums'
}, (props) => ({
  top: props.top
}))

const HorizontalAxis = styled.div({
  position: 'relative',
  width: '100%',
  // paddingLeft: 37,
  marginBottom: 13,
  height: 37
})
const HorizontalTick = styled(H3)({
  position: 'absolute',
  width: 1,
  height: 0,
  borderBottom: `8px solid ${grey}`,
  top: 0,
  paddingBottom: 12,
  lineHeight: 0,
  margin: 0,
  marginTop: 5,
  textTransform: 'lowercase',

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
  fill: Color(blue).alpha(0.1).toString()
})

const Line = styled.path({
  fill: 'none',
  strokeWidth: 1.5
},
(props) => ({
  stroke: props.red ? red : blue
})
)

const Point = styled((props) => <circle {...omit(props, ['red'])} r={3} />)(
  {
    stroke: 'white'
  },
  (props) => ({
    fill: props.red ? red : blue
  })
)

const GoalLine = styled((props) => <line {...props} strokeDasharray='3 3' />)({
  stroke: darkGreen,
  opacity: 0.6
})

const InteractorContainer = styled.div({
  position: 'absolute',
  top: 50,
  left: 2
}, (props) => ({
  left: props.left,
  width: props.width,
  height: props.height
}))
const Interactor = styled.div({
  position: 'absolute',
  left: 0,
  width: 'calc(100% + 15px)',
  marginLeft: 20,
  cursor: 'pointer',
  zIndex: 3
}, (props) => {
  return {
    top: props.top,
    height: props.height,
    background: (props.selected || props.hovered)
      ? props.hovered && props.selectedAngle
        ? Color('#84EEE6').alpha(0.7).toString()
        : Color('#78D89D').alpha(0.7).toString()
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
  width: 30,
  right: 12,
  paddingRight: 0,
  lineHeight: 0,
  margin: 0,
  marginRight: 5,
  color: blue,
  fontWeight: 700
  // fontVariantNumeric: 'tabular-nums'
}, (props) => ({
  top: props.top,
  color: props.color
}))

const HighlightedIndexContent = styled.div`
  display: block;
  position: absolute;
  width: auto;
  height: 18px;
  right: 5px;
  text-align: right;
  text-transform: capitalize;
  line-height: 12px;
  border-color: ${props => props.color};
`

const HighlightedIndexValue = styled.span({
  fontVariantNumeric: 'tabular-nums'
})

const HighlightedIndexContentTop = styled(HighlightedIndexContent)`
  border-bottom: 2px solid;
  height: 16px;
`
const HighlightedIndexContentBottom = styled(HighlightedIndexContent)`
  border-top: 2px solid;
  line-height: 14px;
`

const HoveredPoint = styled.div({
  width: 10,
  height: 10,
  borderRadius: 10,
  background: blue,
  pointerEvents: 'none',
  border: '1px solid white',
  position: 'absolute',
  zIndex: 3
}, (props) => ({
  background: props.red ? red : blue,
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

const isNotNullAndUndefiend = (v) => (v != null && v !== undefined)

const Chart = sceneWrapper(({ valueTransformFn, ifManualData, data, unit, containerWidth, containerHeight }) => {
  const [hoveredAngle, setHoveredAngle] = useHoveredAngle()
  const [selectedAngle, setSelectedAngle] = useSelectedAngle()
  const height = containerHeight - (37 * 1.6)

  console.log(containerHeight, height)

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
    // .concat(data.fruitPoints.length - 1)
    .concat(vertiaclTickNb - 1)
  verticalScale
    .domain([first(verticalTicks), last(verticalTicks)])
    .rangeRound([height, 5])

  const horizontalTicks = data.bounds

  horizontalScale
    .domain([first(horizontalTicks), last(horizontalTicks)])
    .rangeRound([0, containerWidth - 37])

  const barHeight = Math.floor(height / vertiaclTickNb)

  const points = data.automated
    .map((rad, i) => {
      return {
        datum: rad,
        x: horizontalScale(valueTransformFn(rad)) + pointsOffset,
        y: verticalScale(i)
      }
    })
  const manualPoints = (!ifManualData ? [] : data.manual)
    .map((rad, i) => {
      return {
        x: horizontalScale(valueTransformFn(rad)) + pointsOffset,
        y: verticalScale(i)
      }
    })

  const highligthed = [hoveredAngle, selectedAngle]
    .filter((d) => isNotNullAndUndefiend(d))
    .filter((d) => d < vertiaclTickNb)[0]

  return <Content>
    <TopPart height={containerHeight}>
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
          isNotNullAndUndefiend(goal) && <GoalHorizontalTick
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
          width={containerWidth - 37 + 5}
          height={height}
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
              <Line d={line(manualPoints)} red />
              {
                manualPoints.map((d, index) => {
                  return <Point
                    red
                    key={`manual-point-${index}`}
                    cx={d.x}
                    cy={d.y}
                  />
                })
              }
            </g>
          }
          {
            isNotNullAndUndefiend(goal) && <GoalLine
              x1={horizontalScale(goal)}
              x2={horizontalScale(goal)}
              y1={0}
              y2={height}
            />
          }
        </SVG>
      </GraphPart>
    </TopPart>
    <InteractorContainer
      width={containerWidth - 37}
      height={height}
      onMouseLeave={() => setHoveredAngle(null)}
    >
      {
        new Array(vertiaclTickNb)
          .fill()
          .map((_, i) => {
            const d = points[i] || manualPoints[i]
            return <Interactor
              key={`interactor-${i}`}
              top={d.y - (barHeight * 0.5)}
              height={barHeight}
              selectedAngle={isNotNullAndUndefiend(selectedAngle)}
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
        isNotNullAndUndefiend(highligthed) && <div
          style={{
            position: 'absolute',
            width: 72,
            height: 70,
            top: -6 + verticalScale(highligthed) - 20,
            paddingTop: 10,
            left: -40,
            background: 'rgba(255, 255, 255, 0.8)'
          }}
        >
          <HighlightedIndex
            top={3}
            color={
              (isNotNullAndUndefiend(selectedAngle) && isNotNullAndUndefiend(hoveredAngle))
                ? Color('#009BB0').toString()
                : darkGreen
            }
          >
            <HighlightedIndexContentTop>
              Org.<HighlightedIndexValue>
                {highligthed + 2}
              </HighlightedIndexValue>
              {/* {`Org.${highligthed + 2}`} */}
            </HighlightedIndexContentTop>
          </HighlightedIndex>

          <HighlightedIndex
            top={20}
            color={
              (isNotNullAndUndefiend(selectedAngle) && isNotNullAndUndefiend(hoveredAngle))
                ? Color('#84EEE6').toString()
                : Color('#78D89D').toString()
            }
          >
            <HighlightedIndexContent>
              <HighlightedIndexValue>
                {highligthed + 1}
              </HighlightedIndexValue>
              {/* {highligthed + 1} */}
            </HighlightedIndexContent>
          </HighlightedIndex>

          <HighlightedIndex
            top={20 + 20 - 7}
            color={
              (isNotNullAndUndefiend(selectedAngle) && isNotNullAndUndefiend(hoveredAngle))
                ? Color('#84EEE6').toString()
                : Color('#78D89D').toString()
            }
          >
            <HighlightedIndexContentBottom>
              Org.<HighlightedIndexValue>
                {highligthed + 1}
              </HighlightedIndexValue>
              {/* {`Org.${highligthed + 1}`} */}
            </HighlightedIndexContentBottom>
          </HighlightedIndex>
        </div>
      }
      {
        [selectedAngle, hoveredAngle]
          .filter((d) => isNotNullAndUndefiend(d))
          .map((d, i) => {
            return <div
              key={`interacted-angle-${i}`}
            >
              {
                (isNotNullAndUndefiend(data.automated[d])) && (
                  <HoveredPoint
                    key={'main'}
                    top={verticalScale(d + 1) + barHeight - 4}
                    left={horizontalScale(
                      valueTransformFn(data.automated[d])
                    ) + 37 - 7}
                  />
                )
              }
              {
                (ifManualData && isNotNullAndUndefiend(data.manual[d])) && (
                  <HoveredPoint
                    red
                    key={'secondary'}
                    top={verticalScale(d + 1) + barHeight - 4}
                    left={horizontalScale(
                      valueTransformFn(data.manual[d])
                    ) + 37 - 7}
                  />
                )
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
