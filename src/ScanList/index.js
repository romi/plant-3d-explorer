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
import React, { useState } from 'react'
import { omit } from 'lodash'
import { FormattedMessage } from 'react-intl'
import { Global } from '@emotion/core'

import styled from '@emotion/styled'

import { H1, H2 } from 'common/styles/UI/Text/titles'
import { green, grey } from 'common/styles/colors'

import { useSearchQuery, useScans, useFiltering } from 'flow/scans/accessors'

import Logo from './assets/ico.logo.160x30.svg'
import closePicto from 'common/assets/ico.deselect.20x20.svg'

import Search from './search'
import List from './list'
import Sorting from './sorting'

/**
 * Important note : EVERYTHING here is hardcoded.
 * A complete rework of the ScanList is needed in order to make things cleaner.
 * The important information here is that you cannot change anything regarding
 * the columns and the filters with serious hassle.
 * This article can provide a good starting point : https://blog.logrocket.com/creating-react-sortable-table/
 * */

/**
 * Styled container component with specific styling properties.
 *
 * This container is designed to be centrally aligned and has fixed dimensions.
 * It includes styling for text color, padding, and relative positioning to enable
 * absolute positioning for its child elements.
 *
 * Properties:
 * - `margin`: Centers the container on the page.
 * - `maxWidth`: Sets the maximum width of the container to 1420 pixels.
 * - `padding`: Defines the padding inside the container with values `80px 60px`.
 * - `height`: Sets the height of the container to 100% of its parent.
 * - `color`: Sets the color of the text inside the container to green.
 * - `position`: Allows child elements of the container to use absolute positioning.
 */

const Container = styled.div({
  // Center container and set fixed dimensions
  margin: 'auto',
  maxWidth: 1420,
  padding: '80px 60px',
  height: '100%',
  color: green, // Text color
  position: 'relative' // Allow child elements to use absolute positioning
})

/**
 * A styled component representing the application's header section.
 *
 * The `AppHeader` is a flex container designed to align its child components
 * horizontally with space distributed evenly between them.
 * It includes center alignment for child elements and spacing below the header.
 *
 * Styling:
 * - `display: flex;` enables a flexible layout for horizontal alignment.
 * - `justify-content: space-between;` distributes space evenly between child elements.
 * - `align-items: center;` centers the child components vertically.
 * - `padding-bottom: 50;` adds spacing below the header section.
 */
const AppHeader = styled.div({
  // Flex container to align header components
  display: 'flex',
  justifyContent: 'space-between', // Evenly distribute header content
  alignItems: 'center',
  paddingBottom: 50 // Add spacing below header
})

/**
 * AppIntro is a styled component based on the H2 element.
 * It applies block styling with a specific color.
 * The text will be displayed in block format and will have a green color.
 */
const AppIntro = styled(H2)({
  // Block styling for intro with a specific color
  display: 'block',
  color: green
})

/**
 * TaintedFormattedMessage is a styled component based on the `FormattedMessage` component.
 * It allows for dynamic styling by applying a color to the rendered text based on the
 * `color` prop passed to it. This component also ensures that all props, except
 * `className`, are forwarded properly to the `FormattedMessage` component.
 *
 * @type {Function}
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.className - The className used for styling the component.
 * @param {string} [props.color] - The dynamic text color applied via style.
 */
const TaintedFormattedMessage = styled((props) => (
  <span className={props.className}>
    {/* Spread all props except `className` */}
    <FormattedMessage {...omit(props, ['className'])} />
  </span>
))({}, (props) => {
  return {
    // Dynamically set the text color based on props
    color: props.color
  }
})

/**
 * ClearButton is a styled button component used to render a button with an image inside.
 * It includes default styling and interactive hover/focus effects for better user experience.
 *
 * Characteristics:
 * - Button is styled without borders and default dimensions of 20x20 pixels.
 * - Includes a smooth 0.15s transition effect for hover and focus states.
 * - Enhances interactivity by enlarging slightly and reducing opacity when hovered over or focused.
 * - Maintains a concise and minimalist design with no padding or borders.
 *
 * Usage:
 * - Typically used as a clear or close action button, showcasing an image inside.
 * - The image source is provided via the `closePicto` variable.
 */
const ClearButton = styled((props) => {
  return (
    <button type='button' {...props}>
      {/* Simple button with an image */}
      <img src={closePicto} alt='' />
    </button>
  )
})({
  // Default styling
  border: 'none',
  width: 20,
  height: 20,
  transition: 'all 0.15s ease', // Smooth animations
  cursor: 'pointer', // Pointer cursor on hover
  outline: 'none',
  marginLeft: 7,
  opacity: 1,
  padding: 0,
  // Enhanced styling on hover or focus
  '&:focus, &:hover': {
    transform: 'scale(1.25)', // Slightly enlarge button
    opacity: 0.9 // Reduce opacity slightly
  }
})

/**
 * ResultsTitleContainer is a styled container component designed to encapsulate
 * the title section in the results view. It includes styling properties to ensure
 * proper spacing, alignment, and visual separation from other elements.
 *
 * Styling Details:
 * - Adds a subtle border at the bottom for visual separation.
 * - Provides margin from the previous content to maintain layout consistency.
 * - Ensures a fixed height to align with design requirements.
 */
