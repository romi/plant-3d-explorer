import React from 'react'
import { mockItem, render, compareStyles } from 'rd/tools/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { format } from 'date-fns'
import { useSorting } from 'flow/scans/accessors'
import List, { Item } from './index'

jest.mock('flow/scans/accessors', () => ({
  useSorting: jest.fn().mockReturnValue([{
    label: 'date',
    method: 'desc',
    defaultMethod: 'desc',
    type: 'date'
  }, jest.fn()])
}))

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
const mockList = [mockItem, mockItem2, mockItem3]

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
    [elem.mesh, elem.pc, elem.spc, elem.skeleton, elem.angles] =
      getAllByTestId(/icon/i)
    elem.auto = queryByTestId('auto')
    elem.man = queryByTestId('man')
    elem.archive = queryByText(/scanlist-link-download/i).parentNode
    elem.metadata = queryByText(/scanlist-link-metadata/i).parentNode
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
    expect(elem.metadata.href).toMatch(mockItem.metadata.files.metadata)
    expect(elem.id.href).toMatch(mockItem.id)
    expect(elem.auto).toHaveTextContent('angles-legend-automated')
    expect(elem.man).toHaveTextContent('angles-legend-manuel')
  })
})

describe('List component', () => {
  let openButtons
  beforeEach(() => {
    const { getAllByText } = render(<List items={mockList} />)
    openButtons = getAllByText(/scanlist-cta/i)
  })

  it('renders correctly', () => {
    openButtons.forEach((elem, index) => {
      // Just check if each open button of each item has the item id inside.
      expect(elem.parentNode.href).toMatch(mockList[index].id)
    })
  })
  describe('sorts correctly', () => {
    beforeAll(() => {
      useSorting.mockReturnValueOnce([
        { label: 'name', type: 'natural', method: 'asc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { label: 'name', type: 'natural', method: 'desc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { label: 'species', type: 'natural', method: 'asc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { label: 'species', type: 'natural', method: 'desc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { label: 'environment', type: 'natural', method: 'asc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { label: 'environment', type: 'natural', method: 'desc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { type: 'date', label: 'date', method: 'desc' },
        jest.fn()
      ]).mockReturnValueOnce([
        { type: 'date', label: 'date', method: 'asc' },
        jest.fn()
      ])
    })

    it('sorts by name asc', () => {
      openButtons.forEach((elem, index) => {
        /* Requires the mockItems to be sorted in the opposite way
        alphabetically */
        expect(elem.parentNode.href).toMatch(
          ((openButtons.length + 1) - mockList[index].id).toString())
      })
    })

    it('sorts by name desc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch(mockList[index].id)
      })
    })

    it('sorts by species asc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch((((index + 1) % 3) + 1).toString())
      })
    })

    it('sorts by species desc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch((((3 - index) % 3) + 1).toString())
      })
    })

    it('sorts by environment asc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch((((index + 2) % 3) + 1).toString())
      })
    })

    it('sorts by environment desc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch((((4 - index) % 3) + 1).toString())
      })
    })

    it('sorts by date desc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch((index + 1).toString())
      })
    })

    it('sorts by date asc', () => {
      openButtons.forEach((elem, index) => {
        expect(elem.parentNode.href).toMatch((3 - index).toString())
      })
    })
  })
})
