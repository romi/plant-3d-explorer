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
// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA

/**
 * A boolean variable that determines if the current environment is running on localhost.
 * It evaluates the window's hostname to check if it matches common localhost patterns:
 * - `localhost` for standard localhost usage
 * - `[::1]` for IPv6 localhost
 * - `127.x.x.x` for IPv4 localhost within the 127/8 range
 */
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

/**
 * Registers a service worker to enable Progressive Web App (PWA) features, such as offline functionality and improved performance.
 *
 * @param {Object} config - Configuration object for customizing the service worker's behavior. This may include callbacks like `onSuccess` and `onUpdate` to handle service worker lifecycle events.
 * @return {void} This function does not return any value.
 */
export function register (config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit http://bit.ly/CRA-PWA'
          )
        })
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })
  }
}

/**
 * Registers a valid service worker and handles updates and success events.
 *
 * @param {string} swUrl - The URL of the service worker file to register.
 * @param {Object} [config] - Optional configuration object containing callbacks for update and success events.
 * @param {Function} [config.onUpdate] - Callback function invoked when the service worker detects an update.
 * @param {Function} [config.onSuccess] - Callback function invoked when the service worker is successfully registered and cached.
 * @return {void} This function does not return a value.
 */
function registerValidSW (swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See http://bit.ly/CRA-PWA.'
              )

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration)
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.')

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch(error => {
      console.error('Error during service worker registration:', error)
    })
}

/**
 * Checks the validity of the provided service worker URL and handles scenarios
 * where the service worker is not found or invalid. If the service worker is valid,
 * it proceeds to register it. Otherwise, it handles app reload or logs offline mode status.
 *
 * @param {string} swUrl The URL of the service worker to check.
 * @param {Object} config Configuration object with optional callbacks related to the service worker events.
 * @return {void} Does not return any value. Handles service worker validation and registration or reloads the app as appropriate.
 */
function checkValidServiceWorker (swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  window.fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    })
}

/**
 * Unregisters the active service worker if one exists.
 * This function checks for support of the Service Worker API in the current browser,
 * and if supported, it attempts to unregister the service worker through the ServiceWorkerRegistration object.
 *
 * @return {void} This function does not return a value.
 */
export function unregister () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister()
    })
  }
}
