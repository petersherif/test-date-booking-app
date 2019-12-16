import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import PageHeading from '../../../hoc/PageHeading/PageHeading'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import FormControl from 'react-bootstrap/FormControl'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Spinner from '../../../components/UI/Spinner/Spinner'
import BSSpinner from 'react-bootstrap/Spinner'
import { validateInput } from '../../../shared/utility'
import AddStudentsForm from '../../OpForms/AddStudents/AddStudents'
import styles from './Students.module.scss'

class Students extends Component {

  state = {
    tabKey: 'all',
    showAddStudentForm: false,
    showEditStudent: false,
    editingStudent: null,
    searching: false,
    form: {
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
    },
    passedSubjects: []
  }

  setKeyHandler = (k) => {
    this.setState({ tabKey: k })
  }

  componentDidMount() {
    this.props.onFetchStudents(this.props.token)
    this.props.onFetchSubjects(this.props.token)
  }

  searchHandler = e => {
    if (e.target.value) {
      this.setState({ searching: true })
    } else {
      this.setState({ searching: false })
    }
    this.props.onSearchStudents(e.target.value)
  }

  deleteStudentHandler = barcode => {
    this.props.onDeleteStudent(barcode, this.props.token)
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

  formSubmitHandler = e => {
    e.preventDefault()
    const updatedForm = { ...this.state.form }
    const passedSubjects = [...this.state.passedSubjects]
    Object.keys(updatedForm).map(el => {
      return updatedForm[el] = validateInput(updatedForm, el)
    })

    // If at least one field invalid, the whole form is invalid
    let validForm = true
    for (let formEl in updatedForm) {
      validForm = (updatedForm[formEl].isValid === 'Valid' || !updatedForm[formEl].validation.required) && validForm
    }

    this.setState({ form: updatedForm })

    let studentData = {
      barcode: this.state.editingStudent,
      passedSubjects: passedSubjects
    }
    Object.keys(updatedForm).map(el => {
      return studentData = {
        ...studentData,
        [el]: updatedForm[el].value
      }
    })
    if (validForm) {
      this.props.onEditStudent(studentData, this.props.token)
    }
  }

  toggleEditStudentHandler = (barcode, name, year, passedSubjects) => {
    if (!barcode && !name && !year) {
      this.setState(state => ({ showEditStudent: !state.showEditStudent }))
    } else {
      let form = { ...this.state.form }
      form = {
        ...form,
        barcode: {
          ...form.barcode,
          value: barcode || ''
        },
        name: {
          ...form.name,
          value: name || ''
        },
        year: {
          ...form.year,
          value: year || ''
        }
      }

      this.setState(state => ({
        showEditStudent: !state.showEditStudent,
        form: form,
        editingStudent: barcode,
        passedSubjects: passedSubjects ? passedSubjects : []
      }))
    }
  }

  toggleAddStudentFormHandler = () => {
    this.props.onInputChange()

    this.setState(state => ({ showAddStudentForm: !state.showAddStudentForm }))
  }

  addPassedSubjectHandler = (subjectCode) => {
    const updatedPassedSubjects = [...this.state.passedSubjects]
    if(updatedPassedSubjects.indexOf(subjectCode) < 0) {
      updatedPassedSubjects.push(subjectCode)
    } else {
      updatedPassedSubjects.pop(subjectCode)
    }

    this.setState({passedSubjects: updatedPassedSubjects})
  }

  render() {

    let students = (
      <tr>
        <td colSpan="4" ><Spinner /></td>
      </tr>
    )

    let year1 = (
      <tr>
        <td colSpan="4" ><Spinner /></td>
      </tr>
    )

    let year2 = (
      <tr>
        <td colSpan="4" ><Spinner /></td>
      </tr>
    )

    if (this.props.students) {
      if (Object.values(this.props.students).length <= 0) {
        students = (
          <tr>
            <td colSpan="4" className="text-center p-4">
              {this.state.searching
                ?
                <p className="mb-0">No results found</p>
                :
                <React.Fragment>
                  <p>No students added yet</p>
                  <Button variant="primary" size="sm" onClick={this.toggleAddStudentFormHandler}>Add student(s)</Button>
                </React.Fragment>
              }
            </td>
          </tr>
        )

        year1 = (
          <tr>
            <td colSpan="4" className="text-center p-4">
              {this.state.searching
                ?
                <p className="mb-0">No results found</p>
                :
                <React.Fragment>
                  <p>No students added yet</p>
                  <Button variant="primary" size="sm" onClick={this.toggleAddStudentFormHandler}>Add student(s)</Button>
                </React.Fragment>
              }
            </td>
          </tr>
        )

        year2 = (
          <tr>
            <td colSpan="4" className="text-center p-4">
              {this.state.searching
                ?
                <p className="mb-0">No results found</p>
                :
                <React.Fragment>
                  <p>No students added yet</p>
                  <Button variant="primary" size="sm" onClick={this.toggleAddStudentFormHandler}>Add student(s)</Button>
                </React.Fragment>
              }
            </td>
          </tr>
        )
      } else if (Object.values(this.props.students).length > 0) {

        const studentsData = this.props.students

        students = Object.values(studentsData).map(student => {
          return (
            this.props.deleting === student.barcode
              ?
              <tr key={student.barcode}>
                <td></td>
                <td colSpan="2" className="text-center">
                  <div style={{ minHeight: "31px", paddingTop: "7px" }}>
                    <BSSpinner animation="border" variant="primary" size="sm" />
                  </div>
                </td>
                <td></td>
              </tr>
              :
              <tr key={student.barcode}>
                <td>{student.barcode}</td>
                <td>{student.name}</td>
                <td>{student.year}</td>
                <td className="text-center">
                  {this.props.deleting
                    ?
                    <BSSpinner animation="border" variant="primary" size="sm" />
                    :
                    <React.Fragment>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => this.toggleEditStudentHandler(student.barcode, student.name, student.year, student.passedSubjects)}>Edit</Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => this.deleteStudentHandler(student.barcode)}>Delete</Button>
                    </React.Fragment>
                  }
                </td>
              </tr>
          )
        })

        year1 = Object.values(studentsData).filter(student => {
          return student.year === 1 || student.year === "1"
        }).map(student => {
          return (
            this.props.deleting === student.barcode
              ?
              <tr key={student.barcode}>
                <td></td>
                <td colSpan="2" className="text-center">
                  <div style={{ minHeight: "31px", paddingTop: "7px" }}>
                    <BSSpinner animation="border" variant="primary" size="sm" />
                  </div>
                </td>
                <td></td>
              </tr>
              :
              <tr key={student.barcode}>
                <td>{student.barcode}</td>
                <td>{student.name}</td>
                <td>{student.year}</td>
                <td className="text-center">
                  {this.props.deleting
                    ?
                    <BSSpinner animation="border" variant="primary" size="sm" />
                    :
                    <React.Fragment>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => this.toggleEditStudentHandler(student.barcode, student.name, student.year, student.passedSubjects)}>Edit</Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => this.deleteStudentHandler(student.barcode)}>Delete</Button>
                    </React.Fragment>
                  }
                </td>
              </tr>
          )
        })

