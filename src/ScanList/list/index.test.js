import React from 'react'
import { prettyDOM, render, compareStyles } from 'rd/tools/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { format } from 'date-fns'

import List, { Item } from './index'

const mockItem = {
  id: '123456789',
  thumbnailUri: 'testuri',
  metadata: {
    plant: 'Plant name',
    species: 'Test species',
    environment: 'Test environment',
    date: new Date('2020-01-01T00:00:00').toString(),
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

const mockList = [
  mockItem
]

describe('Item component', () => {
  let elem = {}
  // Use beforeAll because no modification on the elements is made.
  // Also this prevents some style tests from being incoherent.
  beforeAll(() => {
    const { queryByText, getAllByTestId, queryByTestId } =
      render(<Item item={mockItem} />)
    elem.thumbnail = queryByTestId('thumbnail')
    elem.name = queryByTestId('name')
    elem.species = queryByTestId('species')
    elem.env = queryByTestId('env')
    elem.date = queryByTestId('date'); /* Semi-colon needed because otherwise
    the program thinks I want to access fields of the queryByTestId result... */
    [elem.mesh, elem.pc, elem.skeleton, elem.angles] = getAllByTestId(/icon/i)
    elem.auto = queryByTestId('auto')
    elem.man = queryByTestId('man')
    elem.archive = queryByText(/scanlist-link-download/i).parentNode
    elem.metadatas = queryByText(/scanlist-link-metadata/i).parentNode
    elem.id = queryByText(/scanlist-cta/i).parentNode
  })

  it('renders correctly', () => {
    for (let key in elem) {
      expect(elem[key]).toBeTruthy()
    }
  })

  it('icons display according to available data', () => {
    /* Make sure every icon that is active has the same style,
      which should be different from every inactive icon */
    let comparedStyle, enabledStyle, disabledStyle;
    // Enabled styles are the same
    [comparedStyle, enabledStyle] =
      compareStyles(elem.mesh, elem.skeleton, ['background-image'])
    expect(comparedStyle).toEqual(enabledStyle);

    // Enabled and disabled styles are different
    [enabledStyle, disabledStyle] =
      compareStyles(elem.mesh, elem.pc, ['background-image'])
    expect(comparedStyle).not.toEqual(disabledStyle);

    // Disabled styles are the same
    [comparedStyle, disabledStyle] =
      compareStyles(elem.pc, elem.angles, ['background-image'])
    expect(comparedStyle).toEqual(disabledStyle)
  })

  xit('measure indicators are displayed according to available measures',
    () => {
      // TODO Make this test work.
      /* This framework is... weird. If I ever find a way to make this work
        i'll do it, but for now it's just terrible. */
    })

  it('has correct information', () => {
    expect(elem.thumbnail).toHaveStyle('background-image: url(' +
      mockItem.thumbnailUri + ')')
    expect(elem.name).toHaveTextContent(mockItem.metadata.plant)
    expect(elem.species).toHaveTextContent(mockItem.metadata.species)
    expect(elem.env).toHaveTextContent(mockItem.metadata.environment)
    expect(elem.date).toHaveTextContent(format(mockItem.metadata.date,
      'MMM DD YYYY HH:mm:ss'))
    expect(elem.archive.href).toMatch(mockItem.metadata.files.archive)
    expect(elem.metadatas.href).toMatch(mockItem.metadata.files.metadatas)
    expect(elem.id.href).toMatch(mockItem.id)
    expect(elem.auto).toHaveTextContent('angles-legend-automated')
    expect(elem.man).toHaveTextContent('angles-legend-manuel')
  })
})

describe('List component', () => {
  let mockSorting = { type: 'natural', label: 'name' }
  let items
  beforeEach(() => {
    jest.mock('flow/scans/accessors', () => ({
      useSorting: () => [
        mockSorting,
        jest.fn()
      ]
    }))
    const { getAllByTestId } =
      render(<List items={mockList} />)
    items = getAllByTestId(/item/i)
  })

  it('renders correctly', () => {
    console.log(items)
  })
})
