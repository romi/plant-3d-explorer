import styled from '@emotion/styled'

import {
  H1 as rdH1,
  H2 as rdH2,
  H3 as rdH3
} from 'rd/UI/Text/titles'

import { grey, green, darkGreen } from '../../colors'

export const H1 = styled(rdH1)({
  color: green,
  lineHeight: 'normal'
})

export const H2 = styled(rdH2)({
  color: darkGreen,
  lineHeight: 'normal'
})

export const H3 = styled(rdH3)({
  fontWeight: 500,
  textTransform: 'uppercase',
  color: grey,
  lineHeight: 'normal'
})
