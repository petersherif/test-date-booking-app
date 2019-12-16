import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import { validateInput, formatAMPM, getWeekDay } from '../../../shared/utility'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Link } from 'react-router-dom'
import Spinner from '../../../components/UI/Spinner/Spinner'
import BSSpinner from 'react-bootstrap/Spinner'
import styles from './AddDate.module.scss'

class AddDateForm extends Component {

  state = {
    date: {
      fullDate: new Date().setHours(18, 0, 0, 0),
      weekDay: getWeekDay(new Date(new Date().setHours(18, 0, 0, 0)).getUTCDay()),
      time: formatAMPM(new Date(new Date().setHours(18, 0, 0, 0))).toLocaleString(),
      dayDate: new Date(new Date().setHours(18, 0, 0, 0)).toLocaleDateString()
    },
    year: null,
    form: {
      subject: {
        elementConfig: {
          type: 'select',
          placeholder: 'Choose a subject'
        },
        label: 'Subject name',
        value: '',
        validation: {
          required: true
        },
        isValid: '',
        errorMsg: '',
        touched: false
      },
      location: {
        elementConfig: {
          type: 'select',
          placeholder: 'Choose a hall/location'
        },
        label: 'Location',
        value: '',
        validation: {
          required: true
        },
        isValid: '',
        errorMsg: '',
        touched: false
      },
      maxLimit: {
        elementConfig: {
          type: 'number',
          placeholder: 'Maximum to register'
        },
        label: 'Maximum to register',
        value: '',
        validation: {
          required: true
        },
        isValid: '',
        errorMsg: '',
        touched: false
      }
    }
  }

  componentDidMount() {
    this.props.onFetchSubjects(this.props.token)
    this.props.onFetchLocations(this.props.token)
    this.props.onInputChange()

    if (this.props.date) {
      this.editingDateFormFillingHandler(this.props.date)
    }
  }

