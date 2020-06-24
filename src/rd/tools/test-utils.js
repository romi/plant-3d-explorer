import React from 'react'
import GlobalStyles from 'common/styles'
import ReduxProvider from 'common/redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { basename } from 'common/routing'
import IntlProvider from 'rd/tools/intl'

import { render } from '@testing-library/react'

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
