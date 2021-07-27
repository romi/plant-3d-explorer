import React from 'react'
import ReactHighchart from 'react-highcharts'
import HighchartMore from 'highcharts/highcharts-more'
HighchartMore(ReactHighchart.Highcharts)

export default function BoxPlot (props) {
  return <ReactHighchart config={props.data} />
}
