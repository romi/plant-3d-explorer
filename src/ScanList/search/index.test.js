import React from 'react'
import { render, fireEvent } from 'rd/tools/test-utils'

import Search from './index'

let input, button, rerender
beforeEach(() => {
  const { rerender: localRerender, queryByPlaceholderText, queryByText } =
   render(<Search />)
  input = queryByPlaceholderText(/filter-placeholder/i)
  button = queryByText(/filter-submit/i)
  rerender = localRerender
})

it('renders correctly', () => {
  expect(input).toBeTruthy()
  expect(button).toBeTruthy()
})

describe('input value', () => {
  it('update on change', () => {
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input.value).toBe('test')
  })

  it('reset on Escape key down when focused', () => {
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input.value).toBe('test')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.value).toBe('')
  })

  it('doesn\'t reset on Escape key down without focus', () => {
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input.value).toBe('test')
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input.value).toBe('test')
  })
})

describe('submit value', () => {
  let onSearch
  beforeEach(() => {
    onSearch = jest.fn()
    rerender(<Search onSearch={onSearch} />)
  })

  it('calls onSearch function on button click', () => {
    expect(onSearch).not.toHaveBeenCalled()
    fireEvent.submit(button)
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('calls onSearch function on input submit', () => {
    expect(onSearch).not.toHaveBeenCalled()
    fireEvent.submit(input)
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('calls onSearch with the input value as argument', () => {
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.submit(input)
    expect(onSearch).toHaveBeenCalledWith('test')
  })
})
