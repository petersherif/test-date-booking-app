import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../shared/utility'

const initialState = {
  allSubjects: null,
  subjects: null,
  error: false,
  loading: false,
  deleting: false,
  success: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.FETCH_SUBJECTS_START:
      return updateObject(state, { loading: true })
    case actionTypes.FETCH_SUBJECTS_SUCCESS:
      return updateObject(state, { allSubjects: action.subjects, subjects: action.subjects, loading: false })
    case actionTypes.FETCH_SUBJECTS_FAILED:
      return updateObject(state, { error: action.error, loading: false })

    case actionTypes.DELETE_SUBJECTS_START:
      return updateObject(state, { deleting: action.barcode })
    case actionTypes.DELETE_SUBJECTS_SUCCESS:
      let allSubjects = { ...state.allSubjects }
      delete allSubjects[action.barcode]
      return updateObject(state, { deleting: false, allSubjects: allSubjects, subjects: allSubjects })
    case actionTypes.DELETE_SUBJECTS_FAILED:
      return updateObject(state, { deleting: false, error: action.error })

    case actionTypes.SEARCH_SUBJECTS:
      let allSubjects2 = { ...state.allSubjects }
      let searchResult = {}
      Object.values(allSubjects2).filter(subject => {
        return ("" + subject.barcode).search(action.value) !== -1 || subject.name.toLowerCase().search(action.value.toLowerCase()) !== -1
      }).map(subject => {
        return searchResult[subject.barcode] = allSubjects2[subject.barcode]
      })
      return updateObject(state, { subjects: searchResult })

    case actionTypes.EDIT_SUBJECTS_START:
      return updateObject(state, { loading: true, success: false, error: false })
    case actionTypes.EDIT_SUBJECTS_SUCCESS:
      let allSubjects3 = { ...state.allSubjects }
      allSubjects3[action.subjectData.barcode] = { ...action.subjectData }
      return updateObject(state, { loading: false, allSubjects: allSubjects3, subjects: allSubjects3, success: true, error: false })
    case actionTypes.EDIT_SUBJECTS_FAILED:
      return updateObject(state, { loading: false, error: action.error, success: false })

    default: return state
  }
}

export default reducer