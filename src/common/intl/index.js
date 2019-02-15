import React from 'react'
import {
  IntlProvider
} from 'react-intl'

import en from './en.json'

export default function (props) {
  return <IntlProvider
    locale={'en'}
    messages={en}
    {...props}
  />
}
