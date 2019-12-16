import React, { Component } from 'react'
import BgImg from '../../assets/images/login-page-background.png'
import styles from './Auth.module.scss'
import Logo from '../../components/UI/Logo/Logo'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { validateInput } from '../../shared/utility'
import { connect } from 'react-redux'
import * as actions from '../../store/actions'

class Auth extends Component {
  state = {
    authForm: {
      studendCode: {
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
      }
    }
  }

  formSubmitHandler = e => {
    e.preventDefault()
    const updatedAuthForm = { ...this.state.authForm }
    Object.keys(updatedAuthForm).map(el => {
      return updatedAuthForm[el] = validateInput(updatedAuthForm, el)
    })

    // If at least one field invalid, the whole form is invalid
    let validForm = true
    for (let formEl in updatedAuthForm) {
      validForm = (updatedAuthForm[formEl].isValid === 'Valid' || !updatedAuthForm[formEl].validation.required) && validForm
    }

    this.setState({ authForm: updatedAuthForm })

    if (validForm) {
      this.props.onLoginSubmit(this.state.authForm.studendCode.value)
    }
  }

  formTouchedHandler = el => {
    const updatedAuthForm = { ...this.state.authForm }
    const updatedFormElement = { ...updatedAuthForm[el] }
    if(updatedFormElement.value) {
      updatedFormElement.touched = true
      updatedAuthForm[el] = updatedFormElement
      updatedAuthForm[el] = validateInput(updatedAuthForm, el)
    }

    this.setState({ authForm: updatedAuthForm })
  }

  formFillingHandler = (e, el) => {
    if (this.props.errorMsg) {
      this.props.onResetGlobalErrorMsg();
    }

    const value = e.target.value;
    const updatedAuthForm = { ...this.state.authForm }
    const updatedFormElement = { ...updatedAuthForm[el] }
    updatedFormElement.value = value
    updatedAuthForm[el] = updatedFormElement

    if (updatedAuthForm[el].touched || value.length === updatedAuthForm[el].validation.length) {
      updatedAuthForm[el].touched = true
      updatedAuthForm[el] = validateInput(updatedAuthForm, el)
    }

    this.setState({ authForm: updatedAuthForm })
  }

  render() {

    const authForm = { ...this.state.authForm }

    return (
      <div className={styles.Auth}>
        <div className={styles.LoginBg} style={{ backgroundImage: `url(${BgImg})` }}></div>
        <div className={styles.LoginBox}>
          <header className={styles.LoginHeader}>
            <h1 className={styles.Headline}>Date Booking</h1>
            <Logo className={styles.Logo} alt="Test Date Booking App" />
            <h4 className={styles.LogoCaption}>Test Date<br />Booking Application</h4>
          </header>
          <div className={styles.LoginBody}>
            <Form className={styles.LoginForm} onSubmit={this.formSubmitHandler}>
              {
                Object.keys(authForm).map(el => {
                  return (
                    <Form.Group className="mb-2" key={el}>
                      <Form.Label srOnly>{authForm[el].label}</Form.Label>
                      <Form.Control
                        {...authForm[el].elementConfig}
                        value={authForm[el].value}
                        onChange={(e) => this.formFillingHandler(e, el)}
                        onBlur={authForm[el].touched ? null : () => this.formTouchedHandler(el)}
                        isInvalid={authForm[el].isValid === 'Invalid' || this.props.errorMsg}
                        isValid={authForm[el].isValid === 'Valid'} />
                      <p className={authForm[el].errorMsg ? 'error-msg' : null}>{authForm[el].errorMsg}</p>
                    </Form.Group>
                  )
                })
              }
              <Button variant="primary" type="submit" block>{!this.props.loading ? 'Login' : 'Logging you in...' }</Button>
              <p className={this.props.errorMsg ? 'error-msg' : null}>{this.props.errorMsg}</p>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errorMsg: state.auth.errorMsg,
    loading: state.auth.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoginSubmit: (userId) => {dispatch(actions.auth(userId))},
    onResetGlobalErrorMsg: () => dispatch(actions.resetGlobalErrorMsg())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);