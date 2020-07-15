import React from 'react'
import { render, fireEvent } from 'rd/tools/test-utils'

import Layers from './layers'

const originalMockLayers = {
  mesh: false,
  pointCloud: false,
  segmentedPointCloud: false,
  skeleton: false,
  angles: false
}

let mockLayers = originalMockLayers
const mockSetLayers = jest.fn((val) => { mockLayers = val })

const mockUseLayers = () => ([
  mockLayers,
  mockSetLayers
])

jest.mock('flow/settings/accessors', () => ({
  useLayers: () => mockUseLayers()
}))

jest.mock('flow/scans/accessors', () => ({
  ...(jest.requireActual('flow/scans/accessors')),
  useScanFiles: () => ([[true], [false]]),
  useScan: () => ([{ data: { skeleton: false } }]),
  useSegmentedPointCloud: () => [false]
}))

let interactors
beforeEach(() => {
  const { getAllByTestId } = render(<Layers />)

  interactors = getAllByTestId(/interactor/i)
})

it('renders correctly', () => {
  expect(interactors).toBeTruthy()
  expect(interactors.length).toBe(Object.keys(originalMockLayers).length)
})

it('setter is not called when clicking on disabled interactor', () => {
  expect(mockSetLayers).not.toHaveBeenCalled()
  fireEvent.click(interactors[1])
  expect(mockSetLayers).not.toHaveBeenCalled()
})

it('setter is called when clicking on enabled interactor', () => {
  expect(mockSetLayers).not.toHaveBeenCalled()
  fireEvent.click(interactors[0])
  expect(mockSetLayers).toHaveBeenCalledWith({
    ...originalMockLayers,
    mesh: true
  })
})
