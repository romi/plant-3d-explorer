import React from 'react'
import { render, fireEvent, screen } from 'rd/tools/test-utils'

import Tooltip, { TooltipContent } from './index'

let tooltipContent, tooltip, visibleContent, rerender
beforeEach(() => {
  const { queryByText, queryByTestId, rerender: r } = render(<Tooltip>
    <p> Visible </p>
    <TooltipContent>
      <p> Content </p>
    </TooltipContent>
  </Tooltip>)
  rerender = r
  tooltipContent = queryByText(/Content/i)
  tooltip = queryByTestId(/tooltip/i)
  visibleContent = queryByText(/Visible/i)
})

it('renders correctly', () => {
  expect(tooltipContent).toBeFalsy()
  expect(tooltip).toBeTruthy()
  expect(visibleContent).toBeTruthy()
})

it('renders correctly when hovering', () => {
  fireEvent.mouseEnter(visibleContent)
  rerender(<Tooltip>
    <p> Visible </p>
    <TooltipContent>
      <p> Content </p>
    </TooltipContent>
  </Tooltip>)
  expect(screen.queryByText(/Content/i)).toBeTruthy()
  expect(tooltip).toBeTruthy()
  expect(visibleContent).toBeTruthy()
  fireEvent.mouseLeave(visibleContent)
  rerender(<Tooltip>
    <p> Visible </p>
    <TooltipContent>
      <p> Content </p>
    </TooltipContent>
  </Tooltip>)
  expect(screen.queryByText(/Content/i)).toBeFalsy()
  expect(tooltip).toBeTruthy()
  expect(visibleContent).toBeTruthy()
})
