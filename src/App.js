import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Auth from './containers/Auth/Auth'
import DateBooking from './containers/StudentView/DateBooking/DateBooking'
import BookedDates from './containers/StudentView/BookedDates/BookedDates'
import AllStudents from './containers/AdminView/Students/Students';
import AllSubjects from './containers/AdminView/Subjects/Subjects';
import AllDates from './containers/AdminView/Dates/Dates';
import DateFullDetails from './containers/AdminView/DateFullDetails/DateFullDetails'
import Logout from './containers/Auth/Logout/Logout'
import { connect } from 'react-redux'
import * as actions from './store/actions'
import withErrorHandler from './hoc/withErrorHandler'
import axios from './axios'

class App extends Component {

  componentDidMount() {
    this.props.onAutoLoginAttempt()
  }

  render() {

    let routes = (
      <Switch>
        <Route path="/login" component={Auth} />
        <Redirect to="/login" />
      </Switch>
    )

    if (this.props.isAdmin) {
      routes = (
        <Layout>
          <Switch>
            <Route path="/all-dates/:dateId" component={DateFullDetails} />
            <Route path="/all-dates" component={AllDates} />
            <Route path="/all-students" component={AllStudents} />
            <Route path="/all-subjects" component={AllSubjects} />
            <Route path="/logout" component={Logout} />
            <Redirect to="/all-dates" />
          </Switch>
        </Layout>
      )
    } else if (this.props.loggedIn) {
      routes = (
        <Layout>
          <Switch>
            <Route path="/date-booking" component={DateBooking} />
            <Route path="/my-dates" component={BookedDates} />
            <Route path="/logout" component={Logout} />
            <Redirect to="/date-booking" />
          </Switch>
        </Layout>
      )
    }

    return (
      <BrowserRouter>
        <div className="App">
          {routes}
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.auth.userId !== null,
    isAdmin: state.auth.userId !== null && state.auth.isAdmin
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAutoLoginAttempt: () => dispatch(actions.autoLoginAttempt())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(App, axios));