const ResultsTitleContainer = styled.div({
  borderBottom: '1px solid rgba(21,119,65, 0.15)', // Subtle border
  marginTop: 51, // Space from previous content
  height: 65 // Fixed height for alignment
})

/**
 * Renders the ResultsTitle component that displays the title information for a list of scans.
 * The title provides dynamic information including the number of scans and the active search query.
 * Also includes functionality to clear the current search.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} [props.scans=[]] - An array representing the list of scans. Defaults to an empty array.
 * @param {string} props.search - The active search query string used to filter scans.
 * @param {Function} props.clear - A callback function to clear the current search.
 * @return {JSX.Element} The rendered ResultsTitle component.
 */
function ResultsTitle ({ scans = [], search, clear }) {
  return (
    <ResultsTitleContainer data-testid='results-title'>
      <H1>
        {scans ? ( // Check if there are scans
          <div>
            <TaintedFormattedMessage
              color={search ? grey : green} // Adjust color based on search status
              id='scanlist-title'
              values={{
                NB_SCANS: scans.length // Dynamically add scan count
              }}
            />
            {search && search !== '' && ( // Additional block if search is active
              <div style={{ display: 'inline' }}>
                <TaintedFormattedMessage
                  color={grey} // Grey text for link
                  id='scanlist-title-link'
                />
                <FormattedMessage
                  id='scanlist-title-search-value'
                  values={{
                    SEARCH: search // Display the active search query
                  }}
                />
                {/* Clear button to reset search */}
                <ClearButton onClick={clear} data-testid='clear-button' />
              </div>
            )}
          </div>
        ) : (
          '' // Empty content for no scans
        )}
      </H1>
    </ResultsTitleContainer>
  )
}

/**
 * Renders the Results component, which displays a filtered and sorted list of items
 * based on the current search and filtering criteria.
 *
 * @param {Object} props - The properties passed to the Results component.
 * @param {Array} props.scans - The list of scans to be filtered and displayed.
 * @param {string} props.search - The current search query used for filtering.
 * @param {Function} props.clear - A function to clear search or filter conditions.
 * @return {JSX.Element} The rendered Results component.
 */
function Results (props) {
  // Access search and filtering state via hooks
  const [search] = useState(props.search)
  const [filtering] = useFiltering()

  // Function to filter scans based on active filter criteria
  const filteringFn = (elem) => {
    let test = true
    for (let key in filtering) {
      if (filtering[key]) {
        test = test && elem[key] // Ensure all filter conditions are true
      }
    }
    return test // Return whether the element passes all filters
  }

  // Filter the scans using the filtering function
  const scans = props.scans.filter(filteringFn)

  return (
    <div data-testid='results'>
      <ResultsTitle scans={scans} search={search} clear={props.clear} />
      <Sorting /> {/* Component to handle sorting */}
      <List items={scans} /> {/* List the filtered scans */}
    </div>
  )
}

/**
 * This function renders an application interface to manage and display search results.
 *
 * It includes:
 * - A search bar to input queries.
 * - A hook to manage the search query state.
 * - A hook to retrieve scans dynamically based on the search query.
 * - A results section displaying search results or appropriate messages based on the searches conducted.
 *
 * Return Structure:
 * - `Container`: Wrapper component for the entire application UI.
 * - `Global`: Component to define global styles (ensures scrollbar functionality).
 * - `AppHeader`: Component containing the application header with a logo and an introduction message.
 * - `Search`: Component for the search bar with a callback to update the search query state.
 * - `Results` or `ResultsTitle`: Component to display either the search results or a "no results" message, depending on the state of the scan data.
 *
 * Internal Hooks:
 * - `useSearchQuery`: Manages the search query state.
 * - `useScans`: Fetches scan data relevant to the current search query.
 *
 * Dynamic Elements:
 * - The `elements` array contains conditional configurations for UI rendering. Based on the retrieved scans, it determines which component (loading placeholder, results, or no-results title) to render.
 */
export default function () {
  // Hook to manage search query
  const [search, setSearch] = useSearchQuery()

  // Hook to load enhanced scans based on the search query
  const [scans] = useScans(search)

  // Define dynamic elements based on the scans and search state
  const elements = [
    scans
      ? scans.length
        ? {
          key: 'scans',
          // Pass active scans and reset method to Results component
          element: (
            <Results
              search={search}
              clear={() => setSearch(null)} // Clear search callback
              scans={scans}
            />
          )
        }
        : {
          key: 'no-results',
          // Render title component with no scans available
          element: (
            <ResultsTitle
              scans={[]} // Empty scans
              search={search}
              clear={() => setSearch(null)}
            />
          )
        }
      : {
        key: 'loading',
        element: '' // Placeholder for loading state
      }
  ]

  return (
    <Container>
      {/* Global styles to ensure scrollbar is visible */}
      <Global
        styles={{
          body: {
            overflowY: 'scroll'
          }
        }}
      />
      {/* Position the main content */}
      <div style={{ position: 'relative' }}>
        <AppHeader>
          {/* App header with logo and intro message */}
          <img src={Logo} alt='' />
          <AppIntro>
            <FormattedMessage id='app-intro' />
          </AppIntro>
        </AppHeader>
        {/* Search bar with callback to handle input */}
        <Search search={search} onSearch={setSearch} />
        <br />
        {/* Render result-related elements */}
        <div key={'result'}>{elements[0].element}</div>
      </div>
    </Container>
  )
}
