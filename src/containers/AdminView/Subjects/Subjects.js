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
import AddSubjectForm from '../../OpForms/AddSubject/AddSubject'

class Subjects extends Component {

  state = {
    tabKey: 'all',
    showEditSubject: false,
    showAddSubjectForm: false,
    editingSubject: null,
    searching: false,
    form: {
      name: {
        elementConfig: {
          type: 'text',
          placeholder: 'Subject Name'
        },
        label: 'Subject Name',
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
          placeholder: 'Subject Year'
        },
        label: 'Subject Year',
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

  setKeyHandler = (k) => {
    this.setState({ tabKey: k })
  }

  componentDidMount() {
    this.props.onFetchSubjects(this.props.token)
  }

  searchHandler = e => {
    if (e.target.value) {
      this.setState({ searching: true })
    } else {
      this.setState({ searching: false })
    }
    this.props.onSearchSubjects(e.target.value)
  }

  deleteSubjectHandler = barcode => {
    this.props.onDeleteSubject(barcode, this.props.token)
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
    Object.keys(updatedForm).map(el => {
      return updatedForm[el] = validateInput(updatedForm, el)
    })

    // If at least one field invalid, the whole form is invalid
    let validForm = true
    for (let formEl in updatedForm) {
      validForm = (updatedForm[formEl].isValid === 'Valid' || !updatedForm[formEl].validation.required) && validForm
    }

    this.setState({ form: updatedForm })

    let subjectData = {
      barcode: this.state.editingSubject
    }
    Object.keys(updatedForm).map(el => {
      return subjectData = {
        ...subjectData,
        [el]: updatedForm[el].value
      }
    })
    if (validForm) {
      this.props.onEditSubject(subjectData, this.props.token)
    }
  }

  toggleEditSubjectHandler = (barcode, name, year) => {
    if (!barcode && !name && !year) {
      this.setState(state => ({ showEditSubject: !state.showEditSubject }))
    } else {
      let form = { ...this.state.form }
      form = {
        ...form,
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
        showEditSubject: !state.showEditSubject,
        editingSubject: barcode,
        form: form
      }))
    }
  }

  toggleAddSubjectFormHandler = () => {
    this.setState(state => ({ showAddSubjectForm: !state.showAddSubjectForm }))
  }

  render() {

    let subjects = (
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

    if (this.props.subjects) {
      if (Object.values(this.props.subjects).length <= 0) {
        subjects = (
          <tr>
            <td colSpan="4" className="text-center p-4">
              {this.state.searching
                ?
                <p className="mb-0">No results found</p>
                :
                <React.Fragment>
                  <p>No subjects added yet</p>
                  <Button variant="primary" size="sm" onClick={this.toggleAddSubjectFormHandler} className="mb-3">Add Subject</Button>
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
                  <p>No subjects added yet</p>
                  <Button variant="primary" size="sm" onClick={this.toggleAddSubjectFormHandler} className="mb-3">Add Subject</Button>
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
                  <p>No subjects added yet</p>
                  <Button variant="primary" size="sm" onClick={this.toggleAddSubjectFormHandler} className="mb-3">Add Subject</Button>
                </React.Fragment>
              }
            </td>
          </tr>
        )
      } else if (Object.values(this.props.subjects).length > 0) {

        const subjectsData = this.props.subjects

        subjects = Object.values(subjectsData).map(subject => {
          return (
            this.props.deleting === subject.barcode
              ?
              <tr key={subject.barcode}>
                <td></td>
                <td colSpan="2" className="text-center">
                  <div style={{ minHeight: "31px", paddingTop: "7px" }}>
                    <BSSpinner animation="border" variant="primary" size="sm" />
                  </div>
                </td>
                <td></td>
              </tr>
              :
              <tr key={subject.barcode}>
                <td>{subject.barcode}</td>
                <td>{subject.name}</td>
                <td>{subject.year}</td>
                <td className="text-center">
                  {this.props.deleting
                    ?
                    <BSSpinner animation="border" variant="primary" size="sm" />
                    :
                    <React.Fragment>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => this.toggleEditSubjectHandler(subject.barcode, subject.name, subject.year)}>Edit</Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => this.deleteSubjectHandler(subject.barcode)}>Delete</Button>
                    </React.Fragment>
                  }
                </td>
              </tr>
          )
        })

        year1 = Object.values(subjectsData).filter(subject => {
          return subject.year === 1 || subject.year === "1"
        }).map(subject => {
          return (
            this.props.deleting === subject.barcode
              ?
              <tr key={subject.barcode}>
                <td></td>
                <td colSpan="2" className="text-center">
                  <div style={{ minHeight: "31px", paddingTop: "7px" }}>
                    <BSSpinner animation="border" variant="primary" size="sm" />
                  </div>
                </td>
                <td></td>
              </tr>
              :
              <tr key={subject.barcode}>
                <td>{subject.barcode}</td>
                <td>{subject.name}</td>
                <td>{subject.year}</td>
                <td className="text-center">
                  {this.props.deleting
                    ?
                    <BSSpinner animation="border" variant="primary" size="sm" />
                    :
                    <React.Fragment>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => this.toggleEditSubjectHandler(subject.barcode, subject.name, subject.year)}>Edit</Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => this.deleteSubjectHandler(subject.barcode)}>Delete</Button>
                    </React.Fragment>
                  }
                </td>
              </tr>
          )
        })

