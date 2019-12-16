import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  token: null,
  userId: null,
  errorMsg: false,
  loading: false,
  isAdmin: false
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.AUTH_START:
      return updateObject(state, { loading: true, errorMsg: false })

    case actionTypes.AUTH_SUCCESS:
      return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        loading: false,
        errorMsg: false,
        isAdmin: action.isAdmin
      })

    case actionTypes.AUTH_FAILED:
      let errorMsg = false
      if (action.error === 'user_not_found') {
        errorMsg = 'Invalid code, please check your code'
      } else if ((action.error && action.error.status === 400) || (action.error && action.error.status === 404)) {
        errorMsg = 'Invalid code, please check your code'
      } else if ((action.error && action.error.status === 401)) {
        errorMsg = 'We\'re having a problem now, please try again later'
      }

      return updateObject(state, {
        errorMsg: errorMsg,
        loading: false
      })
    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, {
        token: null,
        userId: null,
        isAdmin: false
      })
    case actionTypes.RESET_GLOBAL_ERROR_MSG:
      return updateObject(state, { errorMsg: false })
    default:
      return state
  }
}

export default reducer