import React, { Component } from 'react'
import DateCard from '../../../components/DateCard/DateCard'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import PageHeading from '../../../hoc/PageHeading/PageHeading'
import styles from './DateBooking.module.scss'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import Spinner from '../../../components/UI/Spinner/Spinner'
import axios from '../../../axios'
import ConfirmationMsg from '../../../components/UI/ConfirmationMsg/ConfirmationMsg'

class DateBooking extends Component {

  state = {
    booking: null,
    showConfirmationModal: false,
    fullDate: '',
    dateId: null,
    subjectCode: null,
    studentId: null,
    dateAction: '',
    passedSubjects: null
  }

  componentDidMount() {
    axios.get('/students/' + this.props.userId + '.json?auth=' + this.props.token)
      .then(response => {
        const student = response.data
        if (student.passedSubjects) {
          this.setState({ passedSubjects: response.data.passedSubjects })
        } else {
          this.setState({ passedSubjects: [] })
        }
        this.props.onFetchDates(this.props.token)
      })
      .catch(error => {
        console.log(error.response)
      })
  }

  bookDateHandler = (dateId, subjectCode, studentId) => {
    // Add studentId to date's registered list
    this.setState({ booking: subjectCode })
    axios.get('/dates/' + dateId + '.json?auth=' + this.props.token)
      .then(response => {
        let bookedDate = { ...response.data }
        if ((bookedDate.registered === 0 || Object.keys(bookedDate.registered).length < Number(bookedDate.maxLimit)) && !bookedDate.rules.locked) {
          this.props.onBookDate(bookedDate, dateId, this.props.token, studentId)
        } else {
          this.setState({ fullDate: 'Can\'t be reserved, the date was completed or locked without showing that here, sorry for that!' })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  cancelDateHandler = (dateId, studentId) => {
    this.setState({ booking: dateId })
    axios.get('/dates/' + dateId + '.json?auth=' + this.props.token)
      .then(response => {
        let bookedDate = { ...response.data }
        if (bookedDate.registered && Object.keys(bookedDate.registered).indexOf(studentId) !== -1) {
          this.props.onBookDate(bookedDate, dateId, this.props.token, studentId, 'delete')
        } else {
          console.log('Not Found')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  togglefullDateHandler = () => {
    this.setState({ fullDate: '' })
    this.props.onFetchDates(this.props.token)
  }

  toggleConfirmationModalHandler = (dateId, subjectCode, studentId, action) => {
    this.props.onResetDateMsg()
    if (dateId === 'cancel') {
      this.setState({
        showConfirmationModal: false,
        dateId: null,
        subjectCode: null,
        studentId: null
      })
    } else if (action === 'book') {
      this.setState({
        showConfirmationModal: true,
        dateId: dateId,
        subjectCode: subjectCode,
        studentId: studentId,
        dateAction: 'book'
      })
    } else if (action === 'unbook') {
      this.setState({
        showConfirmationModal: true,
        dateId: dateId,
        subjectCode: subjectCode,
        studentId: studentId,
        dateAction: 'unbook'
      })
    }

  }

  dateSubmitHandler = (action) => {
    const { dateId, subjectCode, studentId } = this.state
    if (action === 'book') {
      this.bookDateHandler(dateId, subjectCode, studentId)
    } else if (action === 'unbook') {
      this.cancelDateHandler(dateId, studentId)
    }
  }

  render() {

    let dates = this.props.dates

    const modalDate = this.props.dates ? this.props.dates[this.state.dateId] : null

    let dateCards = <Spinner />

    if (dates && this.state.passedSubjects) {
      dates = Object.values(dates).filter(date => this.state.passedSubjects.indexOf(Number(date.subjectCode)) === -1)
      if (Object.keys(dates).length === 0) {
        dateCards = (
          <Col className="text-center pt-5">
            <p>No available dates at the moment, please, check again later!</p>
          </Col>
        )
      } else {
        let lastSubjectName = ''
        dateCards = Object.values(dates)
          .filter(date => this.state.passedSubjects.indexOf(Number(date.subjectCode)) === -1)
          .sort((a, b) => a.subjectName.localeCompare(b.subjectName))
          .map(date => {
            let subjectGroup = null
            if (!lastSubjectName || Math.abs(lastSubjectName.localeCompare(date.subjectName))) {
              lastSubjectName = date.subjectName
              subjectGroup = (
                <Col xs={12} key={date.subjectName}>
                  <h4 className="mb-3 mt-4">{date.subjectName}</h4>
                </Col>
              )
            }
  
            let anotherBooked = Object.values(dates).filter(anotherDate => anotherDate.subjectName === date.subjectName && anotherDate.id !== date.id).filter(anotherDate => {
              return anotherDate.registered && Object.keys(anotherDate.registered).indexOf(this.props.userId) !== -1
            }).length > 0
  
            return (
              <React.Fragment key={date.id}>
                {subjectGroup}
                <Col sm={6}>
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
                    onBookDate={() => this.toggleConfirmationModalHandler(date.id, date.subjectCode, this.props.userId, 'book')}
                    booking={this.state.booking}
                    onCancelDate={() => this.toggleConfirmationModalHandler(date.id, date.subjectCode, this.props.userId, 'unbook')}
  
                    // Date info
                    booked={date.registered && Object.keys(date.registered).indexOf(this.props.userId) !== -1}
                    anotherBooked={anotherBooked}
                    dateId={date.id}
                    subjectCode={date.subjectCode}
  
                    // Date states
                    loading={this.props.loading}
                    locked={date.rules.locked}
                    changeable={date.rules.changeable} />
                </Col>
              </React.Fragment>
            )
          })
      }
    }

    return (
      <Container>
        <Row>
          <Col>
            <PageHeading>
              <h1>Reserve a Test Date</h1>
              <p>Choose the suitable date from the following</p>
            </PageHeading>
          </Col>
        </Row>

        <div className={styles.DateBooking}>
          <Row>
            <Col>
              <p>
                <Link to="my-dates">Show all your reserved dates</Link>
              </p>
            </Col>
          </Row>
          <Row>
            {dateCards}
          </Row>
        </div>
        <Modal
          show={this.state.fullDate !== ''}
          animation
          centered
          onHide={this.togglefullDateHandler}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <p>{this.state.fullDate}</p>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.showConfirmationModal}
          animation
          centered
          onHide={!this.props.loading ? () => this.toggleConfirmationModalHandler('cancel') : () => null}>
          <Modal.Header closeButton></Modal.Header>
          {!this.props.loading
            ?
            this.props.success
              ?
              <Modal.Body>
                <ConfirmationMsg>
                  {this.state.dateAction === 'unbook' ? 'You reservation is canceled' : 'Your date is reserved'} successfully!
                </ConfirmationMsg>
              </Modal.Body>
              :
              this.props.error
                ?
                <Modal.Body>
                  <ConfirmationMsg failed>
                    Failed to {this.state.dateAction === 'unbook' ? 'cancel your reservation' : 'reserve your date'}!
                </ConfirmationMsg>
                </Modal.Body>
                :
                modalDate
                  ?
                  <>
                    <Modal.Body>
                      <p>Do you want to {this.state.dateAction === 'unbook' ? 'cancel the following reservation' : 'reserve the following date'}</p>
                      <DateCard
                        // Date data
                        filled={modalDate.registered && Object.keys(modalDate.registered).length}
                        limit={modalDate.maxLimit}
                        subjectName={`Subject - ${modalDate.subjectName}`}
                        weekDay={modalDate.date.weekDay}
                        dayDate={modalDate.date.dayDate}
                        time={modalDate.date.time}
                        location={modalDate.location}

                        // Date actions

                        // Date info
                        modal

                        // Date states

                        // Custom style
                        style={{ marginBottom: '0', boxShadow: 'none', minHeight: 'auto' }} />
                    </Modal.Body>
                    <Modal.Footer style={{ paddingTop: '0' }}>
                      <Button variant="primary" size="sm" onClick={() => this.dateSubmitHandler(this.state.dateAction)}>{this.state.dateAction === 'unbook' ? 'Cancel Reservation' : 'Confirm Reservation'}</Button>
                      <Button variant="link" size="sm" onClick={() => this.toggleConfirmationModalHandler('cancel')}>Back</Button>
                    </Modal.Footer>
                  </>
                  :
                  null
            :
            <Spinner />
          }
        </Modal>
      </Container >
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    dates: state.dates.dates,
    loading: state.dates.loading,
    userId: localStorage.getItem('smbsiUserId'),
    success: state.dates.success,
    error: state.dates.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchDates: (token) => dispatch(actions.fetchDates(token)),
    onBookDate: (dateData, dateId, studentId, token, $delete) => dispatch(actions.editDate(dateData, dateId, studentId, token, $delete)),
    onResetDateMsg: () => dispatch(actions.resetAddDateMsg())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateBooking);