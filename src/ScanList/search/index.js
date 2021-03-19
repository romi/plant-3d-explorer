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
import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import styled from '@emotion/styled'

import { useFormatMessage } from 'rd/tools/intl'
import { H1Rules } from 'rd/UI/Text/titles'

import { green, grey } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

import searchIcon from './assets/ico.search.30x30.svg'

const Container = styled.form({
  position: 'relative',
  width: '100%',
  height: 87,
  borderBottom: `1px solid ${green}`
})

const Input = styled.input({
  ...H1Rules,
  width: 'calc(100% - 147px)',
  fontSize: 34,
  color: green,
  outline: 'none',
  border: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',

  '&::placeholder': {
    opacity: 0.5,
    color: grey
  }
})

const Button = styled.button({
  position: 'absolute',
  bottom: 0,
  height: 80,
  display: 'inline-block',
  border: 'none',
  outline: 'none',
  fontSize: 34,
  color: green,
  cursor: 'pointer',
  opacity: 0.9,
  transition: 'all 0.15s ease',
  boxShadow: 'inset 0px 0px 0px 0px white',
  margin: 0,
  padding: 0,
  paddingLeft: 45,
  backgroundImage: `url(${searchIcon})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0px center',

  '&:focus, &:hover': {
    boxShadow: `inset 0px -5px 0px 0px ${green}`,
    opacity: 0.9
  },

  '&:active': {
    opacity: 0.6
  }
}, (props) => {
  return {
    opacity: props.nonActive ? 0.3 : null
  }
})

export default function Search (props) {
  const intl = useFormatMessage()
  const [value, setvalue] = useState(props.search || '')
  const [focused, setFocus] = useState(false)

  useEffect(
    () => {
      if (!props.search && value !== '') setvalue('')
    },
    [props.search]
  )

  useEffect(
    () => {
      const handler = (e) => {
        if (e.key === 'Escape') setvalue('')
      }

      if (focused) {
        document.addEventListener('keydown', handler, false)
      } else {
        document.removeEventListener('keydown', handler, false)
      }

      return () => document.removeEventListener('keydown', handler, false)
    },
    [focused]
  )

  return <Container
    onSubmit={(e) => {
      e.preventDefault()
      props.onSearch(value)
    }}
  >
    <H3>
      <FormattedMessage id='filter-title' />
    </H3>
    <Input
      value={value}
      onFocus={(e) => setFocus(true)}
      onBlur={(e) => setFocus(false)}
      onChange={(e) => setvalue(e.target.value)}
      placeholder={intl('filter-placeholder')}
    />
    <Button
      nonActive={value === ''}
      type='submit'
    >
      <FormattedMessage id='filter-submit' />
    </Button>
  </Container>
}
