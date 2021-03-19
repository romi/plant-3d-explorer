/*

Plant 3D Explorer: An browser application for 3D scanned
plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/
import React, { Component, Suspense } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { lazy } from 'rd/tools/routing'
import { basename, landingUrl, viewerUrl } from 'common/routing'

const LandingPage = lazy(() => import('ScanList'))
const ViewerPage = lazy(() => import('Viewer'))

function Loading () {
  return <div style={{
    fontSize: '10rem',
    fontWeight: 500,
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
      <Router basename={basename}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route exact path={landingUrl} component={LandingPage} />
            <Route exact path={viewerUrl} component={ViewerPage} />
            <Route path='*' component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  }
}

export default App
