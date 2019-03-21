import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { omit } from 'lodash'
import { format } from 'date-fns'
import { FormattedMessage } from 'react-intl'
import { orderBy } from 'natural-orderby'

import styled from '@emotion/styled'

import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

import { useSorting } from 'flow/scans/accessors'

import { green, darkGreen } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

import MeshIcon from 'common/assets/ico.mesh.21x21.svg'
import PointCloudIcon from 'common/assets/ico.point_cloud.21x21.svg'
import SekeletonIcon from 'common/assets/ico.skeleton.21x21.svg'
import NodeIcon from 'common/assets/ico.internodes.21x21.svg'

const Blocks = styled.div({
  '& > :nth-child(even)': {
    background: 'rgba(151, 172, 163, 0.1)'
  }
})

const Block = styled.div({
  width: '100%',
  padding: 5,
  borderRadius: 3,
  color: green,
  textDecoration: 'none',
  outlineColor: green,
  justifyContent: 'space-between',
  alignItems: 'center',

  display: 'grid',
  gridTemplateColumns: '105px 9.8% 15.7% 10% 10.3% 11% 300px',
  gridColumnGap: 16,

  '&:hover': {
    background: 'rgba(151, 172, 163, 0.2)'
  },
  transition: 'all 0.15s ease',

  '&:focus': {
    outline: 'none'
  }
})

const Thumbail = styled.div({
  width: 105,
  height: 90,
  borderRadius: 2,
  backgroundSize: 'auto 110%',
  backgroundPosition: 'center'
}, (props) => {
  return {
    backgroundImage: `url(${props.uri})`
  }
})

const Name = styled.div({
  fontSize: 15,
  minHeight: 45,
  color: darkGreen,
  lineHeight: '18px',
  fontWeight: 700,
  padding: 5
})

const Options = styled.div({
  width: 'auto',
  fontSize: 15,
  minHeight: 45,
  color: darkGreen,
  lineHeight: '18px',
  padding: 5
})

const DataLayers = styled.div({
  width: 120,
  display: 'flex',
  justifyContent: 'space-between',
  lineHeight: 0,
  marginTop: -5
})

const Icon = styled((props) => <div {...omit(props, ['isActive'])} />)({
  display: 'inline-block',
  width: 21,
  height: 21,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center'
}, (props) => {
  return {
    backgroundImage: `url(${props.src})`,
    opacity: props.isActive ? 1 : 0.3,
    filter: props.isActive ? 'none' : 'grayscale(100%)'
  }
})

const Actions = styled.div({
  width: 230,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginLeft: '42px'
})

const OpenButton = styled((props) => <Link {...props} />)({
  display: 'inline-block',
  padding: '9px 38px',
  fontSize: 15,
  textAlign: 'center',
  background: green,
  borderRadius: 2,
  border: 'none',
  color: 'white',
  outline: 'none',
  cursor: 'pointer',
  textDecoration: 'none',

  '&:focus, &:hover': {
    textDecoration: 'underline',
    filter: 'saturate(130%)'
  },

  '&:active': {
    background: darkGreen
  }
})

const Links = styled.div({
  display: 'inline-block',
  width: 110,
  paddingLeft: 8
})

export const DocLink = styled.a({
  display: 'block',
  fontSize: 13,
  lineHeight: '18px',
  color: green,
  outline: 'none',

  '&:focus, &:hover': {
    textDecoration: 'none'
  }
})

const Item = memo(({ item }) => {
  return <Block>
    <Thumbail uri={item.thumbnailUri} />
    <Name>{item.metadata.plant}</Name>
    <Options>{item.metadata.species}</Options>
    <Options>{item.metadata.environment}</Options>
    <Options>
      {
        format(
          new Date(item.metadata.date),
          'MMM DD YYYY HH:mm:ss'
        )
      }
    </Options>
    <DataLayers>
      <Tooltip>
        <Icon src={MeshIcon} isActive={item.hasMesh} />
        <TooltipContent>
          <H3>
            <FormattedMessage id='tooltip-mesh' />
          </H3>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <Icon src={PointCloudIcon} isActive={item.hasPointCloud} />
        <TooltipContent>
          <H3>
            <FormattedMessage id='tooltip-pointcloud' />
          </H3>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <Icon src={SekeletonIcon} isActive={item.hasSkeleton} />
        <TooltipContent>
          <H3>
            <FormattedMessage id='tooltip-skeleton' />
          </H3>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <Icon src={NodeIcon} isActive={item.hasAngleData} />
        <TooltipContent>
          <H3>
            <FormattedMessage id='tooltip-organs' />
          </H3>
        </TooltipContent>
      </Tooltip>
    </DataLayers>

    <Actions>
      <Links>
        <DocLink href={item.metadata.files.archive} target='_blank'>
          <FormattedMessage id='scanlist-link-download' />
        </DocLink>
        <DocLink href={item.metadata.files.metadatas} target='_blank'>
          <FormattedMessage id='scanlist-link-metadata' />
        </DocLink>
      </Links>
      <OpenButton to={`/viewer/${item.id}`}>
        <FormattedMessage id='scanlist-cta' />
      </OpenButton>
    </Actions>
  </Block>
})

export default memo(function (props) {
  const [items] = useState(props.items)
  const [sorting] = useSorting()

  const sortingFn = sorting.type === 'natural'
    ? (items) => orderBy(
      items,
      (d) => {
        switch (sorting.label) {
          case 'name':
            return d.metadata.plant
          case 'species':
            return d.metadata.species
          case 'environment':
            return d.metadata.environment
        }
      },
      sorting.method
    )
    : (items) => items.sort((a, b) => {
      return sorting.method === 'asc'
        ? new Date(a.metadata.date) - new Date(b.metadata.date)
        : new Date(b.metadata.date) - new Date(a.metadata.date)
    })

  return <Blocks>
    {
      sortingFn(items).map((item) => {
        return <Item key={item.id} item={item}>
          {item.id}
        </Item>
      })
    }
  </Blocks>
})

/**
|--------------------------------------------------
| Multiline ellipsis in pure CSS
| @TODO to remove
|--------------------------------------------------

const Elipsifier = (component) => styled(component)({
  overflow: 'hidden',
  position: 'relative',
  lineHeight: '18px',
  maxHeight: 54,
  textAlign: 'justify',
  marginRight: '-1em',
  paddingRight: '1em',

  '&:before': {
    content: '"..."',
    position: 'absolute',
    right: 0,
    bottom: 0
  },

  '&:after': {
    content: '""',
    position: 'absolute',
    right: 0,
    width: '1em',
    height: '1em',
    marginTop: '0.2em',
    background: 'white'
  }
})

*/
