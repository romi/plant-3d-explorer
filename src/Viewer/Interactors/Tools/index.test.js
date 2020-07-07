import React from 'react'
import { render, fireEvent, screen } from 'rd/tools/test-utils'

import ToolButton from './index'

const originalMockList = {
  activeTool: null
}
let mockList = originalMockList
const mockSetList = jest.fn((val) => { mockList = val })

const mockToolsList = () => ([
  mockList,
  mockSetList
])

let tooltip, content, interactor, menuBox, rerender, tooltipContent
beforeEach(() => {
  const { queryByText, queryByTestId, rerender: r } = render(<ToolButton
    toolsList={mockToolsList()}
    tool={1}
    tooltipId='tooltip-test'
  > <p> TestContent </p> </ToolButton>
  )
  tooltip = queryByTestId(/tooltip/i)
  content = queryByText(/TestContent/i)
  interactor = queryByTestId(/interactor/i)
  menuBox = queryByTestId(/menubox/i)
  tooltipContent = queryByText(/tooltip-test/i)
  rerender = r
})

it('renders correctly', () => {
  expect(tooltip).toBeTruthy()
  expect(content).toBeFalsy()
  expect(interactor).toBeTruthy()
  expect(menuBox).toBeTruthy()
})

it('content appears when clicking', () => {
  expect(content).toBeFalsy()
  expect(mockSetList).not.toHaveBeenCalled()
  fireEvent.click(interactor)
  expect(mockSetList).toHaveBeenCalledTimes(1)
  expect(mockToolsList()[0]).toEqual({ activeTool: 1 })
  rerender(<ToolButton
    toolsList={mockToolsList()}
    tool={1}
    tooltipId='tooltip-test'
  > <p> TestContent </p> </ToolButton>)
  expect(screen.queryByText(/TestContent/i)).toBeTruthy()
})

it('tooltip appears when hovering', () => {
  expect(tooltipContent).toBeFalsy()
  fireEvent.mouseEnter(interactor)
  rerender(<ToolButton
    toolsList={mockToolsList()}
    tool={1}
    tooltipId='tooltip-test'
  > <p> TestContent </p> </ToolButton>)
  expect(screen.queryByText(/tooltip-test/i)).toBeTruthy()
  fireEvent.mouseLeave(interactor)
  rerender(<ToolButton
    toolsList={mockToolsList()}
    tool={1}
    tooltipId='tooltip-test'
  > <p> TestContent </p> </ToolButton>)
  expect(screen.queryByText(/tooltip-test/i)).toBeFalsy()
})

// Also see MenuBox for more in depth tests on this component.