        year2 = Object.values(subjectsData).filter(subject => {
          return subject.year === 2 || subject.year === "2"
        }).map(subject => {
          return (
            this.props.deleting === subject.barcode
              ?
              <tr key={subject.barcode}>
                <td></td>
                <td colSpan="2" className="text-center">
                  <div style={{ minHeight: "31px" }}>
                    <BSSpinner animation="border" variant="primary" size="sm" />
                  </div>
                </td>
                <td></td>
              </tr>
              :
              <tr key={subject.barcode}>
                <td>{subject.barcode}</td>
                <td>{subject.name}</td>
                <td>{subject.year}</td>
                <td className="text-center">
                  {this.props.deleting
                    ?
                    <BSSpinner animation="border" variant="primary" size="sm" />
                    :
                    <React.Fragment>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => this.toggleEditSubjectHandler(subject.barcode, subject.name, subject.year)}>Edit</Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-danger"
                        onClick={() => this.deleteSubjectHandler(subject.barcode)}>Delete</Button>
                    </React.Fragment>
                  }
                </td>
              </tr>
          )
        })
      }
    }

    const subjectForm = { ...this.state.form }

    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <PageHeading>
                <h1>Subjects list</h1>
                <p>You can add, edit, or delete subjects</p>
              </PageHeading>
            </Col>
          </Row>

          <Row>
            <Col lg={10} className="mx-auto mb-5">
              <Button variant="primary" size="sm" onClick={this.toggleAddSubjectFormHandler} className="mb-3">Add Subject</Button>
              {this.state.showAddSubjectForm
                ?
                <AddSubjectForm toggleFormHandler={this.toggleAddSubjectFormHandler} />
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
                      {subjects}
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
          show={this.state.showEditSubject}
          animation
          centered
          onHide={this.toggleEditSubjectHandler}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4>Edit subject data</h4>
            {!this.props.loading
              ? <Form onSubmit={this.formSubmitHandler} id="edit-subject">
                <Row>
                  <Col xs={12} className="text-left">
                    <p>Subject Code: {this.state.editingSubject}</p>
                  </Col>
                  {
                    Object.keys(subjectForm).map(el => {
                      return (
                        <Col key={el} sm={6}>
                          <Form.Label srOnly>{subjectForm[el].label}</Form.Label>
                          <Form.Control
                            {...subjectForm[el].elementConfig}
                            value={subjectForm[el].value}
                            onChange={(e) => this.formFillingHandler(e, el)}
                            onBlur={subjectForm[el].touched ? null : () => this.formTouchedHandler(el)}
                            isInvalid={subjectForm[el].isValid === 'Invalid'}
                            isValid={subjectForm[el].isValid === 'Valid'} />
                          <p className={subjectForm[el].errorMsg ? 'error-msg' : null}>{subjectForm[el].errorMsg}</p>
                        </Col>
                      )
                    })
                  }
                </Row>
                <Row>
                  <Col>
                    {this.props.success
                      ? <p className="text-success">Subject data edited successfully</p>
                      : null
                    }
                  </Col>
                </Row>
              </Form>
              : <Spinner />
            }
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" form="edit-subject" disabled={this.props.loading}>Confirm</Button>
            <Button onClick={() => this.toggleEditSubjectHandler(null)} variant="link">Close</Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    subjects: state.allSubjects.subjects,
    deleting: state.allSubjects.deleting,
    loading: state.allSubjects.loading,
    success: state.allSubjects.success
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchSubjects: (token) => dispatch(actions.fetchSubjects(token)),
    onDeleteSubject: (barcode, token) => dispatch(actions.deleteSubject(barcode, token)),
    onSearchSubjects: (value) => dispatch(actions.searchSubjects(value)),
    onEditSubject: (subjectData, token) => dispatch(actions.editSubject(subjectData, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subjects);