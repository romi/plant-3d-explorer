import React from 'react'
import { render, fireEvent, screen } from 'rd/tools/test-utils'

import Panels from './index'

const mockScan = { data: {
  angles: {
    angles: [1, 1],
    internodes: [1, 1],
    fruit_points: [1, 1],
    measured_internodes: [1, 1]
  }
} }

jest.mock('flow/scans/accessors', () => ({
  ...(jest.requireActual('flow/scans/accessors')),
  useScan: () => ([mockScan])
}))

let closeButtons, headers, panelLength, rerender
beforeEach(() => {
  const { queryAllByTestId, rerender: r } = render(<Panels />)
  closeButtons = queryAllByTestId(/close-icon/i)
  headers = queryAllByTestId(/header/i)
  panelLength = headers.length
  rerender = r
})

it('renders correctly', () => {
  expect(closeButtons[0]).toBeTruthy()
  expect(headers[0]).toBeTruthy()
})

it('close button works', () => {
  fireEvent.click(closeButtons[0].children[0])
  rerender(<Panels />)
  headers = screen.queryAllByTestId(/header/i)
  expect(headers.length).toEqual(panelLength - 1)
})
