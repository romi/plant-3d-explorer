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

// Renders the React component tree into the 'root' DOM element
const render = (Component) => {
  return ReactDOM.render(
    <div>
      {/* Applies global styles across the app */}
      <GlobalStyles />

      {/* Provides the Redux store to the React component tree */}
      <ReduxProvider>
        {/* Provides internationalization (i18n) support with localized messages */}
        <IntlProvider messages={messages}>
          {/* The root app component */}
          <App />
        </IntlProvider>
      </ReduxProvider>
    </div>,
    // Mounts the React application to the DOM element with the ID 'root'
    document.getElementById('root')
  )
}

// Initial call to render the main `App` component
render(App)

// Enables Hot Module Replacement (HMR) if the module is hot-reloadable
if (module.hot) {
  module.hot.accept('./App', () => {
    // Dynamically require the updated version of the `App` component
    const NextApp = require('./App').default
    // Re-render the updated component tree
    render(NextApp)
  })
}
