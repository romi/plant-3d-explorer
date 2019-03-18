import React, { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { map, omit } from 'lodash'
import { FormattedMessage } from 'react-intl'
import { Transition } from 'react-spring/renderprops'

import { styled } from 'rd/nano'
import useFetch from 'rd/tools/hooks/fetch'

import { scansURIQuery } from 'common/api'
import { H1 } from 'common/styles/UI/Text/titles'
import { green, grey } from 'common/styles/colors'

import { useSearchQuery } from 'flow/scans/accessors'

import Search from './search'
import closePicto from './assets/ico.deselect.20x20.svg'

const Container = styled.div({
  margin: 'auto',
  maxWidth: 1280,
  padding: '80px 60px',
  height: '100%',
  color: green,
  position: 'relative'
})

const AppTitle = styled.div({
  height: 100
})

const Blocks = styled.div({
  ':nth-child(odd)': {
    background: 'rgba(151, 172, 163, 0.1)'
  }
})

const Block = styled((props) => <Link {...props} />)({
  display: 'block',
  width: '100%',
  padding: 10,
  borderRadius: 3,
  color: green,
  textDecoration: 'none',

  '&:hover': {
    opacity: 0.8
  }
})

const ClearButton = styled((props) => {
  return <button type='button' {...props}>
    <img src={closePicto} />
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
  // background: green,

  '&:focus, &:hover': {
    transform: 'scale(1.25)',
    opacity: 0.9
  }
})

const TaintedFormattedMessage = styled((props) => <span className={props.className}>
  <FormattedMessage {...omit(props, ['classNaame'])} />
</span>
)({}, (props) => {
  return {
    color: props.color
  }
})

const ResultsTitleContainer = styled.div({
  borderBottom: '1px solid rgba(21,119,65, 0.15)'
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
    <br />
    <Blocks>
      {
        map(props.scans).map((value) => {
          return <Block key={value.id} to={`/viewer/${value.id}`}>
            {value.id}
          </Block>
        })
      }
    </Blocks>
  </div>
}

const Filters = memo(() => {
  return <svg xmlns='http://www.w3.org/2000/svg' version='1.1' height={0}>
    <defs>
      {
        Array(50).fill().map((_, i) => {
          return <filter key={`motionblur-${i}`} id={`motionblur-${i}`}>
            <feGaussianBlur in='SourceGraphic' stdDeviation={i + ',0'} />
          </filter>
        })
      }
    </defs>
  </svg>
})

export default function () {
  const [search, setSearch] = useSearchQuery()
  const [scans] = useFetch(scansURIQuery(search), false)

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
      ROMI
      </AppTitle>
      <Search search={search} onSearch={setSearch} />
      <br />

      <Filters />

      <Transition
        items={elements} keys={item => item.key}
        from={{
          transform: 'translate3d(' + (!search ? -window.innerWidth : window.innerWidth) + 'px,0px,0) skewX(-5deg) scale(0.95)',
          filter: 'blur(2px)',
          opacity: 0.9,
          deviation: 50
        }}
        enter={{
          transform: 'translate3d(0,0px,0) skewX(0deg) scale(1)',
          filter: 'blur(0px)',
          opacity: 1,
          deviation: 0
        }}
        leave={{
          transform: 'translate3d(' + (!search ? window.innerWidth : -window.innerWidth) + 'px,0px,0) skewX(5deg) scale(0.95)',
          filter: 'blur(2px)',
          opacity: 0.9,
          deviation: 50
        }}
      >
        {(item) => (props) => {
          return <div
            style={{
              ...omit(props, ['deviation']),
              position: 'absolute',
              width: '100%',
              filter: props.filter + 'url("#' + `motionblur-${Math.round(props.deviation)}` + '")'
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
