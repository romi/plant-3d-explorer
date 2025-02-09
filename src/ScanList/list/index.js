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
import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom'
import { omit } from 'lodash'
import { format } from 'date-fns'
import { FormattedMessage } from 'react-intl'
import { orderBy } from 'natural-orderby'

import styled from '@emotion/styled'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

import { useSorting } from 'flow/scans/accessors'

import { darkGreen, green, red } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

import MeshIcon from 'common/assets/ico.mesh.21x21.svg'
import PointCloudIcon from 'common/assets/ico.point_cloud.21x21.svg'
import SekeletonIcon from 'common/assets/ico.skeleton.21x21.svg'
import NodeIcon from 'common/assets/ico.internodes.21x21.svg'
import SegmentedPointCloudIcon from 'common/assets/ico.segmented_point_cloud.21x21.svg'

import DatasetErrorIcon from 'ScanList/assets/ico.dataset_error.90x90.svg'

const Blocks = styled.div({
  // Apply a lighter background for every even child of the container
  '& > :nth-of-type(even)': {
    background: 'rgba(151, 172, 163, 0.1)'
  }
})

const Block = styled.div({
  // A general layout for individual blocks
  width: '100%',
  padding: 5,
  borderRadius: 3,
  color: green, // Text and border color
  textDecoration: 'none',
  outlineColor: green,
  justifyContent: 'space-between', // Alignment for grid elements
  alignItems: 'center',
  display: 'grid', // Use CSS grid layout
  gridTemplateColumns: '105px 9.8% 15.7% 10% 10.3% 11% 5% 300px', // Define specific grid column sizes
  gridColumnGap: 16, // Space between columns
  '&:hover': {
    background: 'rgba(151, 172, 163, 0.2)' // Highlight on hover
  },
  transition: 'all 0.15s ease', // Smooth transition for hover effect
  '&:focus': {
    outline: 'none' // Remove outline when focused
  }
})

const Thumbnail = styled.div({
  // Thumbnail styles define the image preview for items
  width: 105,
  height: 90,
  borderRadius: 2,
  backgroundSize: 'auto 110%',
  backgroundPosition: 'center' // Center the background image
}, (props) => {
  return {
    // Use props to dynamically set the background image
    backgroundImage: `url(${props.uri})`
  }
})

const Name = styled.div({
  // Styling for the item name
  fontSize: 15,
  minHeight: 45,
  color: darkGreen, // Darker green for name
  lineHeight: '18px',
  fontWeight: 700, // Bold font weight
  padding: 5,
  justifyContent: 'centered' // Center align content (typo: this may mean 'center')
})

const Options = styled.div({
  // Styling for an options section in the UI
  width: 'auto',
  fontSize: 15,
  minHeight: 45,
  color: darkGreen,
  lineHeight: '18px',
  padding: 5
})

const DataLayers = styled.div({
  // Container for data layers displayed horizontally
  width: 120,
  display: 'flex',
  justifyContent: 'space-between', // Space between elements
  lineHeight: 0,
  marginTop: -5 // Adjust vertical spacing
})

const MeasuresContainer = styled.div({
  // Similar to DataLayers, but flex elements are arranged vertically
  width: 120,
  display: 'flex',
  flexDirection: 'column', // Stack elements vertically
  justifyContent: 'space-between',
  lineHeight: 0,
  marginTop: -5
})

export const Icon = styled((props) => <div {...omit(props, ['isActive'])} />)({
  // Styling for reusable, clickable icons
  display: 'inline-block',
  width: 21,
  height: 21,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center' // Center the background content
}, (props) => {
  return {
    // Dynamically set icon appearance based on props
    backgroundImage: `url(${props.src})`, // Dynamically set image source
    opacity: props.isActive ? 1 : 0.3, // Opacity for inactive state
    filter: props.isActive ? 'none' : 'grayscale(100%)' // Grayscale filter for inactive icons
  }
})

export const MeasuresText = styled.div({
  // Styling for text displayed alongside measures
  fontSize: 11,
  lineHeight: '28px',
  textTransform: 'uppercase', // Uppercase text
  letterSpacing: 1, // Space between letters
  color: '#DDDDDD', // Light gray color
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  height: 18,
  marginTop: 5,
  padding: 5,
  borderRadius: '3px',
  width: 90,
  '&:*': {
    display: 'inline-block' // Inline-block display for any child elements
  }
}, (props) => {
  return {
    // Dynamically change background and filter based on props
    backgroundColor: props.automated ? '#4200FF' : '#FF555F', // Change background for automated items
    filter: !props.isActive ? 'grayscale(100%)' : 'none' // Grayscale for inactive items
  }
})

const Actions = styled.div({
  // Container for action buttons or controls
  width: 230,
  display: 'flex',
  justifyContent: 'space-between', // Align items with space between
  alignItems: 'center',
  marginLeft: '42px' // Add spacing to the left
})

