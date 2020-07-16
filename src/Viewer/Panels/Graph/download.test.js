import React from 'react'
import { render, fireEvent, screen } from 'rd/tools/test-utils'

import { Download } from './download'

const originalMockData = {
  automated: [],
  manual: [],
  valueTransform: jest.fn(),
  unit: 'u'
}

let mockData = originalMockData

describe('Download component', () => {
  let download, rerender
  beforeEach(() => {
    const { queryByTestId, rerender: r } =
      render(<Download data={mockData} />)
    download = queryByTestId(/menubox/i)
    rerender = r
  })

  it('renders correctly', () => {
    expect(download).toBeTruthy()
  })

  it('menu displays right when clicked', () => {
    expect(screen.queryAllByTestId(/interactor/i).length).toBe(0)
    expect(screen.queryAllByTestId(/download-button/i).length).toBe(0)
    fireEvent.click(screen.queryByTestId(/icon/i).children[0])
    rerender(<Download data={mockData} />)
    expect(screen.queryAllByTestId(/interactor/i).length).toBe(2)
    expect(screen.queryAllByTestId(/download-button/i).length).toBe(2)
  })

  it('displays right when unit is degrees', () => {
    expect(screen.queryAllByTestId(/interactor/i).length).toBe(0)
    expect(screen.queryAllByTestId(/download-button/i).length).toBe(0)
    mockData.unit = '°'
    rerender(<Download data={mockData} />)
    fireEvent.click(screen.queryByTestId(/icon/i).children[0])
    rerender(<Download data={mockData} />)
    expect(screen.queryAllByTestId(/interactor/i).length).toBe(4)
    expect(screen.queryAllByTestId(/download-button/i).length).toBe(2)
  })
})
