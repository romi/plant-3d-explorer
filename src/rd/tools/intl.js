/*

Romi 3D PlantViewer: An browser application for 3D scanned
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
