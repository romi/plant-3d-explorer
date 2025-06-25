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
 * The `serverURL` variable is used to determine the base URL for the server API.
 *
 * - In a production environment (when `NODE_ENV` is set to 'production'), the `serverURL` is set to an empty string.
 * - In a non-production environment, it attempts to use the `REACT_APP_API_URL` environment variable.
 * - If `REACT_APP_API_URL` is not defined, it defaults to 'http://localhost:5000'.
 *
 * This variable is helpful in differentiating between development and production environments.
 */
export const serverURL = process.env.NODE_ENV === 'production'
  ? ''
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000')

/**
 * Constructs and returns a full URI by appending the provided relative path to the server's base URL.
 *
 * @param {string} path - The relative path to the resource.
 * @returns {string} The full URI to access the resource.
 */
export const getFullURI = (path) => serverURL + path

/**
 * A string representing the URI endpoint for accessing scan-related operations on the server.
 * The endpoint is constructed by concatenating the base server URL with the '/scans_info' path.
 *
 * @const {string}
 */
export const scansURI = serverURL + '/scans_info'

/**
 * Constructs a URI query string for scans based on the provided search and fuzzy parameters.
 *
 * @param {string} [search] - The search term to filter the results. If provided, it will be added as a query parameter `filterQuery` in the URI.
 * @param {boolean} [fuzzy] - Determines if fuzzy search should be applied. If true, it will append `&fuzzy=true` to the URI.
 * @returns {string} The constructed URI query string with the optional search and fuzzy parameters.
 */
export const scansURIQuery = (search, fuzzy) =>
  `${getFullURI('/scans_info')}${search ? `?filterQuery=${search}` : ''}${fuzzy ? `&fuzzy=${fuzzy}` : ''}`

/**
 * Concatenates and constructs a URL to retrieve a specific scan file.
 *
 * @param {string} scanId - The identifier for the desired file.
 * @param {string} path - The path or subdirectory where the file is located.
 * @returns {string} The complete URL for accessing the scan file.
 */
export const getScanFile = (scanId, path) =>
  getFullURI(`/files/${scanId}/${path}`)

/**
 * Retrieves the full file URL by appending the specified file path to the server's base URL.
 *
 * @param {string} path - The relative path of the file, starting from the root directory.
 * @returns {string} The full URL of the file combining the server's base URL and the file path.
 */
export const getFileURI = (path) =>
  getFullURI(`/files/${path}`)

/**
 * Constructs the URI to access a specific scan based on the given ID.
 *
 * @param {string} scanId - The identifier of the scan to retrieve.
 * @returns {string} The complete URI to access the scan.
 */
export const getScanURI = (scanId) =>
  getFullURI(`/scans/${scanId}`)

/**
 * Constructs the URL to retrieve metadata for a specific scan.
 *
 * @param {string} scanId - The identifier of the scan for which metadata is requested.
 * @returns {string} The fully constructed URL pointing to the metadata file of the specified scan.
 */
export const getScanMetadataURI = (scanId) =>
  getFullURI(`/files/${scanId}/metadata/metadata.json`)

/**
 * Constructs and returns a URL string to fetch an image with the specified parameters.
 *
 * @param {string} scanId - The unique identifier for the scan associated with the image.
 * @param {string} filesetId - The unique identifier for the fileset containing the image file.
 * @param {string} fileId - The unique identifier for the specific image file to retrieve.
 * @param {string} [size='thumb'] - The desired size of the image. Defaults to 'thumb'.
 * @returns {string} A string representing the URL to access the specified image.
 */
export const getScanImageURI = (scanId, filesetId, fileId, size = 'thumb') =>
  getFullURI(`/image/${scanId}/${filesetId}/${fileId}?size=${size}`)

/**
 * Generates a URL to retrieve a point cloud file.
 *
 * @param {string} scanId - The unique identifier for the scan.
 * @param {string} filesetId - The unique identifier for the fileset within the scan.
 * @param {string} fileId - The unique identifier for the specific file within the fileset.
 * @param {string} [size='preview'] - The size of the point cloud file to retrieve. Defaults to 'preview'.
 * @returns {string} The generated URL for the point cloud file.
 */
export const getScanPointCloudURI = (scanId, filesetId, fileId, size = 'preview') =>
  getFullURI(`/pointcloud/${scanId}/${filesetId}/${fileId}?size=${size}`)

/**
 * Constructs a URL string to retrieve a 3D mesh file.
 *
 * @param {string} scanId - The unique identifier for the scan.
 * @param {string} filesetId - The unique identifier for the fileset within the scan.
 * @param {string} fileId - The unique identifier for the specific file within the fileset.
 * @returns {string} A URL string pointing to the specified mesh file with the original size.
 */
export const getScanMeshURI = (scanId, filesetId, fileId) =>
  getFullURI(`/mesh/${scanId}/${filesetId}/${fileId}?size=orig`)

export const getScanSkeletonURI = (scanId) =>
  getFullURI(`/skeleton/${scanId}`)

/**
 * Constructs a URL for retrieving a sequence based on the given scan ID and type.
 *
 * @param {string} scanId - The unique identifier for the scan.
 * @param {string} [type='all'] - The type of sequence to retrieve. Defaults to 'all'.
 * @returns {string} The constructed URL for the sequence.
 */
export const getScanSequenceURI = (scanId, type = 'all') =>
  getFullURI(`/sequence/${scanId}?type=${type}`)

/**
 * Generates a URL to download the archive for the specified scan.
 *
 * The function constructs a string by appending the given `scanId`
 * to the predefined `serverURL` path for archive downloads.
 *
 * @param {string} scanId - The unique identifier of the scan whose archive is to be downloaded.
 * @returns {string} The full URL for downloading the archive corresponding to the provided scan ID.
 */
export const getScanArchiveURI = (scanId) =>
  getFullURI(`/archive/${scanId}`)

/**
 * Constructs a URL to refresh the database optionally with a specific scan ID.
 *
 * @param {string} [scanId] - An optional identifier for a specific scan. If provided, it is included as a query parameter in the URL.
 * @returns {string} A formatted URL to trigger the database refresh, including the scan ID if specified.
 */
export const refreshDatabase = (scanId) =>
  getFullURI(`/refresh${scanId ? `?scan_id=${scanId}` : ''}`)
