import React from 'react'
import { render } from 'rd/tools/test-utils'

import { Item } from './index'

const mockItem = {
  id: '123456789',
  thumbnailUri: 'testuri',
  metadata: {
    plant: 'Plant name',
    environment: 'Test environment',
    date: Date.now().toString(),
    files: {
      archive: 'archive-link',
      metadatas: 'metadatas-link'
    }
  },
  hasMesh: true,
  hasPointCloud: false,
  hasSkeleton: true,
  hasAngleData: true,
  hasManualMeasures: false,
  hasAutomatedMeasures: true
}

describe('Item component', () => {
  it('renders without crashing', () => {
    render(<Item item={mockItem} />)
  })

  xit('has correct information', () => {
    // TODO
  })

  xit('icons display according to available data', () => {
    // TODO
  })

  xit('measure indicators are displayed according to available measures',
    () => {
    }
  )
})
