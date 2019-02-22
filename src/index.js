import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

import 'common/global/style'

import ReduxProvider from 'common/redux'
import IntlProvider from 'common/intl'

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

const render = (Component) => {
  return ReactDOM.render(
    <ReduxProvider>
      <IntlProvider>
        <App />
      </IntlProvider>
    </ReduxProvider>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  // module.hot.accept('./App', () => {
  //   const NextApp = require('./App').default
  //   render(NextApp)
  // })
}
