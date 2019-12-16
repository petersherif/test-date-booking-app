import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  success: false,
  error: false,
  loading: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.RESET_CONFIRMATION_MSG:
      return updateObject(state, {success: false, error: false})
    case actionTypes.UPLOAD_START:
      return updateObject(state, {loading: true, success: false, error: false})
    case actionTypes.UPLOAD_SUCCESS:
      return updateObject(state, {success: true, loading: false, error: false})
    case actionTypes.UPLOAD_FAILED:
      return updateObject(state, {
        success: false,
        error: action.error === 'Code_Used_Before' ? 'This code is already used' : true,
        loading: false
      })
    default: return state
  }
}

export default reducer