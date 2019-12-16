import axios from '../../axios'
import * as actionTypes from './actionTypes'

export const resetAddDateMsg = () => {
  return {
    type: actionTypes.RESET_ADD_DATE_MSG
  }
}

export const fetchDatesStart = () => {
  return {
    type: actionTypes.FETCH_DATES_START
  }
}
export const fetchDatesSuccess = (dates, pastDates) => {
  return {
    type: actionTypes.FETCH_DATES_SUCCESS,
    dates: dates,
    pastDates: pastDates
  }
}
export const fetchDatesFailed = () => {
  return {
    type: actionTypes.FETCH_DATES_FAILED
  }
}
export const fetchDates = (token) => {
  return dispatch => {
    dispatch(fetchDatesStart())
    const userId = localStorage.getItem('smbsiUserId')
    const datesRequest = axios.get('/dates.json?auth=' + token)
    const adminsRequest = axios.get('/admins.json?auth=' + token)
    const studentRequest = axios.get('/students/' + userId + '.json?auth=' + token)
    Promise.all([datesRequest, adminsRequest, studentRequest])
      .then(([...responses]) => {
        let fetchedDates = responses[0].data
        const admins = responses[1].data
        const student = responses[2].data

        if (Object.keys(admins).indexOf(userId) < 0) {
          let filteredDates = {}
          Object.keys(fetchedDates).filter(dateKey => {
            return "" + fetchedDates[dateKey].year === "" + student.year
          }).map(dateKey => {
            return filteredDates[dateKey] = fetchedDates[dateKey]
          })
          fetchedDates = { ...filteredDates }
        }

        let dates = {}
        let pastDates = {}
        const _24hour = 24 * 60 * 60 * 1000
        Object.keys(fetchedDates).map(dateKey => {
          if (fetchedDates[dateKey].date.fullDate < new Date().getTime()) {
            // Dates/tests in the past
            return (
              pastDates[dateKey] = {
                ...fetchedDates[dateKey],
                id: dateKey
              }
            )
          } else if (fetchedDates[dateKey].date.fullDate - new Date().getTime() <= _24hour) {
            // Less than 24 hour left for the test time
            return (
              dates[dateKey] = {
                ...fetchedDates[dateKey],
                id: dateKey,
                rules: {
                  ...fetchedDates[dateKey].rules,
                  changeable: false
                }
              }
            )
          } else {
            // Dates/tests in the future with more than 24 hours
            return (
              dates[dateKey] = {
                ...fetchedDates[dateKey],
                id: dateKey
              }
            )
          }
        })
        dispatch(fetchDatesSuccess(dates, pastDates))
      })
      .catch(error => {
        dispatch(fetchDatesFailed(error));
      })
  }
}

export const addDateStart = () => {
  return {
    type: actionTypes.ADD_DATE_START
  }
}
export const addDateSuccess = () => {
  return {
    type: actionTypes.ADD_DATE_SUCCESS
  }
}
export const addDateFailed = (error) => {
  return {
    type: actionTypes.ADD_DATE_FAILED,
    error: error
  }
}
export const addDate = (dateData, token) => {
  return dispatch => {
    dispatch(addDateStart())

    axios.get('/dates.json?auth=' + token)
      .then(response => {
        const oldDates = { ...response.data }

        let i = 0
        let dateExists = false
        while (i < Object.keys(oldDates).length) {
          let oldDate = Object.values(oldDates)[i]
          if (oldDate.date.fullDate === dateData.date.fullDate && oldDate.subjectCode === dateData.subjectCode) {
            i = Object.keys(oldDates).length
            dateExists = true
          }
          i++
        }

        if (!dateExists) {
          axios.post('/dates.json?auth=' + token, dateData)
            .then(response => {
              dispatch(addDateSuccess())
              dispatch(fetchDates(token))
            })
            .catch(error => {
              dispatch(addDateFailed(error.response))
            })
        } else {
          dispatch(addDateFailed('date_exists'))
        }
      })
      .catch(error => {
        dispatch(addDateFailed(error.response))
      })
  }
}

