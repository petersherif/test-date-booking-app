import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  allLocations: null,
  locations: null,
  error: false,
  loading: false,
  deleting: false,
  success: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.FETCH_LOCATIONS_START:
      return updateObject(state, { loading: true })
    case actionTypes.FETCH_LOCATIONS_SUCCESS:
      return updateObject(state, { allLocations: action.locations, locations: action.locations, loading: false })
    case actionTypes.FETCH_LOCATIONS_FAILED:
      return updateObject(state, { error: action.error, loading: false })

    case actionTypes.DELETE_LOCATIONS_START:
      return updateObject(state, { deleting: action.barcode })
    case actionTypes.DELETE_LOCATIONS_SUCCESS:
      let allLocations = { ...state.allLocations }
      delete allLocations[action.barcode]
      return updateObject(state, { deleting: false, allLocations: allLocations, locations: allLocations })
    case actionTypes.DELETE_LOCATIONS_FAILED:
      return updateObject(state, { deleting: false, error: action.error })

    case actionTypes.SEARCH_LOCATIONS:
      let allLocations2 = { ...state.allLocations }
      let searchResult = {}
      Object.values(allLocations2).filter(location => {
        return ("" + location.barcode).search(action.value) !== -1 || location.name.toLowerCase().search(action.value.toLowerCase()) !== -1
      }).map(location => {
        return searchResult[location.barcode] = allLocations2[location.barcode]
      })
      return updateObject(state, { locations: searchResult })

    case actionTypes.EDIT_LOCATIONS_START:
      return updateObject(state, { loading: true, success: false, error: false })
    case actionTypes.EDIT_LOCATIONS_SUCCESS:
      let allLocations3 = { ...state.allLocations }
      allLocations3[action.locationData.barcode] = { ...action.locationData }
      return updateObject(state, { loading: false, allLocations: allLocations3, locations: allLocations3, success: true, error: false })
    case actionTypes.EDIT_LOCATIONS_FAILED:
      return updateObject(state, { loading: false, error: action.error, success: false })

    default: return state
  }
}

export default reducer