import * as actionTypes from './actionTypes'
import axios from '../../axios'

export const fetchSubjectsStart = () => {
  return {
    type: actionTypes.FETCH_SUBJECTS_START
  }
}

export const fetchSubjectsSuccess = (subjects) => {
  return {
    type: actionTypes.FETCH_SUBJECTS_SUCCESS,
    subjects: subjects
  }
}

export const fetchSubjectsFailed = (error) => {
  return {
    type: actionTypes.FETCH_SUBJECTS_FAILED,
    error: error
  }
}
export const fetchSubjects = (token) => {
  return dispatch => {
    dispatch(fetchSubjectsStart())

    axios.get('/subjects.json?auth=' + token)
      .then(response => {
        dispatch(fetchSubjectsSuccess(response.data || {}))
      })
      .catch(error => {
        dispatch(fetchSubjectsFailed(error.response))
      })
  }
}

export const deleteSubjectStart = (barcode) => {
  return {
    type: actionTypes.DELETE_SUBJECTS_START,
    barcode: barcode
  }
}

export const deleteSubjectSuccess = (barcode) => {
  return {
    type: actionTypes.DELETE_SUBJECTS_SUCCESS,
    barcode: barcode
  }
}

export const deleteSubjectFailed = (error) => {
  return {
    type: actionTypes.DELETE_SUBJECTS_FAILED,
    error: error
  }
}

export const deleteSubject = (barcode, token) => {
  return dispatch => {
    dispatch(deleteSubjectStart(barcode))
    axios.delete('/subjects/' + barcode + '.json?auth=' + token)
      .then(response => {
        dispatch(deleteSubjectSuccess(barcode))
      })
      .catch(error => {
        dispatch(deleteSubjectFailed(error.response))
      })
  }
}

export const editSubjectStart = () => {
  return {
    type: actionTypes.EDIT_SUBJECTS_START
  }
}

export const editSubjectSuccess = (subjectData) => {
  return {
    type: actionTypes.EDIT_SUBJECTS_SUCCESS,
    subjectData: subjectData
  }
}

export const editSubjectFailed = (error) => {
  return {
    type: actionTypes.EDIT_SUBJECTS_FAILED,
    error: error
  }
}

export const editSubject = (subjectData, token) => {
  return dispatch => {
    dispatch(editSubjectStart())

    axios.patch('/subjects/' + subjectData.barcode + '.json?auth=' + token, subjectData)
    .then(response => {
      dispatch(editSubjectSuccess(subjectData))
    })
    .catch(error => {
      dispatch(editSubjectFailed(error.response))
    })
  }
}

export const searchSubjects = (value) => {
  return {
    type: actionTypes.SEARCH_SUBJECTS,
    value: value
  }
}