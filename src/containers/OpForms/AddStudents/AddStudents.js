import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Spinner from '../../../components/UI/Spinner/Spinner'
import styles from './AddStudents.module.scss'
import { validateInput } from '../../../shared/utility'

class AddStudentsForm extends Component {

  state = {
    form: {
      name: {
        elementConfig: {
          type: 'text',
          placeholder: 'Student Name'
        },
        label: 'Student Name',
        value: '',
        validation: {
          required: true
        },
        isValid: '',
        errorMsg: '',
        touched: false
      },
      barcode: {
        elementConfig: {
          type: 'number',
          placeholder: 'Student Barcode'
        },
        label: 'Student Barcode',
        value: '',
        validation: {
          required: true,
          length: 5
        },
        isValid: '',
        errorMsg: '',
        touched: false
      },
      year: {
        elementConfig: {
          type: 'number',
          placeholder: 'Student Year'
        },
        label: 'Student Year',
        value: '',
        validation: {
          required: true,
          length: 1
        },
        isValid: '',
        errorMsg: '',
        touched: false
      }
    }
  }

  fileInput = React.createRef()

  submitExcelFileHandler = e => {
    e.preventDefault()
    this.props.onUploadExcelFile(this.fileInput.current.files[0], this.props.token)
  }

  formSubmitHandler = e => {
    e.preventDefault()
    const updatedForm = { ...this.state.form }
    Object.keys(updatedForm).map(el => {
      return updatedForm[el] = validateInput(updatedForm, el)
    })

    // If at least one field invalid, the whole form is invalid
    let validForm = true
    for (let formEl in updatedForm) {
      validForm = (updatedForm[formEl].isValid === 'Valid' || !updatedForm[formEl].validation.required) && validForm
    }

    this.setState({ form: updatedForm })

    let studentData = {}
    Object.keys(updatedForm).map(el => {
      return studentData = {
        ...studentData,
        [el]: updatedForm[el].value
      }
    })
    if (validForm) {
      this.props.onAddStudent(studentData, this.props.token)
    }
  }

  formTouchedHandler = el => {
    const updatedForm = { ...this.state.form }
    const updatedFormElement = { ...updatedForm[el] }
    if (updatedFormElement.value) {
      updatedFormElement.touched = true
      updatedForm[el] = updatedFormElement
      updatedForm[el] = validateInput(updatedForm, el)
    }

    this.setState({ form: updatedForm })
  }

  formFillingHandler = (e, el) => {
    if (this.props.error) {
      this.props.onInputChange()
    }

    const value = e.target.value;
    const updatedForm = { ...this.state.form }
    const updatedFormElement = { ...updatedForm[el] }
    updatedFormElement.value = value
    updatedForm[el] = updatedFormElement

    if (updatedForm[el].elementConfig.type !== 'number') {
      updatedForm[el] = validateInput(updatedForm, el)
    }

    if (updatedForm[el].touched || value.length === updatedForm[el].validation.length) {
      updatedForm[el].touched = true
      updatedForm[el] = validateInput(updatedForm, el)
    }

    this.setState({ form: updatedForm })
  }

  render() {

    const studentForm = { ...this.state.form }

    return (

      <div className={styles.AddStudents}>
        <Row>
          <Col>
            <div className={styles.UploadFile}>
              <p>To upload all students data at once, select the students excel file from your computer</p>
              {this.props.loading
                ? <Spinner />
                : <form onSubmit={this.submitExcelFileHandler}>
                  <input type="file" ref={this.fileInput} onClick={this.props.onInputChange} />
                  <Button variant="primary" size="sm" type="submit" onClick={this.props.onInputChange}>Upload</Button>
                </form>
              }
              {this.props.success
                ? <p className="text-success">Uploaded successfully</p>
                : null
              }

              {this.props.error
                ? <p className="text-danger">Failed to upload</p>
                : null
              }
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className={styles.AddStudentform}>
              <p>Or add individual student</p>
              {!this.props.loading
                ? <Form onSubmit={this.formSubmitHandler} id="add-student">
                  <Row>
                    {
                      Object.keys(studentForm).map(el => {
                        return (
                          <Col key={el} sm={6}>
                            <Form.Label srOnly>{studentForm[el].label}</Form.Label>
                            <Form.Control
                              {...studentForm[el].elementConfig}
                              value={studentForm[el].value}
                              onChange={(e) => this.formFillingHandler(e, el)}
                              onBlur={studentForm[el].touched ? null : () => this.formTouchedHandler(el)}
                              isInvalid={studentForm[el].isValid === 'Invalid' || this.props.errorMsg || (studentForm[el].validation.length === 5 && this.props.error)}
                              isValid={studentForm[el].isValid === 'Valid'} />
                            <p className={studentForm[el].errorMsg ? 'error-msg' : null}>{studentForm[el].errorMsg}</p>
                          </Col>
                        )
                      })
                    }
                  </Row>
                  <Row>
                    <Col>
                      {this.props.error
                        ? <p className="error-msg">{this.props.error}</p>
                        : null
                      }
                      {this.props.success
                        ? <p className="text-success">Student added successfully</p>
                        : null
                      }
                    </Col>
                  </Row>
                  <Button type="submit" variant="primary" size="sm" form="add-student" disabled={this.props.loading}>Add</Button>
                  <Button variant="link" size="sm" onClick={this.props.toggleFormHandler}>Back</Button>
                </Form>
                : <Spinner />
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.adminOperations.loading,
    success: state.adminOperations.success,
    error: state.adminOperations.error,
    token: state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUploadExcelFile: (file, token) => dispatch(actions.uploadExcelFile(file, token)),
    onInputChange: () => dispatch(actions.resetConfirmationMsg()),
    onAddStudent: (data, token) => dispatch(actions.uploadData(data, 'students', token))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddStudentsForm);