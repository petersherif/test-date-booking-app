import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Spinner from '../../../components/UI/Spinner/Spinner'
import styles from './AddSubject.module.scss'
import { validateInput } from '../../../shared/utility'

class AddSubjectForm extends Component {

  state = {
    form: {
      name: {
        elementConfig: {
          type: 'text',
          placeholder: 'Subject Name'
        },
        label: 'Subject Name',
        value: '',
        validation: {
          required: true,
          type: 'alphanumeric'
        },
        isValid: '',
        errorMsg: '',
        touched: false
      },
      barcode: {
        elementConfig: {
          type: 'number',
          placeholder: 'Subject Code'
        },
        label: 'Subject Code',
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

  componentDidMount() {
    this.props.onInputChange()
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

    let subjectData = {}
    Object.keys(updatedForm).map(el => {
      return subjectData = {
        ...subjectData,
        [el]: updatedForm[el].value
      }
    })
    if (validForm) {
      this.props.onAddSubject(subjectData, this.props.token)
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

    const subjectForm = { ...this.state.form }

    return (
      <div className={styles.SubmitSubjectform}>
        {!this.props.loading
          ? <Form onSubmit={this.formSubmitHandler} id="add-subject">
            <Row>
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
                        isInvalid={subjectForm[el].isValid === 'Invalid' || this.props.errorMsg || (subjectForm[el].validation.length === 5 && this.props.error)}
                        isValid={subjectForm[el].isValid === 'Valid'} />
                      <p className={subjectForm[el].errorMsg ? 'error-msg' : null}>{subjectForm[el].errorMsg}</p>
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
                  ? <p className="text-success">Subject added successfully</p>
                  : null
                }
              </Col>
            </Row>
            <Button type="submit" variant="primary" size="sm" form="add-subject" disabled={this.props.loading}>Add</Button>
            <Button variant="link" size="sm" onClick={this.props.toggleFormHandler}>Back</Button>
          </Form>
          : <Spinner />
        }
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
    onInputChange: () => dispatch(actions.resetConfirmationMsg()),
    onAddSubject: (subjectData, token) => dispatch(actions.uploadData(subjectData, 'subjects', token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddSubjectForm)