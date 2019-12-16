import * as actionTypes from './actionTypes'
import axios from '../../axios'

export const fetchStudentsStart = () => {
  return {
    type: actionTypes.FETCH_STUDENTS_START
  }
}

export const fetchStudentsSuccess = (students) => {
  return {
    type: actionTypes.FETCH_STUDENTS_SUCCESS,
    students: students
  }
}

export const fetchStudentsFailed = (error) => {
  return {
    type: actionTypes.FETCH_STUDENTS_FAILED,
    error: error
  }
}
export const fetchStudents = (token) => {
  return dispatch => {
    dispatch(fetchStudentsStart())

    axios.get('/students.json?auth=' + token)
      .then(response => {
        dispatch(fetchStudentsSuccess(response.data || {}))
      })
      .catch(error => {
        dispatch(fetchStudentsFailed(error.response))
      })
  }
}

export const deleteStudentStart = (barcode) => {
  return {
    type: actionTypes.DELETE_STUDENTS_START,
    barcode: barcode
  }
}

export const deleteStudentSuccess = (barcode) => {
  return {
    type: actionTypes.DELETE_STUDENTS_SUCCESS,
    barcode: barcode
  }
}

export const deleteStudentFailed = (error) => {
  return {
    type: actionTypes.DELETE_STUDENTS_FAILED,
    error: error
  }
}

export const deleteStudent = (barcode, token) => {
  return dispatch => {
    dispatch(deleteStudentStart(barcode))
    axios.delete('/students/' + barcode + '.json?auth=' + token)
      .then(response => {
        dispatch(deleteStudentSuccess(barcode))
      })
      .catch(error => {
        dispatch(deleteStudentFailed(error.response))
      })
  }
}

export const editStudentStart = () => {
  return {
    type: actionTypes.EDIT_STUDENTS_START
  }
}

export const editStudentSuccess = (studentData) => {
  return {
    type: actionTypes.EDIT_STUDENTS_SUCCESS,
    studentData: studentData
  }
}

export const editStudentFailed = (error) => {
  return {
    type: actionTypes.EDIT_STUDENTS_FAILED,
    error: error
  }
}


export const editStudent = (studentData, token) => {
  return dispatch => {
    dispatch(editStudentStart())

    axios.patch('/students/' + studentData.barcode + '.json?auth=' + token, studentData)
    .then(response => {
      dispatch(editStudentSuccess(studentData))
    })
    .catch(error => {
      dispatch(editStudentFailed(error.response))
    })
  }
}

export const searchStudents = (value) => {
  return {
    type: actionTypes.SEARCH_STUDENTS,
    value: value
  }
}