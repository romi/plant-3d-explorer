import React, { useState, memo } from 'react'
import { omit } from 'lodash'
import { FormattedMessage } from 'react-intl'
import { Transition } from 'react-spring/renderprops'

import styled from '@emotion/styled'

import { H1 } from 'common/styles/UI/Text/titles'
import { green, grey } from 'common/styles/colors'

import { useSearchQuery, useScans } from 'flow/scans/accessors'

import Logo from './assets/ico.logo.160x30.svg'
import closePicto from './assets/ico.deselect.20x20.svg'

import Search from './search'
import List from './list'
import Sorting from './sorting'

const Container = styled.div({
  margin: 'auto',
  maxWidth: 1270,
  padding: '80px 60px',
  height: '100%',
  color: green,
  position: 'relative'
})

const AppTitle = styled.div({
  height: 100
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
  return <ResultsTitleContainer>
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
                <ClearButton onClick={clear} />
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

  return <div>
    <ResultsTitle
      scans={props.scans}
      search={search}
      clear={props.clear}
    />
    <Sorting />
    <List items={props.scans} />
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
    <div style={{ position: 'relative' }}>
      <AppTitle>
        <img src={Logo} alt='' />
      </AppTitle>

      <Search search={search} onSearch={setSearch} />

      <br />

      <Filters />

      <Transition
        items={elements} keys={item => item.key}
        from={{
          transform: 'translate3d(' + (!search ? -window.innerWidth : window.innerWidth) + 'px,0px,0) skewX(-5deg)',
          opacity: 0.9,
          deviation: 30
        }}
        enter={{
          transform: 'translate3d(0,0px,0) skewX(0deg)',
          opacity: 1,
          deviation: 0
        }}
        leave={{
          transform: 'translate3d(' + (!search ? window.innerWidth : -window.innerWidth) + 'px,0px,0) skewX(5deg)',
          opacity: 0.9,
          deviation: 30
        }}
      >
        {(item) => (props) => {
          return <div
            style={{
              ...omit(props, ['deviation']),
              position: 'absolute',
              width: '100%',
              filter: `url("#motionblur-${Math.round(props.deviation)})`
            }}
            key={item.key}
          >
            {item.element}
          </div>
        }}
      </Transition>
    </div>
  </Container>
}

const Filters = memo(() => {
  return <svg xmlns='http://www.w3.org/2000/svg' version='1.1' height={0} style={{ position: 'absolute' }}>
    <defs>
      {
        Array(30).fill().map((_, i) => {
          return <filter key={`motionblur-${i}`} id={`motionblur-${i}`}>
            <feGaussianBlur in='SourceGraphic' stdDeviation={i + ',0'} />
          </filter>
        })
      }
    </defs>
  </svg>
})
