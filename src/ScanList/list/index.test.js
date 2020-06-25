import React from 'react'
import { render, cleanup, compareStyles } from 'rd/tools/test-utils'
import '@testing-library/jest-dom/extend-expect'
import { format } from 'date-fns'

import { Item } from './index'

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

describe('Item component', () => {
  let rerender
  let elem = {}
  beforeEach(() => {
    const { queryByText, getAllByTestId, queryByTestId,
      rerender: localRerender } = render(<Item item={mockItem} />)
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
    rerender = localRerender
  })

  it('renders without crashing', () => {
    for (let key in elem) {
      expect(elem[key]).toBeTruthy()
    }
  })

  xit('measure indicators are displayed according to available measures',
    () => {
      /* Same as before, here we check if enabled measures have the same style
        and if their style is different from disabled measures */
      let [disabledStyle, enabledStyle] =
        compareStyles(elem.auto, elem.man)
      expect(disabledStyle).not.toEqual(enabledStyle)
    })

  xit('icons display according to available data', () => {
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
  })
})
