import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  allDates: null,
  dates: null,
  pastDates: null,
  loading: false,
  error: false,
  success: false
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.RESET_ADD_DATE_MSG:
      return updateObject(state, { success: false, error: false })

    case actionTypes.ADD_DATE_START:
      return updateObject(state, { loading: true, success: false, error: false })
    case actionTypes.ADD_DATE_SUCCESS:
      return updateObject(state, { loading: false, success: true, error: false })
    case actionTypes.ADD_DATE_FAILED:
      return updateObject(state, { loading: false, error: action.error === 'date_exists' ? 'The date already exists' : action.error })

    case actionTypes.FETCH_DATES_START:
      return updateObject(state, { loading: true })
    case actionTypes.FETCH_DATES_SUCCESS:
      return updateObject(state, { allDates: action.dates, dates: action.dates, pastDates: action.pastDates, loading: false })
    case actionTypes.FETCH_DATES_FAILED:
      return updateObject(state, { error: action.error, loading: false })

    case actionTypes.DELETE_DATE_START:
      return updateObject(state, { loading: true, success: false, error: false })
    case actionTypes.DELETE_DATE_SUCCESS:
      const allDates = { ...state.allDates }
      const pastDates = { ...state.pastDates }
      delete allDates[action.dateId]
      delete pastDates[action.dateId]
      return updateObject(state, { allDates: allDates, dates: allDates, pastDates: pastDates, loading: false, success: true, error: false })
    case actionTypes.DELETE_DATE_FAILED:
      return updateObject(state, { loading: false, success: false, error: action.error })

    case actionTypes.EDIT_DATE_START:
      return updateObject(state, { loading: true, success: false, error: false })
    case actionTypes.EDIT_DATE_SUCCESS:
      return updateObject(state, { loading: false, success: true, error: false })
    case actionTypes.EDIT_DATE_FAILED:
      return updateObject(state, { loading: false, error: action.error, success: false })

    case actionTypes.SEARCH_DATES:
      let allDates2 = { ...state.allDates }
      let searchResult = {}

      Object.values(allDates2).filter(date => {
        const testStr = date.date.weekDay + date.date.dayDate + date.location + date.date.time + date.subjectName
        return testStr.search(action.value) > -1
      }).map(date => {
        return searchResult[date.id] = allDates2[date.id]
      })
      return updateObject(state, { dates: searchResult })

    default: {
      return state
    }
  }
}

export default reducer