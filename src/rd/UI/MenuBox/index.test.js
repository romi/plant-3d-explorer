import React from 'react'
import { render, screen, fireEvent } from 'rd/tools/test-utils'

import MenuBox, { MenuBoxContent } from './index'

let content, menuBox, closeButton, visibleContent, rerender
beforeEach(() => {
  const { queryByText, queryByTestId, rerender: r } = render(<MenuBox
    activate={false}
    onClose={() => {}}
    callOnChange={() => {}}
    watchChange={[0]} >
    <p> Not Content </p>
    <MenuBoxContent>
      <p> Content </p>
    </MenuBoxContent>
  </MenuBox>)
  visibleContent = queryByText('Not Content')
  content = queryByText('Content')
  menuBox = queryByTestId(/menubox/i)
  closeButton = queryByTestId(/close-button/i)
  rerender = r
})

it('renders correctly', () => {
  expect(content).toBeFalsy()
  expect(visibleContent).toBeTruthy()
  expect(menuBox).toBeTruthy()
  expect(closeButton).toBeFalsy()
})

it('content renders when menubox is activated', () => {
  rerender(<MenuBox
    watchChange={[0]}
    activate>
    <p> Not Content </p>
    <MenuBoxContent>
      <p> Content </p>
    </MenuBoxContent>
  </MenuBox>)
  expect(screen.queryByText('Content')).toBeTruthy()
  expect(visibleContent).toBeTruthy()
  expect(menuBox).toBeTruthy()
  expect(screen.queryByTestId('close-button')).toBeTruthy()
})

it('correct function is called when clicking close button', () => {
  const mockClose = jest.fn()
  rerender(<MenuBox
    activate
    onClose={mockClose}
    callOnChange={() => {}}
    watchChange={[0]} >
    <p> Not Content </p>
    <MenuBoxContent>
      <p> Content </p>
    </MenuBoxContent>
  </MenuBox>)
  expect(mockClose).not.toHaveBeenCalled()
  fireEvent.click(screen.queryByTestId('close-button'))
  expect(mockClose).toHaveBeenCalledTimes(1)
})

it('on change function is called correctly', () => {
  const mockFunc = jest.fn()
  rerender(<MenuBox
    activate
    callOnChange={mockFunc}
    watchChange={[0]} >
    <p> Not Content </p>
    <MenuBoxContent>
      <p> Content </p>
    </MenuBoxContent>
  </MenuBox>)
  expect(mockFunc).not.toHaveBeenCalled()
  rerender(<MenuBox
    activate
    callOnChange={mockFunc}
    watchChange={[1]} >
    <p> Not Content </p>
    <MenuBoxContent>
      <p> Content </p>
    </MenuBoxContent>
  </MenuBox>)
  expect(mockFunc).toHaveBeenCalledTimes(1)
  rerender(<MenuBox
    activate
    callOnChange={mockFunc}
    watchChange={[1]} >
    <p> Not Content </p>
    <MenuBoxContent>
      <p> Content </p>
    </MenuBoxContent>
  </MenuBox>)
  expect(mockFunc).toHaveBeenCalledTimes(1)
})
