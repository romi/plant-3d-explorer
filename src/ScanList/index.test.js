import React from 'react'
import { screen, render, queryByText, queryByTestId } from 'rd/tools/test-utils'

import ScanList from './index'

const mockItem = {
  id: '1',
  thumbnailUri: 'testuri',
  metadata: {
    plant: 'Plant name',
    species: 'Test species',
    environment: 'Test environment',
    date: new Date('2020-01-01T00:00:02').toString(),
    files: {
      archive: 'archive-link',
      metadatas: 'metadatas-link'
    }
  },
  hasTriangleMesh: true,
  hasPointCloud: false,
  hasCurveSkeleton: true,
  hasAnglesAndInternodes: false,
  hasManualMeasures: false,
  hasAutomatedMeasures: true
}

const mockItem2 = {
  ...mockItem,
  id: '2',
  metadata: {
    ...mockItem.metadata,
    plant: 'b',
    species: 'a',
    environment: 'z',
    date: new Date('2020-01-01T00:00:01').toString()
  }
}
const mockItem3 = {
  ...mockItem,
  id: '3',
  metadata: {
    ...mockItem.metadata,
    plant: 'a',
    species: 'b',
    environment: 'a',
    date: new Date('2020-01-01T00:00:00').toString()
  }
}

const originalMockList = [mockItem, mockItem2, mockItem3]
let mockList = originalMockList

const originalMockSearchQuery = null
let mockSearchQuery = originalMockSearchQuery
const mockSetSearch = jest.fn((val) => { mockSearchQuery = val })

jest.mock('flow/scans/accessors', () => ({
  ...jest.requireActual('flow/scans/accessors'),
  useScans: () => [mockList],
  useSearchQuery: () => [
    mockSearchQuery,
    mockSetSearch
  ]
}))

afterEach(() => {
  mockList = originalMockList
  mockSearchQuery = originalMockSearchQuery
})

describe('ScanList component', () => {
  let resultsTitle, results, intro, search
  let rerender, queryByTestId, queryByText
  beforeEach(() => {
    const { queryByText: qbt, queryByTestId: qbtid, rerender: localRerender } =
     render(<ScanList />)
    rerender = localRerender
    queryByTestId = qbtid
    queryByText = qbt
    resultsTitle = queryByTestId('results-title')
    results = queryByTestId('results')
    intro = queryByText('app-intro')
    search = queryByText('filter-title')
  })

  describe('Without scans', () => {
    beforeEach(() => {
      mockList = null
      rerender(<ScanList />)
      resultsTitle = queryByTestId('results-title')
      results = queryByTestId('results')
      intro = queryByText('app-intro')
      search = queryByText('filter-title')
    })

    it('renders correctly', () => {
      /* Check that what should or should not be rendered whithout scans is
        correct */
      expect(resultsTitle).toBeFalsy()
      expect(results).toBeFalsy()
      expect(intro).toBeTruthy()
      expect(search).toBeTruthy()
    })
  })

  describe('With scans', () => {
    beforeEach(() => {
      /* Check that everything is rendered correctly with a non-empty scans
        list */
      expect(resultsTitle).toBeTruthy()
      expect(results).toBeTruthy()
      expect(intro).toBeTruthy()
      expect(search).toBeTruthy()
    })
  })
})

describe('ResultsTitle component', () => {
  let resultsTitle, rerender
  beforeEach(() => {
    const { rerender: r } = render(<ScanList />)
    resultsTitle = screen.queryByTestId('results-title')
    rerender = r
  })

  it('renders correctly with empty scans list and no search', () => {
    mockList = []
    rerender(<ScanList />)
    expect(resultsTitle).toBeTruthy()
    expect(queryByText(resultsTitle, 'scanlist-title')).toBeTruthy()
    expect(queryByText(resultsTitle, 'scanlist-title-search-value')).toBeFalsy()
    expect(queryByText(resultsTitle, 'scanlist-title-link')).toBeFalsy()
    expect(queryByText(resultsTitle, 'clear-button')).toBeFalsy()
  })

  it('renders correctly with a search', () => {
    mockSetSearch('test-search')
    mockList = []
    rerender(<ScanList />)
    resultsTitle = screen.queryByTestId('results-title')
    expect(resultsTitle).toBeTruthy()
    expect(queryByText(resultsTitle, 'scanlist-title')).toBeTruthy()
    expect(queryByText(resultsTitle, 'scanlist-title-search-value'))
      .toBeTruthy()
    expect(queryByText(resultsTitle, 'scanlist-title-link')).toBeTruthy()
    expect(queryByTestId(resultsTitle, 'clear-button')).toBeTruthy()
  })
})

describe('Results component', () => {
  it('renders correctly', () => {
    mockSearchQuery = 'test-search'
    render(<ScanList />)
    const results = screen.queryByTestId('results')
    expect(results).toBeTruthy()
    expect(queryByTestId(results, 'results-title')).toBeTruthy()
    expect(queryByTestId(results, 'list')).toBeTruthy()
    expect(queryByTestId(results, 'sorting')).toBeTruthy()
  })
})