const OpenButton = styled((props) => <Link {...omit(props, 'isActiveLink')} />)({
  // Styling for a button/link component
  display: 'inline-block',
  padding: '9px 38px',
  fontSize: 15,
  textAlign: 'center',
  borderRadius: 2,
  border: 'none', // No border for the button
  color: 'white', // Button text color
  outline: 'none',
  cursor: 'pointer', // Pointer cursor for interactivity
  textDecoration: 'none', // Remove underline
  background: green, // Default background color
  '&:focus, &:hover': {
    textDecoration: 'underline',
    filter: 'saturate(130%)' // Brighter saturation on hover/focus
  },
  '&:active': {
    background: darkGreen // Change background on click
  }
}, (props) => {
  if (props.isActiveLink) {
    return {
      // Disable pointer events and use red background for inactive links
      pointerEvents: 'none',
      background: red
    }
  }
})

const Links = styled.div({
  // Small section for links
  display: 'inline-block',
  width: 110,
  paddingLeft: 8 // Padding for left alignment
})

const PlantName = styled.div({
  // Styling for a dataset name field
  width: 'auto',
  fontSize: 10,
  minHeight: 45,
  padding: 0,
  margin: 0,
  fontWeight: 400 // Normal font weight
})

/**
 * Styled anchor link component with customized styles.
 *
 * Properties:
 * - `display: 'block'`: Ensures the link is displayed as a full block element.
 * - `fontSize: 13`: Sets the font size for the text in the link.
 * - `lineHeight: '18px'`: Defines line height for enhanced text readability.
 * - `color: green`: Applies green color to the link text for visual consistency.
 * - `outline: 'none'`: Removes the default outline on focus to improve aesthetics.
 *
 * Additional styling:
 * - `&:focus, &:hover`: Removes text underline when the link is hovered or focused
 *   for a cleaner visual appearance.
 */
export const DocLink = styled.a({
  display: 'block', // Ensures the link is displayed as a full block element
  fontSize: 13, // Sets font size for the text in the link
  lineHeight: '18px', // Defines line height for text readability
  color: green, // Applies green color to the link text
  outline: 'none', // Removes the default outline on focus for aesthetics
  // Additional styling for focus and hover states
  '&:focus, &:hover': {
    // Disables text underline when hovering or focusing
    textDecoration: 'none'
  }
})

/**
 * A React functional component that represents an item with its associated metadata, visualizations, and actions.
 * This component displays information such as thumbnails, metadata details, icons for data layers, measures, and actionable links.
 *
 * @component
 *
 * @param {Object} props - The properties object passed to the component.
 * @param {Object} props.item - The item data object that contains metadata and state information.
 *
 * The `item` object contains the following properties:
 * - `metadata` {Object}: Metadata of the item including plant information, species, environment, and date.
 *     - `plant` {string}: The name or identifier of the plant.
 *     - `species` {string}: The species associated with the item.
 *     - `environment` {string}: The environment in which the item exists.
 *     - `date` {string}: ISO string or date format representing the creation or capture time of the item.
 *     - `files` {Object}: File-related metadata such as archive and metadata links.
 *         - `archive` {string}: URL link to the archive file of the dataset.
 *         - `metadata` {string}: URL link to the metadata file of the dataset.
 * - `thumbnailUri` {string}: The URI to the item's thumbnail image.
 * - `id` {string}: Unique identifier of the item.
 * - `error` {boolean}: Flag indicating if the item has an error state.
 * - `hasTriangleMesh` {boolean}: Flag indicating if the dataset includes a triangle mesh layer.
 * - `hasPointCloud` {boolean}: Flag indicating if the dataset includes a point cloud layer.
 * - `hasSegmentedPointCloud` {boolean}: Flag indicating if the dataset includes a segmented point cloud layer.
 * - `hasCurveSkeleton` {boolean */
