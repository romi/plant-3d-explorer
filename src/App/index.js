import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { lazy } from 'rd/routing'
import { landingUrl } from 'common/routing'

const LandingPage = lazy(() => import('ScanList'))

function Loading () {
  return <div style={{
    fontSize: '10rem',
    fontWeight: 'bold',
    width: '100vw',
    overflowWrap: 'break-word',
    lineHeight: '77%',
    textAlign: 'left',
    padding: 100
  }} >
    <FormattedMessage id='misc-loading' />
  </div>
}

function NotFound () {
  return <div>
    404
  </div>
}

class App extends Component {
  render () {
    return <div className='App'>
      <Router basename={window.location.pathname}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path={landingUrl} component={LandingPage} />
            <Route path='*' component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  }
}

export default App
