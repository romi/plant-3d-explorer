import React from 'react'
import { createStore, combineReducers } from 'redux'
import { StoreContext } from 'redux-react-hook'

import settingsReducer from 'flow/settings/reducer'

const rootReducer = combineReducers({
  settings: settingsReducer
})
const store = createStore(rootReducer)

export default function (props) {
  return <StoreContext.Provider value={store}>
    {props.children}
  </StoreContext.Provider>
}
