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
 * API endpoints and utility functions for interacting with the PlantDB REST API.
 * This module provides:
 * - Base URL configuration
 * - API endpoint constants
 * - URL construction utilities
 * - Functions to generate specific endpoint URLs for various resources (scans, images, etc.)
 */

/**
 * The URL of the PlantDB REST API that the application will interact with for API calls.
 * This value is taken from the environment variable `REACT_APP_API_URL`.
 * If the environment variable is not set, it defaults to `http://localhost:5000`.
 *
 * Example scenarios:
 * - In a development environment, the URL will default to `http://localhost:5000`.
 * - In a production environment, this should be set to the respective API URL using `REACT_APP_API_URL`.
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

// Path segment constants to avoid repetition and improve maintainability
const API_PATHS = {
  SCANS: '/scans',
  SCANS_INFO: '/scans_info',
  FILES: '/files',
  IMAGE: '/image',
  POINTCLOUD: '/pointcloud',
  MESH: '/mesh',
  SKELETON: '/skeleton',
  SEQUENCE: '/sequence',
  ARCHIVE: '/archive',
  REFRESH: '/refresh'
}

/**
 * Safely joins URL segments, ensuring there are no duplicate or missing slashes.
 *
 * @param {string} base - The base URL.
 * @param {string} path - The path to append (with or without leading slash).
 * @returns {string} Properly joined URL.
 */
const joinUrlPaths = (base, path) => {
  // Remove trailing slash from base if present
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base
  // Ensure path starts with slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

/**
 * Constructs and returns a full URI by appending the provided relative path to the API base URL.
 *
 * @param {string} path - The relative path to the resource.
 * @returns {string} The full URI to access the resource.
 */
export const getFullURI = (path) => joinUrlPaths(API_BASE_URL, path)

/**
 * A string representing the URI endpoint for accessing scan-related operations on the server.
 *
 * @const {string}
 */
export const scansURI = getFullURI(API_PATHS.SCANS_INFO)

/**
 * Constructs a URI query string for scans based on the provided search and fuzzy parameters.
 *
 * @param {string} [searchTerm] - The search term to filter the results. If provided, it will be added as a query parameter `filterQuery` in the URI.
 * @param {boolean} [useFuzzySearch] - Determines if fuzzy search should be applied. If true, it will append `&fuzzy=true` to the URI.
 * @returns {string} The constructed URI query string with the optional search and fuzzy parameters.
 */
export const scansURIQuery = (searchTerm, useFuzzySearch) =>
  `${getFullURI(API_PATHS.SCANS_INFO)}${searchTerm ? `?filterQuery=${searchTerm}` : ''}${useFuzzySearch ? `&fuzzy=${useFuzzySearch}` : ''}`

// File and scan access functions
/**
 * Concatenates and constructs a URL to retrieve a specific scan file.
 *
 * @param {string} scanId - The identifier for the desired scan.
 * @param {string} filePath - The path or subdirectory where the file is located.
 * @returns {string} The complete URL for accessing the scan file.
 */
export const getScanFile = (scanId, filePath) =>
  getFullURI(`${API_PATHS.FILES}/${scanId}/${filePath}`)

/**
 * Retrieves the full file URL by appending the specified file path to the API base URL.
 *
 * @param {string} filePath - The relative path of the file, starting from the root directory.
 * @returns {string} The full URL of the file combining the API's base URL and the file path.
 */
export const getFileURI = (filePath) =>
  getFullURI(`${API_PATHS.FILES}/${filePath}`)

/**
 * Constructs the URI to access a specific scan based on the given ID.
 *
 * @param {string} scanId - The identifier of the scan to retrieve.
 * @returns {string} The complete URI to access the scan.
 */
export const getScanURI = (scanId) =>
  getFullURI(`${API_PATHS.SCANS}/${scanId}`)

/**
 * Constructs the URL to retrieve metadata for a specific scan.
 *
 * @param {string} scanId - The identifier of the scan for which metadata is requested.
 * @returns {string} The fully constructed URL pointing to the metadata file of the specified scan.
 */
export const getScanMetadataURI = (scanId) =>
  getFullURI(`${API_PATHS.FILES}/${scanId}/metadata/metadata.json`)

// Media-specific access functions
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
  getFullURI(`${API_PATHS.IMAGE}/${scanId}/${filesetId}/${fileId}?size=${size}`)

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
  getFullURI(`${API_PATHS.POINTCLOUD}/${scanId}/${filesetId}/${fileId}?size=${size}`)

/**
 * Constructs a URL string to retrieve a 3D mesh file.
 *
 * @param {string} scanId - The unique identifier for the scan.
 * @param {string} filesetId - The unique identifier for the fileset within the scan.
 * @param {string} fileId - The unique identifier for the specific file within the fileset.
 * @returns {string} A URL string pointing to the specified mesh file with the original size.
 */
export const getScanMeshURI = (scanId, filesetId, fileId) =>
  getFullURI(`${API_PATHS.MESH}/${scanId}/${filesetId}/${fileId}?size=orig`)

/**
 * Constructs a URL to retrieve the skeleton data for a specific scan.
 *
 * @param {string} scanId - The unique identifier for the scan whose skeleton data is requested.
 * @returns {string} The complete URL to access the skeleton data for the specified scan.
 */
export const getScanSkeletonURI = (scanId) =>
  getFullURI(`${API_PATHS.SKELETON}/${scanId}`)

/**
 * Constructs a URL for retrieving a sequence based on the given scan ID and type.
 *
 * @param {string} scanId - The unique identifier for the scan.
 * @param {string} [type='all'] - The type of sequence to retrieve. Defaults to 'all'.
 * @returns {string} The constructed URL for the sequence.
 */
export const getScanSequenceURI = (scanId, type = 'all') =>
  getFullURI(`${API_PATHS.SEQUENCE}/${scanId}?type=${type}`)

/**
 * Generates a URL to download the archive for the specified scan.
 *
 * @param {string} scanId - The unique identifier of the scan whose archive is to be downloaded.
 * @returns {string} The full URL for downloading the archive corresponding to the provided scan ID.
 */
export const getScanArchiveURI = (scanId) =>
  getFullURI(`${API_PATHS.ARCHIVE}/${scanId}`)

/**
 * Constructs a URL to refresh the database optionally with a specific scan ID.
 *
 * @param {string} [scanId] - An optional identifier for a specific scan. If provided, it is included as a query parameter in the URL.
 * @returns {string} A formatted URL to trigger the database refresh, including the scan ID if specified.
 */
export const refreshDatabase = (scanId) =>
  getFullURI(`${API_PATHS.REFRESH}${scanId ? `?scan_id=${scanId}` : ''}`)
