import React, { useState } from 'react'
import styled from '@emotion/styled'
import { get } from 'lodash'
import pattern from 'patternomaly'
import { FormattedMessage } from 'react-intl'

import { green, darkGreen } from 'common/styles/colors'

import { useEvaluation } from 'flow/settings/accessors'
import { useScan } from 'flow/scans/accessors'
import { useColor, useLabels, useSelectedcamera } from 'flow/interactions/accessors'

import Select from 'react-select'

import Header from './header'

import BarPlot from './barplot'
import BoxPlot from './boxplot'

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
  float: right;
`
const data = ['Precision', 'Recall', 'MIOU']

const types = ['Bar Plot', 'Box Plot']

export default function EvalGraphs (props) {
  const [evaluation, setEvaluation] = useEvaluation()
  const [selected] = useSelectedcamera()
  const [activeData, setActiveData] = useState(data[0])
  const [active, setActive] = useState(types[0])
  const [scan] = useScan()
  const [colors] = useColor()
  const [labels] = useLabels()
  const cameraPoses = ((scan && scan.camera.poses) || [])

  let backgroundColor = []
  let barLabels = []

  for (let i = 0; i < labels.length; i++) {
    backgroundColor.push(colors.segmentedPointCloud[i])
    barLabels.push(labels[i])
  }

  function barPlotData (value) {
    let data
    let barData = []
    switch (evaluation.activeEvaluation) {
      case 'segmentation2D':
        for (let i = 0; i < labels.length; i++) {
          barData.push(get(scan, 'data.segmentation2D.' + labels[i] + '.' + value))
        }
        data = {
          labels: barLabels,
          datasets: [
            {
              type: 'bar',
              label: value,
              backgroundColor: backgroundColor,
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 1,
              data: barData
            }
          ]
        }
        break
      case 'segmentedPC':
        let barData2 = []
        let barDataAverage = []
        let customBarColor = []
        let customBarColor2 = []
        for (let i = 0; i < labels.length; i++) {
          barData.push(get(scan, 'data.segmentedPcdEvaluation.groundtruth-to-prediction.' + labels[i] + '.' + value))
          barData2.push(get(scan, 'data.segmentedPcdEvaluation.prediction-to-groundtruth.' + labels[i] + '.' + value))
          barDataAverage.push((barData[i] + barData2[i]) / 2)
          customBarColor.push(pattern.draw('diagonal', backgroundColor[i] + 'CC'))
          customBarColor2.push(pattern.draw('dot', backgroundColor[i] + '99'))
        }
        data = {
          labels: barLabels,
          datasets: [
            {
              type: 'bar',
              label: 'Groundtruth-to-prediction',
              backgroundColor: backgroundColor,
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 1,
              data: barData
            },
            {
              type: 'bar',
              label: 'Prediction-to-groundtruth',
              backgroundColor: customBarColor,
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 1,
              data: barData2
            },
            {
              type: 'bar',
              label: 'Average',
              backgroundColor: customBarColor2,
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 1,
              data: barDataAverage
            }
          ]
        }
        break
      default:
        break
    }
    return data
  }

  function boxPlotData (value) {
    let pointsData = []
    let headers = []
    for (let j = 0; j < labels.length * cameraPoses.length; j++) {
      pointsData[j] = []
      headers[j] = []
    }
    let singleData = []
    let boxData = []
    let singlePoints
    let label // number of the selected image
    let test // used to get the complete image number
    for (let i = 0; i < labels.length; i++) {
      for (let j = 0; j < cameraPoses.length; j++) {
        pointsData[(i * cameraPoses.length) + j].push(i)
        pointsData[(i * cameraPoses.length) + j].push(get(scan, 'data.segmentation2D.evaluation-results.0' + j + '_' + labels[i] + '.' + value))
        headers[(i * cameraPoses.length) + j].push('Image ' + j)
      }
      boxData.push(get(scan, 'data.segmentation2D.' + labels[i] + '.' + value + '-quantiles'))
    }
    if (selected) {
      test = selected.id.match(/(\d+)/)[0].toString()
      label = test[test.length - 3] + test[test.length - 2] + test[test.length - 1] // This is not the best option but it works fine

      for (let i = 0; i < labels.length; i++) {
        singleData.push(get(scan, 'data.segmentation2D.evaluation-results.' + label + '_' + labels[i] + '.' + value))
      }

      singlePoints = {
        type: 'scatter',
        name: 'Single points',
        data: singleData,
        color: 'red',
        marker: {
          radius: 8
        },
        tooltip: {
          headerFormat: '<em>{point.key}</em><br/>'
        }
      }
    } else {
      singlePoints = {}
    }

    const plot = {
      chart: {
        height: '100%'
      },
      title: {
        text: ''
      },
      legend: {
        enabled: false
      },
      xAxis: {
        categories: barLabels
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      series: [{
        type: 'boxplot',
        name: 'Metrics',
        data: boxData,
        tooltip: {
          headerFormat: '<em>{point.key}</em><br/>'
        }
      },
      {
        type: 'scatter',
        name: 'All points',
        data: pointsData,
        tooltip: {
          headerFormat: '<em>{point.key}</em><br/>'
        }
      }, singlePoints
      ],
      credits: {
        enabled: false
      }
    }
    return plot
  }

  const handleChange = e => {
    e.value === 'segmentation2D' ? data[2] = 'MIOU' : data[2] = 'IOU'
    setActive(types[0])
    if (activeData === 'IOU' || activeData === 'MIOU') { // There should be another way to do it but it doesn't seem to work with this
      setActiveData(data[2]) // This doesn't change the activeData for some reason
      setEvaluation({ ...evaluation, activeEvaluation: e.value, data: data[2].toLocaleLowerCase() })
    } else {
      setEvaluation({ ...evaluation, activeEvaluation: e.value, data: activeData.toLocaleLowerCase() })
    }
  }

  function setData (data) {
    setEvaluation({ ...evaluation, data: data.toLowerCase() })
    setActiveData(data)
  }

  function setType (type) {
    setActive(type)
  }

  const options = []

  if (get(scan, 'data.segmentation2D')) { // this is to make sure we get the right type of options available
    options.push({ value: 'segmentation2D', label: <FormattedMessage id={'segmentation2D'} /> }) // the values must be the same as the ones entered in the function barPlotData()
    // evaluation.activeEvaluation = 'segmentation2D'
    if (evaluation.activeEvaluation === 'segmentation2D') data[2] = 'MIOU'
  } else {
    if (evaluation.activeEvaluation !== 'segmentedPC') setEvaluation({ ...evaluation, activeEvaluation: 'segmentedPC' })
    data[2] = 'IOU'
  }
  if (get(scan, 'data.segmentedPcdEvaluation')) options.push({ value: 'segmentedPC', label: <FormattedMessage id={'segmentedPC'} /> })

  function setDefault () { // Sets the default value for the dropdown
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === evaluation.activeEvaluation) return options[i]
    }
    return options[0]
  }

  const styles = { // Style for the dropdown menu (to change)
    indicatorSeparator: () => {},
    singleValue: (provided) => ({
      ...provided,
      paddingBottom: 1
    }),
    control: base => ({
      ...base,
      minHeight: 40,
      fontFamily: '$InterRegular',
      fontSize: 15,
      fontWeight: 400,
      width: 350
    }),
    menu: base => ({
      ...base,
      fontFamily: '$InterRegular',
      fontSize: 15,
      width: 350
    })
  }

  return <div style={{
    width: 450,
    height: '95%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 14
  }}>
    <div style={{
      display: 'flex',
      flexFlow: 'row'
    }}>
      <div style={{
        width: 300,
        marginTop: 5,
        marginLeft: 90
      }}>
        <Select
          options={options}
          defaultValue={setDefault()}
          onChange={handleChange}
          styles={styles}
          isRtl='true'
          isSearchable={false}
        />
      </div>
      <div style={{
        width: 45
      }}>
        <Header
          id={props.id}
          tooltipId={props.tooltipId}
          ifGraph={false}
          onClose={props.onClose}
          data={props.data}
        />
      </div>
    </div>
    <ButtonGroup style={{ marginLeft: 65 }}>
      {data.map(data => (
        <ButtonToggle
          key={data}
          active={activeData === data}
          onClick={() => setData(data)}
        >
          {data}
        </ButtonToggle>
      ))}
    </ButtonGroup>
    <div style={{
      position: 'relative',
      width: '100%',
      height: '30%',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }}>
      {
        (active === types[0]) && <BarPlot data={barPlotData(evaluation.data)} legend={evaluation.activeEvaluation !== 'segmentation2D'} />
      }
      {
        (active === types[1]) && evaluation.activeEvaluation === 'segmentation2D' && <BoxPlot data={boxPlotData(evaluation.data)} />
      }
    </div>
    {
      evaluation.activeEvaluation === 'segmentation2D' && <div style={{ marginTop: 15 }}>
        <ButtonGroup>
          {types.map(type => (
            <ButtonToggle
              key={type}
              active={active === type}
              onClick={() => setType(type)}
            >
              {type}
            </ButtonToggle>
          ))}
        </ButtonGroup>
      </div>
    }
  </div>
}
