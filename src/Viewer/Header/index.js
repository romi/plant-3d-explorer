import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { format } from 'date-fns'

import { H2, H3 } from 'common/styles/UI/Text/titles'
import { green, darkGreen } from 'common/styles/colors'
import { landingUrl } from 'common/routing'

import { useScan } from 'flow/scans/accessors'

import { DocLink } from 'ScanList/list/index'

import Logo from './assets/ico.logo_minified.25x31.svg'
import chevronIco from './assets/ico.chevron.8x12.svg'

const Container = styled.div({
  width: '100%',
  height: 80,
  background: 'white',
  padding: '0px 40px',

  gridTemplateColumns: '50px 29.5% 18% 15.2% 17% 220px',
  display: 'grid',
  gridColumnGap: 0
})

const Column = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%'
})

const AllScans = styled((props) => <Link {...props} />)({
  textDecoration: 'none',
  color: green,

  '&:hover': {
    textDecoration: 'underline'
  }
})
const BackH2 = styled(H2)({
  color: green
})

const Chevron = styled.img({
  marginLeft: 13,
  marginRight: 13,
  marginTop: 2
})

const TypeWording = styled(H3)({
  marginRight: 11
})

const TypeValue = styled(H3)({
  textTransform: 'none',
  fontWeight: 700,
  color: darkGreen,
  fontSize: 13,
  letterSpacing: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

const MarginedDocLink = styled(DocLink)({
  marginRight: 10
})

export default function () {
  const [scan] = useScan()
  return <Container>
    <Column>
      <img src={Logo} alt='' />
    </Column>
    <Column>
      <AllScans to={landingUrl}>
        <BackH2>
          <FormattedMessage id='header-back' />
        </BackH2>
      </AllScans>
      <Chevron src={chevronIco} />
      <H2>
        {scan && scan.id}
      </H2>
    </Column>
    <Column>
      <TypeWording>
        <FormattedMessage id='scanlist-sort-species' />
      </TypeWording>
      <TypeValue>
        {scan && scan.metadata.species}
      </TypeValue>
    </Column>
    <Column>
      <TypeWording>
        <FormattedMessage id='scanlist-sort-environment' />
      </TypeWording>
      <TypeValue>
        {scan && scan.metadata.environment}
      </TypeValue>
    </Column>
    <Column>
      <TypeWording>
        <FormattedMessage id='scanlist-sort-date' />
      </TypeWording>
      <TypeValue>
        {scan && format(
          new Date(scan.metadata.date),
          'MMM DD YYYY HH:mm:ss'
        )}
      </TypeValue>
    </Column>
    <Column>
      {
        scan && <MarginedDocLink href={scan.metadata.files.archive} target='_blank'>
          <FormattedMessage id='scanlist-link-download' />
        </MarginedDocLink>
      }
      {
        scan && <MarginedDocLink href={scan.metadata.files.metadatas} target='_blank'>
          <FormattedMessage id='scanlist-link-metadata' />
        </MarginedDocLink>
      }

    </Column>
  </Container>
}
