
export const serverURL = process.env.NODE_ENV === 'production'
  ? ''
  : 'https://localhost:5000'

export const scansURI = serverURL + '/scans'
export const scansURIQuery = (search) => `${scansURI}${search ? `?filterQuery=${search}` : ''}`
export const getScanFile = (path) => serverURL + path
export const getScanURI = (id) => serverURL + '/scans/' + id
export const getScanPhotoURI = (path) => serverURL + path
