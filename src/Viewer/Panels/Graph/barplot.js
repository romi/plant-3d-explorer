import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function BarPlot (props) {
  return <div>
    <Bar
      data={props.data}
      height={320}
      options={{ animation: { duration: 0 } }}
    />
  </div>
}
