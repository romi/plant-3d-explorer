import React from 'react'
import { queryByTestId, render, fireEvent, screen } from 'rd/tools/test-utils'

import OverlayInteractors from './overlay'

const originalOrganInfo = null
let mockOrganInfo = originalOrganInfo
let mockSetOrganInfo = jest.fn((val) => { mockOrganInfo = val })

let mockUseOrganInfo = jest.fn(() => ([
  mockOrganInfo,
  mockSetOrganInfo
]))

jest.mock('flow/interactions/accessors', () => ({
  ...(jest.requireActual('flow/interactions/accessors')),
  useOrganInfo: () => mockUseOrganInfo()
}))

let overlay, tempBubble, permaBubble, rerender
beforeEach(() => {
  const { queryAllByTestId, queryByTestId, rerender: r } =
    render(<OverlayInteractors />)
  overlay = queryByTestId('overlay-interactors')
  tempBubble = queryAllByTestId(/temp-bubble/i)
  permaBubble = queryByTestId(/permanent-bubble/i)
  rerender = r
})

it('renders correctly initially', () => {
  expect(overlay).toBeTruthy()
  expect(tempBubble).toEqual([])
  expect(permaBubble).toBeFalsy()
})

describe('with organ Info set', () => {
  beforeEach(() => {
    mockOrganInfo = 10
    rerender(<OverlayInteractors />)
  })

  it('renders a temporary bubble correctly', () => {
    expect(screen.queryByTestId('temp-bubble-10')).toBeTruthy()
    expect(screen.queryByTestId(/permanent-bubble/i)).toBeFalsy()
    expect(screen.queryByText(/organ-bubble/i)).toBeTruthy() /* Same thing as
      the temp bubble, but query by text */
  })

  it('temporary bubbles turn into permanent ones when dragging them', () => {
    fireEvent.mouseDown(screen.queryByTestId('temp-bubble-10-content'))
    expect(mockSetOrganInfo).not.toHaveBeenCalled()
    rerender(<OverlayInteractors />)
    fireEvent.mouseMove(screen.queryByTestId('temp-bubble-10-content'))
    expect(mockSetOrganInfo).toHaveBeenCalledTimes(1)
    rerender(<OverlayInteractors />)
    expect(screen.queryByTestId('temp-bubble-10')).toBeFalsy()
    expect(screen.queryByTestId('permanent-bubble-10')).toBeTruthy()
  })

  it('multiple perma bubbles and a temp one can be displayed simultaneously',
    () => {
      fireEvent.mouseDown(screen.queryByTestId('temp-bubble-10-content'))
      rerender(<OverlayInteractors />)
      fireEvent.mouseMove(screen.queryByTestId('temp-bubble-10-content'))
      rerender(<OverlayInteractors />)
      mockOrganInfo = 11
      rerender(<OverlayInteractors />)
      fireEvent.mouseDown(screen.queryByTestId('temp-bubble-11-content'))
      rerender(<OverlayInteractors />)
      fireEvent.mouseMove(screen.queryByTestId('temp-bubble-11-content'))
      rerender(<OverlayInteractors />)
      mockOrganInfo = 12
      rerender(<OverlayInteractors />)
      expect(screen.queryByTestId('temp-bubble-12')).toBeTruthy()
      expect(screen.queryByTestId('permanent-bubble-11')).toBeTruthy()
      expect(screen.queryByTestId('permanent-bubble-10')).toBeTruthy()
    })

  it('permanent bubbles close when clicking the close button', () => {
    fireEvent.mouseDown(screen.queryByTestId('temp-bubble-10-content'))
    rerender(<OverlayInteractors />)
    fireEvent.mouseMove(screen.queryByTestId('temp-bubble-10-content'))
    rerender(<OverlayInteractors />)
    const bubble = screen.queryByTestId('permanent-bubble-10')
    expect(bubble).toBeTruthy()
    fireEvent.click(queryByTestId(bubble, 'close-button'))
    rerender(<OverlayInteractors />)
    expect(screen.queryByTestId('permanent-bubble-10')).toBeFalsy()
  })

  it('temporary bubbles are closed when clicking the close button', () => {
    const bubble = screen.queryByTestId('temp-bubble-10')
    expect(bubble).toBeTruthy()
    const close = queryByTestId(bubble, 'close-button')
    expect(close).toBeTruthy()
    fireEvent.click(close)
    rerender(<OverlayInteractors />)
    expect(screen.queryByTestId('temp-bubble-10')).toBeFalsy()
  })

  it('temporary bubbles are replaced', () => {
    expect(screen.queryByTestId('temp-bubble-10')).toBeTruthy()
    mockOrganInfo = 11
    rerender(<OverlayInteractors />)
    expect(screen.queryByTestId('temp-bubble-10')).toBeFalsy()
    expect(screen.queryByTestId('temp-bubble-11')).toBeTruthy()
  })
})
