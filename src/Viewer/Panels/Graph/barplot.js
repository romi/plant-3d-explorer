import React from 'react'
import { Bar } from 'react-chartjs-2'

export default function BarPlot (props) {
  return <Bar
    data={props.data}
    options={{
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      animation: { duration: 0 },
      plugins: {
        legend: {
          display: props.legend
        }
      }
    }}
  />
}
