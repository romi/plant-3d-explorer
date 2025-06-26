/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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

import { lazy } from 'rd/tools/routing'
import { BASE_PATH, LANDING_URL, VIEWER_URL } from 'common/routing'
import APIStatusCheck from '../common/components/APIStatusCheck'
import Loading from '../common/components/Loading'

/**
 * Lazy loads the LandingPage component.
 *
 * The `LandingPage` variable utilizes React's `lazy` function to defer the loading of
 * the `ScanList` component until it is rendered. This helps in enhancing performance
 * by reducing the initial loading time of the application.
 *
 * The `ScanList` component will be dynamically imported when required.
 */
const LandingPage = lazy(() => import('ScanList'))

/**
 * ViewerPage is a dynamically loaded component using React's lazy function.
 * It asynchronously imports the "Viewer" component, enabling code-splitting
 * and on-demand loading of the Viewer module.
 *
 * This variable is intended for use in a React application to optimize
 * application performance by deferring the loading of the Viewer component
 * until it is required for rendering.
 *
 * The ViewerPage variable must be used in conjunction with a fallback UI,
 * typically provided using React's Suspense component, to handle the loading
 * state while the Viewer module is being fetched.
 *
 * The imported Viewer module is expected to be the default export of the
 * file located at the specified path.
 */
const ViewerPage = lazy(() => import('Viewer'))

/**
 * A functional React component that renders a 404 Not Found message.
 *
 * @return A JSX element containing the Not Found message.
 */
function NotFound () {
  return <div>
    404
  </div>
}

/**
 * App is the main component of the application which extends the React Component class.
 * It serves as the entry point for rendering the application and sets up the routing
 * structure for the various pages of the app.
 *
 * The component utilizes several sub-components to orchestrate its functionality:
 * - APIStatusCheck: A wrapper component to verify API availability before rendering the main application.
 * - Router: Provides navigation functionality for the application.
 * - Suspense: Handles loading states for components that are dynamically loaded.
 * - Switch and Route: Define the application's routing and render specific components for different routes.
 *
 * Routes:
 * - LANDING_URL: Maps to the LandingPage component, which is the main entry page for users.
 * - VIEWER_URL: Maps to the ViewerPage component, responsible for displaying a specific viewer-based functionality.
 * - Default (path='*'): Displays the NotFound component for all undefined routes.
 */
class App extends Component {
  render () {
    return <div className='App'>
      <APIStatusCheck fallback={<Loading message='Checking API availability...' />}>
        <Router BASE_PATH={BASE_PATH}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path={LANDING_URL} component={LandingPage} />
              <Route exact path={VIEWER_URL} component={ViewerPage} />
              <Route path='*' component={NotFound} />
            </Switch>
          </Suspense>
        </Router>
      </APIStatusCheck>
    </div>
  }
}

export default App
