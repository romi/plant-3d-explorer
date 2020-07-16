import React from 'react'
import GlobalStyles from 'common/styles'
import ReduxProvider from 'common/redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { basename } from 'common/routing'
import IntlProvider from 'rd/tools/intl'

import { render } from '@testing-library/react'

/* This function will return an array with 2 objects representing each element's
  style, but ignoring every element in the `except` array */
export const compareStyles = (e, f, except = []) => {
  let eStyle = window.getComputedStyle(e)._values
  let fStyle = window.getComputedStyle(f)._values
  except.forEach((elem) => {
    eStyle[elem] = null
    fStyle[elem] = null
  })
  return [eStyle, fStyle]
}

const AllProviders = ({ children }) => {
  return (
    <div>
      <Router basename={basename}>
        <GlobalStyles />
        <ReduxProvider>
          <IntlProvider onError={() => {}}>
            {/* We Want to use message ids
            for queries with Jest, but not giving correct translations will trigger
            error messages to say it will use a fallback. We prevent react-intl
            from printing error messages during tests with this */ }
            { children }
          </IntlProvider>
        </ReduxProvider>
      </Router>
    </div>
  )
}

const renderWithAll = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'

export { renderWithAll as render }

export const mockItem = {
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
  hasSegmentedPointCloud: false,
  hasSkeleton: true,
  hasAngleData: false,
  hasManualMeasures: false,
  hasAutomatedMeasures: true
}
