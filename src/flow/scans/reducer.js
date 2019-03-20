export const sortingMethods = [
  {
    label: 'name',
    method: 'asc',
    defaultMethod: 'asc',
    type: 'natural'
  },
  {
    label: 'species',
    method: 'asc',
    defaultMethod: 'asc',
    type: 'natural'
  },
  {
    label: 'environment',
    method: 'asc',
    defaultMethod: 'asc',
    type: 'natural'
  },
  {
    label: 'date',
    method: 'desc',
    defaultMethod: 'desc',
    type: 'date'
  }
]

const initialState = {
  searchQuery: null,
  sorting: sortingMethods.find((d) => d.label === 'date')
}

export default function settingsReducer (state = initialState, action) {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.value
      }
    case 'SET_SORTING':
      return {
        ...state,
        sorting: action.value
      }
    default:
      return state
  }
}
