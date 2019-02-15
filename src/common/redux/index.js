import React from 'react'
import { createStore, combineReducers } from 'redux'
import { StoreContext } from 'redux-react-hook'

const rootReducer = combineReducers({})
const store = createStore(rootReducer)

export default function (props) {
  return <StoreContext.Provider value={store}>
    {props.children}
  </StoreContext.Provider>
}
