import React from 'react'
import ReactDOM from 'react-dom'

import IntlProvider from 'rd/tools/intl'

import GlobalStyles from 'common/styles'
import messages from 'common/intl/en.json'
import ReduxProvider from 'common/redux'

import App from './App'
import * as serviceWorker from './serviceWorker'

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

const render = (Component) => {
  return ReactDOM.render(
    <div>
      <GlobalStyles />
      <ReduxProvider>
        <IntlProvider messages={messages}>
          <App />
        </IntlProvider>
      </ReduxProvider>
    </div>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}
