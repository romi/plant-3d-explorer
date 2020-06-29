import React from 'react'
import { render, fireEvent } from 'rd/tools/test-utils'
import { sortingMethods as mockSortingMethods } from 'flow/scans/reducer'
import '@testing-library/jest-dom'

import Sorting from './index'

const originalMockSorting = {
  label: 'date',
  method: 'desc',
  defaultMethod: 'desc',
  type: 'date'
}

let mockSorting = originalMockSorting

const mockSetSorting = jest.fn((value) => { mockSorting = value })

jest.mock('flow/scans/accessors', () => ({
  ...(jest.requireActual('flow/scans/accessors')),
  useSorting: () => [
    mockSorting,
    mockSortingMethods,
    mockSetSorting
  ]
}))

let sortingLabels, filtering, rerender
beforeEach(() => {
  const { queryByTestId, getAllByText, rerender: localRerender } =
    render(<Sorting />)
  sortingLabels = getAllByText(/scanlist-sort/i)
  filtering = queryByTestId('filtering')
  rerender = localRerender
})

afterEach(() => {
  mockSorting = originalMockSorting
})

it('renders correctly', () => {
  sortingLabels.forEach((elem, index) => {
    expect(elem).toHaveTextContent(mockSortingMethods[index].label)
  })
  expect(filtering).toBeTruthy()
})

describe('user interactions', () => {
  it('action dispatcher is called', () => {
    expect(mockSetSorting).not.toHaveBeenCalled()
    fireEvent.click(sortingLabels[0])
    expect(mockSetSorting).toHaveBeenCalledTimes(1)
  })

  it('action dispatcher is called with correct arguments', () => {
    fireEvent.click(sortingLabels[0])
    expect(mockSetSorting).toHaveBeenLastCalledWith(
      expect.objectContaining(mockSortingMethods[0])
    )
    rerender(<Sorting />) /* Rerender in order to simulate actual hook behavior,
      which would trigger a rerender of the component when called. */
    fireEvent.click(sortingLabels[1])
    expect(mockSetSorting).toHaveBeenLastCalledWith(
      expect.objectContaining(mockSortingMethods[1])
    )
  })

  it('clicking twice on the same sort reverses the order', () => {
    fireEvent.click(sortingLabels[0])
    expect(mockSetSorting).toHaveBeenLastCalledWith(
      expect.objectContaining(mockSortingMethods[0])
    )
    rerender(<Sorting />) // Same reason as above for rerendering
    fireEvent.click(sortingLabels[0])
    expect(mockSetSorting).toHaveBeenLastCalledWith(
      expect.objectContaining({ ...mockSortingMethods[0], method: 'desc' })
    )
  })
})
