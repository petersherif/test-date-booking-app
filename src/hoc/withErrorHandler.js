import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal'


const withErrorHandler = (WrappedComponent, axios) => {

  return class extends Component {
    constructor(props) {
      super(props)
      this.reqInterceptor = axios.interceptors.request.use(request => {
        this.setState({ error: null })
        return request
      })
      this.resInterceptor = axios.interceptors.response.use(response => {
        return response
      }, error => {
        this.setState({ error: error })
      })
    }

    state = {
      error: null
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null })
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    render() {

      return <React.Fragment>
        <Modal
          show={this.state.error !== null}
          animation
          centered
          onHide={this.errorConfirmedHandler}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            {this.state.error
              ? this.state.error.message === 'Network Error'
                ? <p>Your internet is disconnected, please check your internet connection and reload the page</p>
                : this.state.error.response.status === 404
                  ? <p>Can't reach our servers, please reload the page</p>
                  : <p>Sorry, a problem has occured, please try again later</p>
              : null}
          </Modal.Body>
        </Modal>
        <WrappedComponent {...this.props} />
      </React.Fragment>
    }
  }
};

export default withErrorHandler;