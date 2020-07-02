import React from 'react'
import { IntlProvider } from 'react-intl'
import GlobalStyles from 'common/styles'
import messages from 'common/intl/en.json'
import ReduxProvider from 'common/redux'

export default ({ children }) => (
  <div>
    <GlobalStyles />
    <ReduxProvider>
      <IntlProvider messages={messages}>
        { children }
      </IntlProvider>
    </ReduxProvider>
  </div>
)
