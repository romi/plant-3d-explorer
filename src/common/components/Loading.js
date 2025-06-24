import React from 'react'
import { FormattedMessage } from 'react-intl'
import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'

// Define animations
const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`

// Styled components
const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    background-color: #f8f9fa;
    animation: ${fadeIn} 0.3s ease-in;
`

const Spinner = styled.div`
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
`

const LoadingText = styled.div`
    font-size: 1.5rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 10px;
`

const LoadingMessage = styled.div`
    font-size: 1rem;
    color: #666;
    max-width: 400px;
    text-align: center;
`

/**
 * An enhanced loading component that displays a spinner and informative text
 * while the application is loading or checking API status.
 *
 * @param {Object} props - Component props
 * @param {string} [props.message] - Optional specific loading message to display
 * @return {JSX.Element} A styled loading component with animation
 */
function Loading ({ message }) {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>
        <FormattedMessage id='misc-loading' />
      </LoadingText>
      <LoadingMessage>
        {message ||
          <FormattedMessage id='misc-loading-message' defaultMessage='Please wait while we prepare your data...' />}
      </LoadingMessage>
    </LoadingContainer>
  )
}

export default Loading
