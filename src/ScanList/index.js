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

const Container = styled.div({
  margin: 'auto',
  maxWidth: 1420,
  padding: '80px 60px',
  height: '100%',
  color: green,
  position: 'relative'
})

const AppHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 50
})

const AppIntro = styled(H2)({
  display: 'block',
  color: green
})

const TaintedFormattedMessage = styled((props) => <span className={props.className}>
  <FormattedMessage {...omit(props, ['classNaame'])} />
</span>
)({}, (props) => {
  return {
    color: props.color
  }
})

const ClearButton = styled((props) => {
  return <button type='button' {...props}>
    <img src={closePicto} alt='' />
  </button>
})({
  border: 'none',
  width: 20,
  height: 20,
  transition: 'all 0.15s ease',
  cursor: 'pointer',
  outline: 'none',
  marginLeft: 7,
  opacity: 1,
  padding: 0,

  '&:focus, &:hover': {
    transform: 'scale(1.25)',
    opacity: 0.9
  }
})

const ResultsTitleContainer = styled.div({
  borderBottom: '1px solid rgba(21,119,65, 0.15)',
  marginTop: 51,
  height: 65
})

function ResultsTitle ({ scans = [], search, clear }) {
  return <ResultsTitleContainer data-testid='results-title'>
    <H1>
      { scans
        ? <div>
          <TaintedFormattedMessage
            color={(search) ? grey : green}
            id='scanlist-title'
            values={{
              NB_SCANS: scans.length
            }}
          />
          {
            (search && search !== '') &&
              <div style={{ display: 'inline' }}>
                <TaintedFormattedMessage color={grey} id='scanlist-title-link' />
                <FormattedMessage
                  id='scanlist-title-search-value'
                  values={{
                    SEARCH: search
                  }}
                />
                <ClearButton onClick={clear} data-testid='clear-button' />
              </div>
          }
        </div>
        : ''
      }
    </H1>
  </ResultsTitleContainer>
}

function Results (props) {
  const [search] = useState(props.search)
  const [filtering] = useFiltering()

  const filteringFn = (elem) => {
    let test = true
    for (let key in filtering) {
      if (filtering[key]) {
        test = test && elem[key]
      }
    }
    return test
  }

  const scans = props.scans.filter(filteringFn)

  return <div data-testid='results'>
    <ResultsTitle
      scans={scans}
      search={search}
      clear={props.clear}
    />
    <Sorting />
    <List items={scans} />
  </div>
}

export default function () {
  const [search, setSearch] = useSearchQuery()
  const [scans] = useScans(search)

  const elements = [
    scans
      ? scans.length
        ? {
          key: 'scans',
          element: <Results
            search={search}
            clear={() => setSearch(null)}
            scans={scans}
          />
        }
        : {
          key: 'no-results',
          element: <ResultsTitle
            scans={[]}
            search={search}
            clear={() => setSearch(null)}
          />
        }
      : {
        key: 'loading',
        element: ''
      }
  ]

  return <Container>
    <Global styles={{
      'body': {
        overflowY: 'scroll'
      }
    }} />
    <div style={{ position: 'relative' }}>
      <AppHeader>
        <img src={Logo} alt='' />

        <AppIntro>
          <FormattedMessage id='app-intro' />
        </AppIntro>
      </AppHeader>

      <Search search={search} onSearch={setSearch} />

      <br />

      <div key={'result'}>
        {elements[0].element}
      </div>
    </div>
  </Container>
}
