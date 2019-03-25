import React from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { scaleLinear } from 'd3-scale'
import { line as lineFactory, area as areaFactory } from 'd3-shape'
import { first, last, omit, filter } from 'lodash'
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

const InteractorContainer = styled.div({
  position: 'absolute',
  top: 0,
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
    background: props.selected || props.hovered
      ? Color(green).alpha(0.7).toString()
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
  .x0((d) => 0)
  .x1((d) => d.x)
  .y((d) => d.y)
const line = lineFactory()
  .x((d) => d.x)
  .y((d) => d.y)

const Chart = sceneWrapper(({ data, containerWidth, containerHeight }) => {
  const [hoveredAngle, setHoveredAngle] = useHoveredAngle()
  const [selectedAngle, setSelectedAngle] = useSelectedAngle()

  const ifManualData = !!data.measured_angles

  const goal = 137.5

  const vertiaclTickNb = data.fruit_points.length
  const verticalTicks = Array(Math.ceil(vertiaclTickNb / 5))
    .fill()
    .map((_, i) => (i * 5) - (i !== 0 ? 1 : 0))
    .filter((d) => (data.fruit_points.length - d) > 3)
    .concat(data.fruit_points.length - 1)
  verticalScale
    .domain([first(verticalTicks), last(verticalTicks)])
    .rangeRound([containerHeight - 37, 0])

  const horizontalTickNb = 360
  const horizontalTicks = Array(Math.ceil(horizontalTickNb / 90))
    .fill()
    .map((_, i) => i * 90)
    .concat([horizontalTickNb])
  horizontalScale
    .domain([first(horizontalTicks), last(horizontalTicks)])
    .rangeRound([0, containerWidth - 37])

  const barHeight = Math.floor(containerHeight / data.angles.length)
  const points = data.angles
    .map((rad, i) => {
      return {
        x: horizontalScale(rad * 57.2958),
        y: verticalScale(i + 0.5)
      }
    })
  const manualPoints = (!ifManualData ? [] : data.measured_angles)
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
          x1={horizontalScale(goal)}
          x2={horizontalScale(goal)}
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
            left={horizontalScale(index) + 37}
          >
            <span>
              {index} °
            </span>
          </HorizontalTick>
        })
      }
      <GoalHorizontalTick
        key={'goal'}
        left={horizontalScale(goal) + 37}
      >
        <span>
          {goal} °
        </span>

      </GoalHorizontalTick>
    </HorizontalAxis>
    <InteractorContainer
      width={containerWidth - 37}
      height={containerHeight - 37}
      onMouseLeave={() => setHoveredAngle(null)}
    >
      {
        points.map((d, i) => {
          return <Interactor key={i}
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
        filter([selectedAngle, hoveredAngle])
          .map((d, i) => {
            return <div key={i}>
              <HoveredPoint
                key={'main'}
                top={verticalScale(d + 1) + (barHeight / 2) - 5}
                left={horizontalScale(data.angles[d] * 57.2958) + 37 - 5}
              />
              {
                ifManualData && <HoveredPoint
                  orange
                  key={'secondary'}
                  top={verticalScale(d + 1) + (barHeight / 2) - 5}
                  left={horizontalScale(data.measured_angles[d] * 57.2958) + 37 - 5}
                />
              }
            </div>
          })
      }
    </InteractorContainer>
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
