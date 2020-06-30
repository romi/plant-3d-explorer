import React from 'react'
import styled from '@emotion/styled'

const Block = styled.pre({
  backgroundColor: '#AAAAAA30',
  borderRadius: 10,
  padding: 10,
  fontSize: 16
})

export default function ObjectFormatter ({ object }) {
  return (
    <Block>
      <code>
        {
          JSON.stringify(object, null, 2)
        }
      </code>
    </Block>
  )
}
