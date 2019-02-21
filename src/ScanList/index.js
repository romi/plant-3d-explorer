import React from 'react'
import { Link } from 'react-router-dom'

import { styled } from 'rd/nano'

const Container = styled.div({
  padding: 20,
  width: '100%',
  height: '100%'
})

const Block = styled((props) => <Link {...props} />)({
  width: 100,
  height: 100,
  borderRadius: 3,
  color: 'white',
  background: 'grey',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  cursor: 'pointer',
  textDecoration: 'none',
  marginRight: 20,
  marginBottom: 20,

  '&:hover': {
    opacity: 0.8
  }
})

export default function () {
  return <Container>
    {
      Array(20).fill().map((d, i) => {
        return <Block key={i} to='/viewer'>
          SCAN {i + 1}
        </Block>
      })
    }
  </Container>
}
