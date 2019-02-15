import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

import 'common/global/style'

import ReduxProvider from 'common/redux'
import IntlProvider from 'common/intl'

ReactDOM.render(
  <ReduxProvider>
    <IntlProvider>
      <App />
    </IntlProvider>
  </ReduxProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
