import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { styled } from 'rd/nano'
import { useFormatMessage } from 'rd/tools/intl'
import { H1Rules } from 'rd/UI/Text/titles'

import { green, grey } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

const Container = styled.form({
  position: 'relative',
  width: '100%',
  height: 87,
  borderBottom: `1px solid ${green}`
})

const Input = styled.input({
  ...H1Rules,
  width: 'calc(100% - 160px)',
  fontSize: 34,
  color: green,
  outline: 'none',
  border: 'none',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  letterSpacing: '2px',

  '&::placeholder': {
    opacity: 0.5,
    color: grey
  }
})

const Button = styled.input({
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
  const [value, setvalue] = useState('')

  useEffect(
    () => {
      if (!props.search && value !== '') setvalue('')
    },
    [props.search]
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
      onChange={(e) => setvalue(e.target.value)}
      placeholder={intl('filter-placeholder')}
    />
    <Button
      nonActive={value === ''}
      type='submit'
      value={intl('filter-submit')}
    />
  </Container>
}