        year2 = Object.values(studentsData).filter(student => {
          return student.year === 2 || student.year === "2"
        }).map(student => {
          return (
            this.props.deleting === student.barcode
              ?
              <tr key={student.barcode}>
                <td></td>
                <td colSpan="2" className="text-center">
                  <div style={{ minHeight: "31px" }}>
                    <BSSpinner animation="border" variant="primary" size="sm" />
                  </div>
                </td>
                <td></td>
              </tr>
              :
              <tr key={student.barcode}>
                <td>{student.barcode}</td>
                <td>{student.name}</td>
                <td>{student.year}</td>
                <td className="text-center">
                  {this.props.deleting
                    ?
                    <BSSpinner animation="border" variant="primary" size="sm" />
                    :
                    <React.Fragment>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => this.toggleEditStudentHandler(student.barcode, student.name, student.year, student.passedSubjects)}>Edit</Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => this.deleteStudentHandler(student.barcode)}>Delete</Button>
                    </React.Fragment>
                  }
                </td>
              </tr>
          )
        })
      }
    }

    const studentForm = { ...this.state.form }

    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <PageHeading>
                <h1>Students list</h1>
                <p>You can add, edit, or delete students</p>
              </PageHeading>
            </Col>
          </Row>

          <Row>
            <Col lg={10} className="mx-auto mb-5">
              <Button variant="primary" size="sm" onClick={this.toggleAddStudentFormHandler} className="mb-3">Add student(s)</Button>
              {this.state.showAddStudentForm
                ?
                <AddStudentsForm toggleFormHandler={this.toggleAddStudentFormHandler} />
                : null
              }
            </Col>
          </Row>

          <Row>
            <Col lg={10} className="mx-auto">
              <Row>
                <Col md={4} className="mr-auto">
                  <FormControl type="text" className="mb-3" placeholder="Search with code or name" onChange={this.searchHandler} />
                </Col>
              </Row>
              <Tabs id="controlled-tab-example" activeKey={this.state.tabKey} onSelect={k => this.setKeyHandler(k)}>
                <Tab eventKey="all" title="All">
                  <Table striped bordered hover responsive size="sm" className="custom-data-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {students}
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="year1" title="1st Year">
                  <Table striped bordered hover responsive size="sm" className="custom-data-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {year1}
                    </tbody>
                  </Table>
                </Tab>
                <Tab eventKey="year2" title="2nd Year">
                  <Table striped bordered hover responsive size="sm" className="custom-data-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Year</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {year2}
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>

            </Col>
          </Row>
        </Container>
        <Modal
          show={this.state.showEditStudent}
          animation
          centered
          onHide={this.toggleEditStudentHandler}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4>Edit student data</h4>
            {!this.props.fetchLoading && this.props.subjects
              ? <Form onSubmit={this.formSubmitHandler} id="edit-student">
                <Row>
                  <Col xs={12} className="text-left">
                    <p>Student Code: {this.state.form.barcode.value}</p>
                  </Col>
                  {
                    Object.keys(studentForm).map(el => {
                      return (el !== 'barcode' &&
                        <Col key={el} sm={6}>
                          <Form.Label srOnly>{studentForm[el].label}</Form.Label>
                          <Form.Control
                            {...studentForm[el].elementConfig}
                            value={studentForm[el].value}
                            onChange={(e) => this.formFillingHandler(e, el)}
                            onBlur={studentForm[el].touched ? null : () => this.formTouchedHandler(el)}
                            isInvalid={studentForm[el].isValid === 'Invalid'}
                            isValid={studentForm[el].isValid === 'Valid'} />
                          <p className={studentForm[el].errorMsg ? 'error-msg' : null}>{studentForm[el].errorMsg}</p>
                        </Col>
                      )
                    })
                  }
                </Row>
                <Row>
                  <Col>
                    <p>Choose the subjects that you want to prevent its tests' dates to appear to that student</p>
                    <div className={styles.SubjectsList}>
                      {Object.values(this.props.subjects).filter(subject => subject.year === this.state.form.year.value).map(subject => {
                        const selected = this.state.passedSubjects.indexOf(subject.barcode) !== -1
                        return (
                          <div key={subject.barcode} className={selected ? styles.SelectedSubject : styles.SubjectToSelect}>
                            <span className={styles.SubjectName}>{subject.name}</span>
                        <Button variant="link" size="sm" onClick={() => this.addPassedSubjectHandler(subject.barcode)}>{selected ? 'Deselect' : 'Select'}</Button>
                          </div>
                        )
                      })}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {this.props.fetchSuccess
                      ? <p className="text-success">Student data edited successfully</p>
                      : null
                    }
                  </Col>
                </Row>
              </Form>
              : <Spinner />
            }
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" form="edit-student" disabled={this.props.fetchLoading}>Confirm</Button>
            <Button onClick={() => this.toggleEditStudentHandler(null)} variant="link">Close</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    students: state.allStudents.students,
    deleting: state.allStudents.deleting,
    fetchLoading: state.allStudents.loading,
    fetchSuccess: state.allStudents.success,
    uploadLoading: state.adminOperations.loading,
    uploadSuccess: state.adminOperations.success,
    error: state.adminOperations.error,
    subjects: state.allSubjects.subjects
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchStudents: (token) => dispatch(actions.fetchStudents(token)),
    onFetchSubjects: (token) => dispatch(actions.fetchSubjects(token)),
    onDeleteStudent: (barcode, token) => dispatch(actions.deleteStudent(barcode, token)),
    onSearchStudents: (value) => dispatch(actions.searchStudents(value)),
    onEditStudent: (studentData, token) => dispatch(actions.editStudent(studentData, token)),

    onInputChange: () => dispatch(actions.resetConfirmationMsg()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Students);