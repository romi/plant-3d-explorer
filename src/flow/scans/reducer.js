const initialState = {
  searchQuery: null
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.value
      }
    default:
      return state
  }
}
