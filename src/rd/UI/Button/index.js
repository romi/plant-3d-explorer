import React from 'react'
import { css } from 'emotion'

const button = css`
  background: red;
`

export default function (props) {
  console.log(
    props
  )
  return <button
    className={button}
    onClick={props.onClick}
  >
    {props.children}
  </button>
}
