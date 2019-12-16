import * as actionTypes from './actionTypes'
import XLSX from 'xlsx'
import axios from '../../axios'
import { editSubjectSuccess } from './allSubjects'
import { editStudentSuccess } from './allStudents'
import { editLocationSuccess } from './allLocations'
import { fetchStudents } from './allStudents'

export const uploadStart = () => {
  return {
    type: actionTypes.UPLOAD_START
  }
}
export const uploadSuccess = () => {
  return {
    type: actionTypes.UPLOAD_SUCCESS
  }
}
export const uploadFailed = (error) => {
  return {
    type: actionTypes.UPLOAD_FAILED,
    error: error
  }
}

export const resetConfirmationMsg = () => {
  return {
    type: actionTypes.RESET_CONFIRMATION_MSG
  }
}

export const uploadExcelFile = (file, token) => {
  return dispatch => {
    // Start loading
    dispatch(uploadStart())

    // If there is no file attached, exit the process
    if (!file) return dispatch(uploadFailed(true))

    // Read the xlsx (excel) file and create a workbook
    file.arrayBuffer().then(result => {
      const workbook = XLSX.read(result, { type: 'buffer' });

      // Convert imported sheet workbook to json object
      let importedSheetJson = {}
      workbook.SheetNames.map((_, i) => {
        return importedSheetJson = {
          ...importedSheetJson,
          [i + 1]: XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[i]], { header: 1 })
        }
      })

      // Manipulate this json object properly and produce a new well formatted json object
      let initialSheetJson = {}
      Object.keys(importedSheetJson).map(year => {
        return importedSheetJson[year].filter(el => { return !isNaN(el[1]) }).map(student => {
          return initialSheetJson[student[1]] = {
            barcode: student[1],
            name: student[0] || '',
            year: year
          }
        })
      })

      // Fetch the old sheet from the database
      axios.get('/students.json?auth=' + token)
        .then(response => {
          // If there is no old sheet
          if (response.data === null) {
            // Push the converted and formatted sheet
            axios.patch('/students.json?auth=' + token, initialSheetJson)
              .then(response => {
                dispatch(uploadSuccess())
                dispatch(fetchStudents())
              })
              .catch(error => {
                dispatch(uploadFailed(error.response))
              })
          } else {
            // If there was an old sheet, get/store it
            const oldSheetJson = { ...response.data }

            // merge it properly with the formatted sheet and produce a final updatedSheet ready to upload to database
            let updatedSheetJson = {}
            Object.keys(initialSheetJson).map(key => {
              if (oldSheetJson[key] && oldSheetJson[key].year !== initialSheetJson[key].year) {
                return updatedSheetJson[key] = { ...initialSheetJson[key] }
              } else {
                return updatedSheetJson[key] = {
                  ...oldSheetJson[key],
                  ...initialSheetJson[key]
                }
              }
            })

            // Updated the updatedSheet (the merged version) to the databse
            axios.patch('/students.json?auth=' + token, updatedSheetJson)
              .then(response => {
                dispatch(uploadSuccess())
              })
              .catch(error => {
                dispatch(uploadFailed(error.response))
              })
          }
        })
        .catch(error => {
          dispatch(uploadFailed(error.response))
        })
    })
  }
}

export const addStudent = (studentData, token) => {
  return dispatch => {
    dispatch(uploadStart())

    const formattedStudentData = {
      [studentData.barcode]: {
        ...studentData,
        barcode: Number(studentData.barcode)
      }
    }

    axios.get('/students.json?auth=' + token)
      .then(response => {
        const oldStudents = { ...response.data }
        if (oldStudents === null || Object.keys(oldStudents).indexOf("" + formattedStudentData[studentData.barcode].barcode) === -1) {
          axios.patch('/students.json?auth=' + token, formattedStudentData)
            .then(response => {
              dispatch(uploadSuccess())
            })
            .catch(error => {
              dispatch(uploadFailed(error.response))
            })
        } else {
          dispatch(uploadFailed('Barcode_Used_Before'))
        }
      })
  }
}

export const addSubject = (subjectData, token) => {
  return dispatch => {
    dispatch(uploadStart())

    const formattedSubjectData = {
      [subjectData.subjectCode]: {
        ...subjectData,
        subjectCode: Number(subjectData.subjectCode)
      }
    }

    axios.get('/subjects.json?auth=' + token)
      .then(response => {
        const oldSubjects = { ...response.data }
        if (oldSubjects === null || Object.keys(oldSubjects).indexOf("" + formattedSubjectData[subjectData.subjectCode].subjectCode) === -1) {
          axios.patch('/subjects.json?auth=' + token, formattedSubjectData)
            .then(response => {
              dispatch(uploadSuccess())
            })
            .catch(error => {
              dispatch(uploadFailed(error.response))
            })
        } else {
          dispatch(uploadFailed('SubjectCode_Used_Before'))
        }
      })
  }
}

export const uploadData = (data, dist, token) => {
  return dispatch => {
    dispatch(uploadStart())
    const formattedData = {
      [data.barcode]: {
        ...data,
        barcode: Number(data.barcode) || data.barcode
      }
    }

    axios.get('/' + dist + '.json?auth=' + token)
      .then(response => {
        const oldData = { ...response.data }
        if (oldData === null || Object.keys(oldData).indexOf("" + formattedData[data.barcode].barcode) === -1) {
          axios.patch('/' + dist + '.json?auth=' + token, formattedData)
            .then(response => {
              dispatch(uploadSuccess())
              if(dist === 'students') {
                dispatch(editStudentSuccess(data))
              } else if(dist === 'subjects') {
                dispatch(editSubjectSuccess(data))
              } else if(dist === 'locations') {
                dispatch(editLocationSuccess(data))
              }
            })
            .catch(error => {
              dispatch(uploadFailed(error.response))
            })
        } else {
          dispatch(uploadFailed('Code_Used_Before'))
        }
      })
  }
}