import * as actionTypes from './actionTypes'
import axios from '../../axios'

export const fetchLocationsStart = () => {
  return {
    type: actionTypes.FETCH_LOCATIONS_START
  }
}

export const fetchLocationsSuccess = (locations) => {
  return {
    type: actionTypes.FETCH_LOCATIONS_SUCCESS,
    locations: locations
  }
}

export const fetchLocationsFailed = (error) => {
  return {
    type: actionTypes.FETCH_LOCATIONS_FAILED,
    error: error
  }
}
export const fetchLocations = (token) => {
  return dispatch => {
    dispatch(fetchLocationsStart())

    axios.get('/locations.json?auth=' + token)
      .then(response => {
        dispatch(fetchLocationsSuccess(response.data || {}))
      })
      .catch(error => {
        dispatch(fetchLocationsFailed(error.response))
      })
  }
}

export const deleteLocationStart = (barcode) => {
  return {
    type: actionTypes.DELETE_LOCATIONS_START,
    barcode: barcode
  }
}

export const deleteLocationSuccess = (barcode) => {
  return {
    type: actionTypes.DELETE_LOCATIONS_SUCCESS,
    barcode: barcode
  }
}

export const deleteLocationFailed = (error) => {
  return {
    type: actionTypes.DELETE_LOCATIONS_FAILED,
    error: error
  }
}

export const deleteLocation = (barcode, token) => {
  return dispatch => {
    dispatch(deleteLocationStart(barcode))
    axios.delete('/locations/' + barcode + '.json?auth=' + token)
      .then(response => {
        dispatch(deleteLocationSuccess(barcode))
      })
      .catch(error => {
        dispatch(deleteLocationFailed(error.response))
      })
  }
}

export const editLocationStart = () => {
  return {
    type: actionTypes.EDIT_LOCATIONS_START
  }
}

export const editLocationSuccess = (locationData) => {
  return {
    type: actionTypes.EDIT_LOCATIONS_SUCCESS,
    locationData: locationData
  }
}

export const editLocationFailed = (error) => {
  return {
    type: actionTypes.EDIT_LOCATIONS_FAILED,
    error: error
  }
}

export const editLocation = (locationData, token) => {
  return dispatch => {
    dispatch(editLocationStart())

    axios.patch('/locations/' + locationData.barcode + '.json?auth=' + token, locationData)
    .then(response => {
      dispatch(editLocationSuccess(locationData))
    })
    .catch(error => {
      dispatch(editLocationFailed(error.response))
    })
  }
}

export const searchLocations = (value) => {
  return {
    type: actionTypes.SEARCH_LOCATIONS,
    value: value
  }
}