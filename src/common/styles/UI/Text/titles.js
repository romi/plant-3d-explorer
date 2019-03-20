import { H1 as rdH1, H3 as rdH3 } from 'rd/UI/Text/titles'
import { styled } from 'rd/nano'

import { grey, green } from '../../colors'

export const H1 = styled(rdH1)({
  color: green,
  lineHeight: 'normal'
})

export const H3 = styled(rdH3)({
  fontWeight: 500,
  textTransform: 'uppercase',
  color: grey,
  lineHeight: 'normal'
})
