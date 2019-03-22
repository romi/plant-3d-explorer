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

const Container = styled.div({
  width: '100%',
  height: '100%',

  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
})

const Title = styled(H3)({
  textTransform: 'initial'
})

const Content = styled.div({
  width: '100%',
  height: '100%'
})

const TopPart = styled.div({
  width: '100%',
  display: 'flex'
}, (props) => ({
  height: props.height
}))

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
  paddingLeft: 37,
  height: 37
})
const HorizontalTick = styled(H3)({
  position: 'absolute',
  width: 1,
  height: 0,
  borderTop: `12px solid ${grey}`,
  top: 0,
  paddingTop: 12,
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
  marginTop: 0,
  color: darkGreen
})

const SVG = styled.svg((props) => ({
  width: props.width,
  height: props.height
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

const horizontalScale = scaleLinear()
const verticalScale = scaleLinear()
const area = areaFactory()
  .x0((d) => 0)
  .x1((d) => d.x)
  .y((d) => d.y)
const line = lineFactory()
  .x((d) => d.x)
  .y((d) => d.y)

const Chart = sceneWrapper(({ data, containerWidth, containerHeight }) => {
  const ifManualData = !!data.manualAngles

  const goal = 137.5

  const vertiaclTickNb = data.fruit_points.length
  const verticalTicks = Array(Math.ceil(vertiaclTickNb / 5))
    .fill()
    .map((_, i) => (i * 5) - (i !== 0 ? 1 : 0))
    .filter((d) => (data.fruit_points.length - d) > 3)
    .concat(data.fruit_points.length - 1)
  verticalScale
    .domain([first(verticalTicks), last(verticalTicks)])
    .range([containerHeight - 37, 0])

  const horizontalTickNb = 360
  const horizontalTicks = Array(Math.ceil(horizontalTickNb / 90))
    .fill()
    .map((_, i) => i * 90)
    .concat([horizontalTickNb])
  horizontalScale
    .domain([first(horizontalTicks), last(horizontalTicks)])
    .range([37, containerWidth])

  const points = data.angles
    .map((rad, i) => {
      return {
        x: horizontalScale(rad * 57.2958),
        y: verticalScale(i + 0.5)
      }
    })
  const manualPoints = (!ifManualData ? [] : data.manualAngles)
    .map((rad, i) => {
      return {
        x: horizontalScale((rad) * 57.2958),
        y: verticalScale(i + 0.5)
      }
    })

  return <Content>
    <TopPart height={containerHeight - 37}>
      <VerticalAxis>
        {
          verticalTicks.map((index) => {
            return <VerticalTick
              key={index}
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
            points.map((d, i) => {
              return <Point
                key={i}
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
              manualPoints.map((d, i) => {
                return <Point
                  orange
                  key={i}
                  cx={d.x}
                  cy={d.y}
                />
              })
            }
          </g>
        }
        <GoalLine
          x1={horizontalScale(goal) - 37}
          x2={horizontalScale(goal) - 37}
          y1={0}
          y2={containerHeight - 37}
        />
      </SVG>
    </TopPart>
    <HorizontalAxis>
      {
        horizontalTicks.map((index) => {
          return <HorizontalTick
            key={index}
            left={horizontalScale(index)}
          >
            <span>
              {index} °
            </span>
          </HorizontalTick>
        })
      }
      <GoalHorizontalTick
        key={'goal'}
        left={horizontalScale(goal)}
      >
        <span>
          {goal} °
        </span>

      </GoalHorizontalTick>
    </HorizontalAxis>
  </Content>
})

export default function Graph ({ data }) {
  return <Container>
    <Title>
      <FormattedMessage id='angles-axis-y' />
    </Title>

    <Chart data={data} />
  </Container>
}