export const deleteDateStart = () => {
  return {
    type: actionTypes.DELETE_DATE_START
  }
}
export const deleteDateSuccess = (dateId) => {
  return {
    type: actionTypes.DELETE_DATE_SUCCESS,
    dateId: dateId
  }
}
export const deleteDateFailed = (error) => {
  return {
    type: actionTypes.DELETE_DATE_FAILED,
    error: error
  }
}
export const deleteDate = (dateId, token) => {
  return dispatch => {
    dispatch(deleteDateStart())
    axios.delete('/dates/' + dateId + '.json?auth=' + token)
      .then(response => {
        dispatch(deleteDateSuccess(dateId))
      })
      .catch(error => {
        dispatch(deleteDateFailed(error.response))
      })
  }
}

export const editDateStart = () => {
  return {
    type: actionTypes.EDIT_DATE_START
  }
}
export const editDateSuccess = (dateId) => {
  return {
    type: actionTypes.EDIT_DATE_SUCCESS,
    dateId: dateId
  }
}
export const editDateFailed = (error) => {
  return {
    type: actionTypes.EDIT_DATE_FAILED,
    error: error
  }
}
export const editDate = (dateData, dateId, token, studentId, $delete) => {
  return dispatch => {
    dispatch(editDateStart())
    if (Array.isArray(dateData)) {
      const maxLimit = dateData[0]
      const location = dateData[1]

      axios.get('/dates/' + dateId + '.json?auth=' + token)
        .then(response => {
          const oldDate = { ...response.data }
          if (oldDate && maxLimit < Object.keys(oldDate.registered).length) {
            // New max limit is smaller than the currently registered student number, error
            dispatch(editDateFailed('Please, enter max limit greater than ' + Object.keys(oldDate.registered).length))
          } else {
            const updatedDate = {
              ...oldDate,
              maxLimit: maxLimit,
              location: location.name,
              locationCode: location.barcode
            }

            axios.patch('/dates/' + dateId + '.json?auth=' + token, updatedDate)
              .then(response => {
                dispatch(editDateSuccess())
                dispatch(fetchDates(token))
              })
              .catch(error => {
                dispatch(editDateFailed(error.response))
              })
          }
        })
        .catch(error => {
          dispatch(editDateFailed(error.response))
        })
    } else {
      if ($delete === 'delete') {
        if (dateData.registered && Object.keys(dateData.registered).length === 1) {
          axios.patch('/dates/' + dateId + '/.json?auth=' + token, { registered: 0 })
            .then(response => {
              dispatch(editDateSuccess())
              dispatch(fetchDates(token))
            })
            .catch(error => {
              dispatch(editDateFailed(error.response))
            })
        } else {
          axios.delete('/dates/' + dateId + '/registered/' + studentId + '.json?auth=' + token)
            .then(response => {
              dispatch(editDateSuccess())
              dispatch(fetchDates(token))
            })
            .catch(error => {
              dispatch(editDateFailed(error.response))
            })
        }
      } else if (studentId) {
        let registered = {
          [studentId]: studentId
        }
        axios.patch('/dates/' + dateId + '/registered/.json?auth=' + token, registered)
          .then(response => {
            dispatch(editDateSuccess())
            dispatch(fetchDates(token))
          })
          .catch(error => {
            dispatch(editDateFailed(error.response))
          })
      } else {
        axios.patch('/dates/' + dateId + '.json?auth=' + token, dateData)
          .then(response => {
            dispatch(editDateSuccess())
            dispatch(fetchDates(token))
          })
          .catch(error => {
            dispatch(editDateFailed(error.response))
          })
      }
    }
  }
}

export const searchDates = (value) => {
  return {
    type: actionTypes.SEARCH_DATES,
    value: value
  }
}