  dateFillingHandler = (date) => {
    if (date) {
      const weekDay = getWeekDay(date.getUTCDay())
      const time = formatAMPM(date).toLocaleString()
      const dayDate = date.toLocaleDateString()
      const updatedFormElement = { ...this.state.date }

      updatedFormElement.fullDate = date.getTime()
      updatedFormElement.weekDay = weekDay
      updatedFormElement.time = time
      updatedFormElement.dayDate = dayDate

      this.setState({ date: updatedFormElement })
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
    const value = e.target.value;
    const updatedForm = { ...this.state.form }
    const updatedFormElement = { ...updatedForm[el] }
    updatedFormElement.value = value
    updatedForm[el] = updatedFormElement

    let year = this.state.year
    if (el === "subject") {
      year = Object.values(this.props.subjects).filter(sub => sub.barcode.toString() === value.toString())
      year = year[0].year
    }

    if (updatedForm[el].elementConfig.type !== 'number') {
      updatedForm[el] = validateInput(updatedForm, el)
    }

    if (updatedForm[el].touched || value.length === updatedForm[el].validation.length) {
      updatedForm[el].touched = true
      updatedForm[el] = validateInput(updatedForm, el)
    }

    this.setState({ form: updatedForm, year: year })
  }

  formSubmitHandler = e => {
    e.preventDefault()
    if (this.props.filledDate) {
      const updatedForm = { ...this.state.form }

      updatedForm.maxLimit = validateInput(updatedForm, 'maxLimit')
      updatedForm.location = validateInput(updatedForm, 'location')

      let validForm = updatedForm.maxLimit.isValid === 'Valid' && updatedForm.location.isValid === 'Valid'

      this.setState({ form: updatedForm })

      if (validForm) {
        let newMaxLimit = updatedForm.maxLimit.value
        let newLocation = this.props.locations[updatedForm.location.value]
        this.props.onEditDate([newMaxLimit, newLocation], this.props.date.id, this.props.token)
      }

    } else {
      const updatedForm = { ...this.state.form }
      const date = { ...this.state.date }
      const year = this.state.year

      Object.keys(updatedForm).map(el => {
        return updatedForm[el] = validateInput(updatedForm, el)
      })

      // If at least one field invalid, the whole form is invalid
      let validForm = true
      for (let formEl in updatedForm) {
        validForm = (updatedForm[formEl].isValid === 'Valid' || !updatedForm[formEl].validation.required) && validForm
      }

      this.setState({ form: updatedForm })

      if (validForm) {
        let dateData = {
          location: this.props.locations[updatedForm.location.value].name,
          locationCode: updatedForm.location.value,
          subjectCode: updatedForm.subject.value,
          subjectName: this.props.subjects[updatedForm.subject.value].name,
          maxLimit: updatedForm.maxLimit.value,
          year: year,
          date: date,
          registered: 0,
          rules: {
            changeable: true,
            editable: true,
            removable: true,
            state: "normal"
          }
        }

        if (this.props.date) {
          this.props.onEditDate(dateData, this.props.date.id, this.props.token)
        } else {
          this.props.onAddDate(dateData, this.props.token)
        }
      }
    }
  }

  editingDateFormFillingHandler = (editingDate) => {
    const updatedForm = { ...this.state.form }
    let updatedYear = this.state.year

    Object.keys(updatedForm).map(el => {
      if (el === 'subject') {
        return updatedForm.subject.value = editingDate.subjectCode
      }
      if (el === 'location') {
        return updatedForm.location.value = editingDate.locationCode
      }
      return updatedForm[el].value = editingDate[el]
    })

    updatedYear = editingDate.year

    this.setState({ year: updatedYear, form: updatedForm })

    this.dateFillingHandler(new Date(editingDate.date.fullDate))
  }

  deleteSubjectHandler = (barcode) => {
    this.props.onDeleteSubject(barcode, this.props.token)
  }

  deleteLocationHandler = (barcode) => {
    this.props.onDeleteLocation(barcode, this.props.token)
  }

  render() {

    const date = { ...this.state.date }
    const form = { ...this.state.form }
    const editingDate = this.props.date ? { ...this.props.date } : null
    const subjects = this.props.subjects
    const locations = this.props.locations
    const filledDate = this.props.filledDate

    return (

      <div className={styles.AddStudents}>
        {!this.props.loading
          ?
          <Form onSubmit={this.formSubmitHandler} id="add-date">
            <Row>
              {subjects && locations
                ?
                <React.Fragment>
                  {
                    filledDate
                      ?
                      <>
                        <Col sm={6}>
                          <Form.Label srOnly>{form.location.label}</Form.Label>
                          <Form.Control as="select"
                            onChange={(e) => this.formFillingHandler(e, 'location')}
                            isInvalid={form.location.isValid === 'Invalid' || this.props.errorMsg}
                            isValid={form.location.isValid === 'Valid'}
                            value={form.location.value}>
                            <option value="">{form.location.elementConfig.placeholder}</option>
                            {
                              Object.values(locations).map(location => {
                                return <option
                                  key={location.barcode}
                                  value={location.barcode}>
                                  {location.name}
                                </option>
                              })
                            }
                          </Form.Control>
                          {!editingDate
                            ?
                            <>
                              <Button variant="link" size="sm" className="text-primary pr-0" onClick={this.props.toggleAddLocationFormHandler}>إضافة مكان</Button>
                              {this.state.form.location.value
                                ?
                                this.props.deletingLocation
                                  ?
                                  <BSSpinner animation="border" variant="primary" size="sm" />
                                  :
                                  <Button variant="link" size="sm" className="text-primary pr-0" onClick={() => this.deleteLocationHandler(this.state.form.location.value)}>حذف</Button>
                                : null
                              }
                            </>
                            : null
                          }
                          <p className={form.location.errorMsg ? 'error-msg' : null}>{form.location.errorMsg}</p>
                        </Col>
                        <Col sm={6}>
                          <Form.Label srOnly>{form.maxLimit.label}</Form.Label>
                          <Form.Control
                            {...form.maxLimit.elementConfig}
                            value={form.maxLimit.value}
                            onChange={(e) => this.formFillingHandler(e, 'maxLimit')}
                            onBlur={form.maxLimit.touched ? null : () => this.formTouchedHandler('maxLimit')}
                            isInvalid={form.maxLimit.isValid === 'Invalid' || this.props.errorMsg}
                            isValid={form.maxLimit.isValid === 'Valid'} />
                          <p className={form.maxLimit.errorMsg ? 'error-msg' : null}>{form.maxLimit.errorMsg}</p>
                        </Col>
                      </>
                      :
                      <React.Fragment>
                        {Object.keys(form).map(el => {
                          return (
                            el === 'subject' && form[el].elementConfig.type === 'select'
                              ?
                              <Col key={el} sm={6} md={4}>
                                <Form.Label srOnly>{form[el].label}</Form.Label>
                                <Form.Control as="select"
                                  onChange={(e) => this.formFillingHandler(e, el)}
                                  isInvalid={form[el].isValid === 'Invalid' || this.props.errorMsg}
                                  isValid={form[el].isValid === 'Valid'}
                                  value={form[el].value}>
                                  <option value="">{form[el].elementConfig.placeholder}</option>
                                  <optgroup label="1st year">
                                    {
                                      Object.values(subjects).map(subject => {
                                        if (subject.year === 1 || subject.year === "1") {
                                          return <option
                                            key={subject.barcode}
                                            value={subject.barcode}>
                                            {subject.name}
                                          </option>
                                        } else return null
                                      })
                                    }
                                  </optgroup>
                                  <optgroup label="2nd year">
                                    {
                                      Object.values(subjects).map(subject => {
                                        if (subject.year === 2 || subject.year === "2") {
                                          return <option
                                            key={subject.barcode}
                                            value={subject.barcode}>
                                            {subject.name}
                                          </option>
                                        } else return null
                                      })
                                    }
                                  </optgroup>
                                </Form.Control>
                                {!editingDate
                                  ?
                                  <>
                                    <Button variant="link" size="sm" className="text-primary pr-0" onClick={this.props.toggleAddSubjectFormHandler}>Add Subject</Button>
                                    {this.state.form.subject.value
                                      ?
                                      this.props.deletingSubject
                                        ?
                                        <BSSpinner animation="border" variant="primary" size="sm" />
                                        :
                                        <Button variant="link" size="sm" className="text-primary pr-0" onClick={() => this.deleteSubjectHandler(this.state.form.subject.value)}>Delete</Button>
                                      :
                                      <Link to="/all-subjects/" className="btn btn-link btn-sm text-primary pr-0">Show all</Link>
                                    }
                                  </>
                                  : null
                                }
                                <p className={form[el].errorMsg ? 'error-msg' : null}>{form[el].errorMsg}</p>
                              </Col>
                              : el === 'location' && form[el].elementConfig.type === 'select'
                                ?
                                <Col key={el} sm={6} md={4}>
                                  <Form.Label srOnly>{form[el].label}</Form.Label>
                                  <Form.Control as="select"
                                    onChange={(e) => this.formFillingHandler(e, el)}
                                    isInvalid={form[el].isValid === 'Invalid' || this.props.errorMsg}
                                    isValid={form[el].isValid === 'Valid'}
                                    value={form[el].value}>
                                    <option value="">{form[el].elementConfig.placeholder}</option>
                                    {
                                      Object.values(locations).map(location => {
                                        return <option
                                          key={location.barcode}
                                          value={location.barcode}>
                                          {location.name}
                                        </option>
                                      })
                                    }
                                  </Form.Control>
                                  {!editingDate
                                    ?
                                    <>
                                      <Button variant="link" size="sm" className="text-primary pr-0" onClick={this.props.toggleAddLocationFormHandler}>Add Hall/Location</Button>
                                      {this.state.form.location.value
                                        ?
                                        this.props.deletingLocation
                                          ?
                                          <BSSpinner animation="border" variant="primary" size="sm" />
                                          :
                                          <Button variant="link" size="sm" className="text-primary pr-0" onClick={() => this.deleteLocationHandler(this.state.form.location.value)}>Delete</Button>
                                        : null
                                      }
                                    </>
                                    : null
                                  }
                                  <p className={form[el].errorMsg ? 'error-msg' : null}>{form[el].errorMsg}</p>
                                </Col>
                                :
                                <Col key={el} sm={6} md={4}>
                                  <Form.Label srOnly>{form[el].label}</Form.Label>
                                  <Form.Control
                                    {...form[el].elementConfig}
                                    title={form[el].label}
                                    value={form[el].value}
                                    onChange={(e) => this.formFillingHandler(e, el)}
                                    onBlur={form[el].touched ? null : () => this.formTouchedHandler(el)}
                                    isInvalid={form[el].isValid === 'Invalid' || this.props.errorMsg}
                                    isValid={form[el].isValid === 'Valid'} />
                                  <p className={form[el].errorMsg ? 'error-msg' : null}>{form[el].errorMsg}</p>
                                </Col>
                          )
                        })}
                        <Col sm={6} md={4}>
                          <DatePicker
                            selected={date.fullDate}
                            onChange={this.dateFillingHandler}
                            dateFormat="EEE d MMM yyyy"
                            minDate={new Date()}
                            required
                            className="form-control" />
                          <p className={date.errorMsg ? 'error-msg' : null}>{date.errorMsg}</p>
                        </Col>
                        <Col sm={6} md={4}>
                          <DatePicker
                            selected={date.fullDate}
                            onChange={this.dateFillingHandler}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            required
                            dateFormat="h:mm aa"
                            className="form-control" />
                          <p className={date.errorMsg ? 'error-msg' : null}>{date.errorMsg}</p>
                        </Col>
                      </React.Fragment>
                  }
                  <Col xs={12}>
                    <Button type="submit" size="sm" variant="primary" form="add-date" disabled={this.props.loading || !this.props.subjects}>{editingDate ? 'Edit' : 'Add'}</Button>
                    <Button variant="link" size="sm" onClick={this.props.toggleFormHandler}>Close</Button>
                  </Col>
                </React.Fragment>
                : <Spinner />
              }
            </Row>
            <Row>
              <Col>
                {this.props.error
                  ? <p className="error-msg">{this.props.error}</p>
                  : null
                }
                {this.props.success
                  ? <p className="text-success">Date {editingDate ? 'edited' : 'added'} successfully</p>
                  : null
                }
              </Col>
            </Row>
          </Form>
          : <Spinner />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    subjects: state.allSubjects.subjects,
    loading: state.dates.loading,
    success: state.dates.success,
    error: state.dates.error,
    locations: state.allLocations.locations,
    deletingLocation: state.allLocations.deleting,
    deletingSubject: state.allSubjects.deleting
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchSubjects: (token) => dispatch(actions.fetchSubjects(token)),
    onFetchLocations: (token) => dispatch(actions.fetchLocations(token)),
    onAddDate: (dateData, token) => dispatch(actions.addDate(dateData, token)),
    onEditDate: (dateData, dateId, token, studentId, $delete) => dispatch(actions.editDate(dateData, dateId, token, studentId, $delete)),
    onDeleteLocation: (barcode, token) => dispatch(actions.deleteLocation(barcode, token)),
    onDeleteSubject: (barcode, token) => dispatch(actions.deleteSubject(barcode, token)),
    onInputChange: () => dispatch(actions.resetAddDateMsg()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDateForm);