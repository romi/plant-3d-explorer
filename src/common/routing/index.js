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

/**
 * Application routing and URL configuration constants.
 * These define the core navigation structure of the application.
 */

/**
 * The root path of the application where users land by default.
 * Used for directing users to the home/landing page.
 *
 * @const {string}
 */
export const LANDING_URL = '/'

/**
 * URL pattern for the scan viewer page with a dynamic scan ID parameter.
 * Used for routing to specific scan views.
 *
 * Example usage:
 * - Raw: '/viewer/:scanId'
 * - With parameter: '/viewer/123456'
 *
 * @const {string}
 */
export const VIEWER_URL = '/viewer/:scanId'

/**
 * Base path prefix for the application, typically used in deployment scenarios
 * where the app doesn't sit at the root of the domain.
 *
 * This value is taken from the environment variable `BASENAME`.
 * If the environment variable is not set, it defaults to the root path '/'.
 *
 * @const {string}
 */
export const BASE_PATH = process.env.BASENAME || '/'
