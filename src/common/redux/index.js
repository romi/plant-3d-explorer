import React from 'react'
import { createStore, combineReducers } from 'redux'
import { StoreContext } from 'redux-react-hook'

import settingsReducer from 'flow/settings/reducer'
import interactionsReducer from 'flow/interactions/reducer'

const rootReducer = combineReducers({
  settings: settingsReducer,
  interactions: interactionsReducer
})
const store = createStore(rootReducer)

export default function (props) {
  return <StoreContext.Provider value={store}>
    {props.children}
  </StoreContext.Provider>
}