export const Item = memo(({ item }) => {
  // Condition to handle error state; fallback to `undefined` if there's an error
  const docLinkArchive = item.error ? void (0) : item.metadata.files.archive
  const docLinkMeta = item.error ? void (0) : item.metadata.files.metadata

  // Use an error icon as the thumbnail if there's an error; otherwise, use the item's `thumbnailUri`
  const ThumbnailUri = item.error ? DatasetErrorIcon : item.thumbnailUri

  // The main block of the component, rendered with various sub-components
  return (
    <Block data-testid='item'>
      {/* Thumbnail of the item (either a valid URI or fallback to error icon) */}
      <Thumbnail uri={ThumbnailUri} data-testid='thumbnail' />

      {/* Display item metadata: plant name and dataset name */}
      <Name data-testid='name'>
        <Name>{item.id}</Name>
        <PlantName>{item.metadata.plant}</PlantName>
      </Name>

      {/* Display additional metadata (species, environment, and date) */}
      <Options data-testid='species'>{item.metadata.species}</Options>
      <Options data-testid='env'>{item.metadata.environment}</Options>
      <Options data-testid='date'>
        {
          // Format the item's date metadata (e.g., 'MMM DD YYYY HH:mm:ss')
          format(new Date(item.metadata.date), 'MMM DD YYYY HH:mm:ss')
        }
      </Options>

      {/* Container for data visualization layers */}
      <DataLayers>
        {/* Tooltip for each icon representing key datasets/layers */}
        <Tooltip>
          <Icon
            src={MeshIcon}
            isActive={item.hasTriangleMesh}
            data-testid='mesh-icon'
          />
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-mesh' />
            </H3>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <Icon
            src={PointCloudIcon}
            isActive={item.hasPointCloud}
            data-testid='pc-icon'
          />
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-pointcloud' />
            </H3>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <Icon
            src={SegmentedPointCloudIcon}
            isActive={item.hasSegmentedPointCloud}
            data-testid='spc-icon'
          />
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-segmentedpointcloud' />
            </H3>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <Icon
            src={SekeletonIcon}
            isActive={item.hasCurveSkeleton}
            data-testid='skeleton-icon'
          />
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-skeleton' />
            </H3>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <Icon
            src={NodeIcon}
            isActive={item.hasAnglesAndInternodes}
            data-testid='angles-icon'
          />
          <TooltipContent>
            <H3>
              <FormattedMessage id='tooltip-organs' />
            </H3>
          </TooltipContent>
        </Tooltip>
      </DataLayers>

      {/* Measures of the dataset: automated or manual */}
      <MeasuresContainer>
        <MeasuresText
          automated
          data-testid='auto'
          isActive={item.hasAutomatedMeasures}
        >
          <FormattedMessage id='angles-legend-automated' />
        </MeasuresText>
        <MeasuresText
          data-testid='man'
          isActive={item.hasManualMeasures}
        >
          <FormattedMessage id='angles-legend-manuel' />
        </MeasuresText>
      </MeasuresContainer>

      {/* Actions and links associated with the dataset */}
      <Actions>
        <Links>
          {/* Archive and metadata download links */}
          <DocLink href={docLinkArchive} target='_blank'>
            <FormattedMessage id='scanlist-link-download' />
          </DocLink>
          <DocLink href={docLinkMeta} target='_blank'>
            <FormattedMessage id='scanlist-link-metadata' />
          </DocLink>
        </Links>
        {/* Open dataset viewer button; disabled if there's an error */}
        <OpenButton to={`/viewer/${item.id}`} isActiveLink={item.error}>
          <FormattedMessage id='scanlist-cta' />
        </OpenButton>
      </Actions>
    </Block>
  )
})

export default memo(
  /**
   * A functional component that manages and displays a list of items with sorting functionality.
   *
   * @param {Object} props - The component's props.
   * @param {Array} props.items - The initial list of items to display.
   *
   * @returns {JSX.Element} A list of items rendered as `Item` components within a `Blocks` container.
   *
   * @description
   * This component maintains local state for the list of items and updates it if the length
   * of the incoming `props.items` changes. It utilizes a custom sorting hook to sort the items
   * based on the selected sorting type, criteria, and method. Items are sorted either naturally
   * (by specified metadata properties such as `name`, `species`, or `environment`) or by date.
   * The sorted list is then rendered dynamically, with each item displayed as an `Item` component.
   */
  function (props) {
    // State to manage and track the current list of items
    const [items, setItems] = useState(props.items)

    // Access sorting state and methods using the custom sorting hook
    const [sorting] = useSorting()

    // Update the local 'items' state if the length of 'props.items' changes
    if (props.items.length !== items.length) {
      setItems(props.items)
    }

    // Define the sorting function based on the current sorting type and criteria
    const sortingFn = sorting.type === 'natural'
      ? (items) => orderBy(
        items,
        (d) => {
          // Determine the sort key based on the selected sorting label
          switch (sorting.label) {
            case 'name': // Sort by plant name
              return d.metadata.plant
            case 'species': // Sort by species
              return d.metadata.species
            case 'environment': // Sort by environment
              return d.metadata.environment
            default: // Default to sorting by plant name if no match
              return d.metadata.plant
          }
        },
        sorting.method // 'asc' or 'desc' sorting method
      )
      : (items) => items.sort((a, b) => {
        // If sorting type is not 'natural', sort by date (asc or desc)
        return sorting.method === 'asc'
          ? new Date(a.metadata.date) - new Date(b.metadata.date) // Ascending order
          : new Date(b.metadata.date) - new Date(a.metadata.date) // Descending order
      })

    // Render sorted items as a list of `Item` components within a `Blocks` container
    return (
      <Blocks data-testid='list'>
        {
          sortingFn(items).map((item) => {
            // Render each item with a unique key
            return (
              <Item key={item.id} item={item}>
                {item.id} {/* Display the item's ID */}
              </Item>
            )
          })
        }
      </Blocks>
    )
  }
)
