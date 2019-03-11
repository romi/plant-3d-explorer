
export const serverURL = process.env.NODE_ENV === 'production'
  ? ''
  : 'https://db.romi-project.eu'

export const scansURI = serverURL + '/scans'
export const getScanFile = (path) => serverURL + path
export const getScanURI = (id) => serverURL + '/scans/' + id
export const getScanPhotoURI = (path) => serverURL + path
