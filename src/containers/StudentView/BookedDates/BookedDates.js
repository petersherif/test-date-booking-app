import React, { Component } from 'react'
import DateCard from '../../../components/DateCard/DateCard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PageHeading from '../../../hoc/PageHeading/PageHeading'
import { Link } from 'react-router-dom'
import axios from '../../../axios'
import styles from './BookedDates.module.scss'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Spinner from '../../../components/UI/Spinner/Spinner'

class BookedDates extends Component {

  state = {
    booking: null
  }

  componentDidMount() {
    this.props.onFetchDates(this.props.token)
  }

  cancelDateHandler = (dateId, studentId) => {
    this.setState({ booking: dateId })
    axios.get('/dates/' + dateId + '.json?auth=' + this.props.token)
      .then(response => {
        let bookedDate = { ...response.data }
        if (bookedDate.registered && Object.keys(bookedDate.registered).indexOf(studentId) !== -1) {
          this.props.onUnbookDate(bookedDate, dateId, this.props.token, studentId, 'delete')
        } else {
          console.log('Not Found')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {

    const dates = this.props.dates

    let dateCards = <Spinner />

    if (dates) {
      if (Object.values(dates).filter(date => date.registered && Object.keys(date.registered).indexOf(this.props.userId) !== -1).length <= 0) {
        dateCards = (
          <Col className="text-center pt-5">
            <p>You haven't reserved dates yet</p>
            <Link to="/date-booking" variant="primary" size="sm" onClick={this.toggleAddDateFormHandler}>Reserve a Date</Link>
          </Col>
        )
      } else {
        dateCards = Object.values(dates).filter(date => date.registered && Object.keys(date.registered).indexOf(this.props.userId) !== -1).map(date => {
          return (
            <Col sm={6} key={date.id}>
              <DateCard
                // Date data
                filled={date.registered && Object.keys(date.registered).length}
                limit={date.maxLimit}
                subjectName={date.subjectName}
                weekDay={date.date.weekDay}
                dayDate={date.date.dayDate}
                time={date.date.time}
                location={date.location}

                // Date actions
                onCancelDate={() => this.cancelDateHandler(date.id, this.props.userId)}
                booking={this.state.booking}

                // Date info
                booked={date.registered && Object.keys(date.registered).indexOf(this.props.userId) !== -1}
                dateId={date.id}

                // Date states
                loading={this.props.loading}
                locked={date.rules.locked}
                changeable={date.rules.changeable} />
            </Col>
          )
        })
      }
    }

    return (
      <Container>
        <Row>
          <Col>
            <PageHeading>
              <h1>Your Booked Dates</h1>
              <p>The following dates is reserved, please attend each test at time</p>
            </PageHeading>
          </Col>
        </Row>

        <div className={styles.BookedDates}>
          <Row>
            {dateCards}
          </Row>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    dates: state.dates.dates,
    loading: state.dates.loading,
    userId: localStorage.getItem('smbsiUserId')
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchDates: (token) => dispatch(actions.fetchDates(token)),
    onUnbookDate: (dateData, dateId, token, studentId, $delete) => dispatch(actions.editDate(dateData, dateId, token, studentId, $delete))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookedDates);