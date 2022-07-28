/*
import React from 'react'
import { queryByPlaceholderText,
  render, fireEvent, screen } from 'rd/tools/test-utils'

import Misc from './misc'

window.HTMLCanvasElement.prototype.getContext = jest.fn()

const originalMockSnapshot = {
  image: '',
  trueResolution: { width: 200, height: 200 },
  snapResolution: { width: 200, height: 200 }
}

let mockSnapshot = originalMockSnapshot
const mockSetSnapshot = jest.fn((val) => { mockSnapshot = val })
const mockUseSnapshot = () => ([mockSnapshot, mockSetSnapshot])

const originalMockColor = { background: '#000000' }
let mockColors = originalMockColor
const mockSetColors = jest.fn((val) => { mockColors = val })
const mockUseColor = () => ([mockColors, mockSetColors])

jest.mock('flow/interactions/accessors', () => ({
  ...(jest.requireActual('flow/interactions/accessors')),
  useSnapshot: () => mockUseSnapshot(),
  useColor: () => mockUseColor()
}))

const originalMockMisc = { activeTool: null }
let mockMisc = originalMockMisc
const mockSetMisc = jest.fn((val) => { mockMisc = val })
const mockUseMisc = () => ([mockMisc, mockSetMisc])
jest.mock('flow/settings/accessors', () => ({
  ...(jest.requireActual('flow/settings/accessors')),
  useMisc: () => mockUseMisc()
}))

let interactors, rerender
beforeEach(() => {
  const { getAllByTestId, rerender: r } = render(<Misc />)
  interactors = getAllByTestId(/interactor/i)
  rerender = r
})

afterEach(() => {
  mockMisc = originalMockMisc
})

it('renders correctly', () => {
  expect(interactors).toBeTruthy()
})

describe('background color', () => {
  it('color picker for background displays', () => {
    expect(screen.queryByTestId(/background-color/i)).toBeFalsy()
    fireEvent.click(interactors[1])
    rerender(<Misc />)
    expect(screen.queryByTestId(/background-color/i)).toBeTruthy()
  })

  it('color picker calls the correct function', () => {
    fireEvent.click(interactors[1])
    rerender(<Misc />)
    const picker = screen.queryByTestId(/background-color/i)
      .querySelector('input')
    fireEvent.change(picker, { target: { value: '#ffffff' } })
    expect(mockSetColors).toHaveBeenCalledWith({ background: '#ffffff' })
  })
  // TODO: tests for default value
})

describe('snapshot', () => {
  it('snapshot menu displays', () => {
    expect(screen.queryByTestId(/snapshot-menu/i)).toBeFalsy()
    fireEvent.click(interactors[2])
    rerender(<Misc />)
    expect(screen.queryByTestId(/snapshot-menu/i)).toBeTruthy()
  })

  it('changing resolution calls correct functions', () => {
    const calls = mockSetSnapshot.mock.calls.length
    fireEvent.click(interactors[2])
    rerender(<Misc />)
    const inputX = queryByPlaceholderText(
      screen.queryByTestId(/snapshot-menu/i),
      'X')
    const inputY = queryByPlaceholderText(
      screen.queryByTestId(/snapshot-menu/i),
      'Y')
    expect(mockSetSnapshot).toHaveBeenCalledTimes(calls)
    fireEvent.change(inputX, { target: { value: '3000' } })
    fireEvent.change(inputY, { target: { value: '3000' } })
    fireEvent.click(screen.queryByTestId(/gendlbutton/i))
    expect(mockSetSnapshot).toHaveBeenCalledTimes(calls + 1)
  })

  it('preview is generated when image is not null and disappears when clicked',
    () => {
      fireEvent.click(interactors[2])
      rerender(<Misc />)
      expect(screen.queryByAltText(/Preview/i)).toBeFalsy()
      mockSnapshot = { ...mockSnapshot, image: 'something' }
      rerender(<Misc />)
      const image = screen.queryByAltText(/Preview/i)
      expect(image).toBeTruthy()
      fireEvent.click(image)
      rerender(<Misc />)
      expect(screen.queryByAltText(/Preview/i)).toBeFalsy()
    })
})

describe('photoset', () => {
  it('renders correctly', () => {
    expect(interactors[3]).toBeTruthy()
  })

  it('photo set menu renders when clicked', () => {
    expect(screen.queryByTestId(/photoset-menu/i)).toBeFalsy()
    fireEvent.click(interactors[3])
    rerender(<Misc />)
    expect(screen.queryByTestId(/photoset-menu/i)).toBeTruthy()
  })
})
*/