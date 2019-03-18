import React, { useContext } from 'react'
import { omit } from 'lodash'
import { IntlProvider, injectIntl } from 'react-intl'

export const IntlContext = React.createContext()

export const InjectIntlContext = injectIntl(({ intl, children }) => {
  return (
    <IntlContext.Provider value={intl}>
      { children }
    </IntlContext.Provider>
  )
})

export default function (props) {
  return <IntlProvider
    locale={'en'}
    messages={props.messages}
    {...omit(props, ['children', 'messages'])}
  >
    <InjectIntlContext>
      { props.children }
    </InjectIntlContext>
  </IntlProvider>
}

export const useFormatMessage = () => {
  const intl = useContext(IntlContext)
  return (id, value = {}) => {
    return intl.formatMessage({ id, value })
  }
}
