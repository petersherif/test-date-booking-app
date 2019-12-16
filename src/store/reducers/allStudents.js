import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  allStudents: null,
  students: null,
  error: false,
  loading: false,
  deleting: false,
  success: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.FETCH_STUDENTS_START:
      return updateObject(state, { loading: true })
    case actionTypes.FETCH_STUDENTS_SUCCESS:
      return updateObject(state, { allStudents: action.students, students: action.students, loading: false })
    case actionTypes.FETCH_STUDENTS_FAILED:
      return updateObject(state, { error: action.error, loading: false })

    case actionTypes.DELETE_STUDENTS_START:
      return updateObject(state, { deleting: action.barcode })
    case actionTypes.DELETE_STUDENTS_SUCCESS:
      let allStudents = { ...state.allStudents }
      delete allStudents[action.barcode]
      return updateObject(state, { deleting: false, allStudents: allStudents, students: allStudents })
    case actionTypes.DELETE_STUDENTS_FAILED:
      return updateObject(state, { deleting: false, error: action.error })

    case actionTypes.SEARCH_STUDENTS:
      let allStudents2 = { ...state.allStudents }
      let searchResult = {}
      Object.values(allStudents2).filter(student => {
        return ("" + student.barcode).search(action.value) !== -1 || student.name.toLowerCase().search(action.value.toLowerCase()) !== -1
      }).map(student => {
        return searchResult[student.barcode] = allStudents2[student.barcode]
      })
      return updateObject(state, { students: searchResult })

    case actionTypes.EDIT_STUDENTS_START:
      return updateObject(state, {loading: true, success: false, error: false})
    case actionTypes.EDIT_STUDENTS_SUCCESS:
      let allStudents3 = {...state.allStudents}
      allStudents3[action.studentData.barcode] = {...action.studentData}
      return updateObject(state, {loading: false, allStudents: allStudents3, students: allStudents3, success: true, error: false})
    case actionTypes.EDIT_STUDENTS_FAILED:
      return updateObject(state, {loading: false, error: action.error, success: false})

    default: return state
  }
}

export default reducer