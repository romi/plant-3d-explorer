import React from 'react'
import { render } from 'rd/tools/test-utils'

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
  hasMesh: true,
  hasPointCloud: false,
  hasSkeleton: true,
  hasAngleData: false,
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

jest.mock('flow/scans/accessors', () => ({
  ...jest.requireActual('flow/scans/accessors'),
  useScans: () => [mockList]
}))

afterEach(() => {
  mockList = originalMockList
})

describe('ScanList component', () => {
  let resultsTitle, rerender
  beforeEach(() => {
    const { queryByTestId, rerender: localRerender } = render(<ScanList />)
    resultsTitle = queryByTestId('results-title')
    rerender = localRerender
  })

  describe('Without scans', () => {
    beforeEach(() => {
      mockList = null
      rerender(<ScanList />)
    })

    it('renders correctly', () => {
      expect(resultsTitle).toBeFalsy()
    })
  })

  describe('With scans', () => {
  })
})
