import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'
import { serverURL } from 'common/api'
import Loading from './Loading'

const APIStatusCheck = ({ children, fallback }) => {
  const [apiAvailable, setApiAvailable] = useState(true)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Attempt to connect to the API server
        await axios.get(`${serverURL}/scans_info`, { timeout: 5000 })
        setApiAvailable(true)
      } catch (error) {
        console.error('API server is not available:', error)
        setApiAvailable(false)
      } finally {
        setChecking(false)
      }
    }

    checkApiStatus()
  }, [])

  if (checking) {
    // Use the provided fallback or default to Loading component
    return fallback || <Loading message='Checking API availability...' />
  }

  if (!apiAvailable) {
    return (<div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f44336',
      color: 'white',
      padding: '24px',
      textAlign: 'center',
      zIndex: 9999,
      fontSize: '2rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }}>
      <FormattedMessage
        id='api-unavailable'
        defaultMessage='REST API server is not available. Please check that the server at {serverUrl} is running.'
        values={{ serverUrl: serverURL }}
      />
    </div>)
  }

  return children
}

export default APIStatusCheck
