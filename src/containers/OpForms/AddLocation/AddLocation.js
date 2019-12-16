import React, { Component } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Spinner from '../../../components/UI/Spinner/Spinner'
import { validateInput } from '../../../shared/utility'

class AddLocationForm extends Component {

  state = {
    form: {
      name: {
        elementConfig: {
          type: 'text',
          placeholder: 'Hall/Location Name'
        },
        label: 'Hall/Location Name',
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
          type: 'alphanumeric',
          placeholder: 'Hall/Location Code'
        },
        label: 'Hall/Location Code',
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

    let locationData = {}
    Object.keys(updatedForm).map(el => {
      return locationData = {
        ...locationData,
        [el]: updatedForm[el].value
      }
    })
    if (validForm) {
      this.props.onAddLocation(locationData, this.props.token)
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

    const locationForm = { ...this.state.form }

    return (
      <div>
        {!this.props.loading
          ? <Form onSubmit={this.formSubmitHandler} id="add-location">
            <Row>
              {
                Object.keys(locationForm).map(el => {
                  return (
                    <Col key={el} sm={6}>
                      <Form.Label srOnly>{locationForm[el].label}</Form.Label>
                      <Form.Control
                        {...locationForm[el].elementConfig}
                        value={locationForm[el].value}
                        onChange={(e) => this.formFillingHandler(e, el)}
                        onBlur={locationForm[el].touched ? null : () => this.formTouchedHandler(el)}
                        isInvalid={locationForm[el].isValid === 'Invalid' || this.props.errorMsg || (locationForm[el].validation.length === 5 && this.props.error)}
                        isValid={locationForm[el].isValid === 'Valid'} />
                      <p className={locationForm[el].errorMsg ? 'error-msg' : null}>{locationForm[el].errorMsg}</p>
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
                  ? <p className="text-success">Hall/Location added successfully</p>
                  : null
                }
              </Col>
            </Row>
            <Button type="submit" variant="primary" size="sm" form="add-location" disabled={this.props.loading}>Add</Button>
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
    onAddLocation: (locationData, token) => dispatch(actions.uploadData(locationData, 'locations', token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLocationForm)