import * as actionTypes from './actionTypes'
import axios from '../../axios'

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (idToken, userId, isAdmin) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: idToken,
    userId: userId,
    isAdmin: isAdmin
  }
}

export const authFailed = (error) => {
  return {
    type: actionTypes.AUTH_FAILED,
    error: error
  }
}

export const logout = () => {
  localStorage.removeItem('smbsiToken')
  localStorage.removeItem('smbsiUserExpirationDate')
  localStorage.removeItem('smbsiUserId')
  localStorage.removeItem('smbsiIsAdmin')
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expiresIn) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout())
    }, expiresIn * 1000)
  }
}

export const storeUserDataInLocalStorage = (idToken, userId, expirationDate, isAdmin) => {
  localStorage.setItem('smbsiToken', idToken)
  localStorage.setItem('smbsiUserId', userId)
  localStorage.setItem('smbsiUserExpirationDate', expirationDate)
  localStorage.setItem('smbsiIsAdmin', isAdmin || false)
}

export const studentAuth = (idToken, userId, expirationDate, expiresIn) => {
  return dispatch => {
    axios.get('/admins.json?auth=' + idToken)
      .then(response => {
        if(response) {
          const admins = { ...response.data }
  
          if (Object.keys(admins).indexOf(userId) !== -1) {
            storeUserDataInLocalStorage(idToken, userId, expirationDate, true)
            dispatch(authSuccess(idToken, userId, true))
            dispatch(checkAuthTimeout(expiresIn))
          } else {
            axios.get('/students.json?auth=' + idToken)
              .then(response => {
                if(response) {
                  const oldSheetJson = { ...response.data }
          
                  if (Object.keys(oldSheetJson).indexOf(userId) !== -1) {
                    storeUserDataInLocalStorage(idToken, userId, expirationDate)
          
                    dispatch(authSuccess(idToken, userId))
                    dispatch(checkAuthTimeout(expiresIn))
                  }
                  else {
                    dispatch(authFailed('user_not_found'))
                  }
                }
              })
              .catch(error => {
                console.log(error.response);
                dispatch(authFailed(error.response))
              })
          }
        }
      })
      .catch(error => {
        console.log(error.response);
        dispatch(authFailed(error.response))
      })
  }
}

export const auth = (userId) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: 'virtualadmin@smbsi.com',
      password: 'Qk2;R#t}XG5H3hfq',
      returnSecureToken: true
    }

    axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAr_-aKC_2Iu0uJ8JNDBPNeq7bvRA33vP4', authData)
      .then(response => {
        const idToken = response.data.idToken
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000)
        const expiresIn = response.data.expiresIn

        dispatch(studentAuth(idToken, userId, expirationDate, expiresIn))
      })
      .catch(error => {
        dispatch(authFailed(error.response))
      })
  }
}

export const autoLoginAttempt = () => {
  return dispatch => {
    const token = localStorage.getItem('smbsiToken')
    if (token !== null) {
      const expirationDate = localStorage.getItem('smbsiUserExpirationDate')

      if (new Date(expirationDate).getTime() > new Date().getTime()) {
        const userId = localStorage.getItem('smbsiUserId')
        const isAdmin = localStorage.getItem('smbsiIsAdmin') === "true" ? true : false
        dispatch(authSuccess(token, userId, isAdmin))
        dispatch(checkAuthTimeout((new Date(expirationDate).getTime() - new Date().getTime()) / 1000))
      } else {
        dispatch(logout())
      }
    }
  }
}

export const resetGlobalErrorMsg = () => {
  return {
    type: actionTypes.RESET_GLOBAL_ERROR_MSG
  }
}