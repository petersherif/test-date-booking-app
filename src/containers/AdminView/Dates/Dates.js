import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import PageHeading from '../../../hoc/PageHeading/PageHeading'
import Button from 'react-bootstrap/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import AddDateForm from '../../OpForms/AddDate/AddDate'
import AddSubjectForm from '../../OpForms/AddSubject/AddSubject'
import AddLocationForm from '../../OpForms/AddLocation/AddLocation'
import DateCard from '../../../components/DateCard/DateCard'
import "react-datepicker/dist/react-datepicker.css"
import Modal from 'react-bootstrap/Modal'
import FormControl from 'react-bootstrap/FormControl'
import ConfirmationMsg from '../../../components/UI/ConfirmationMsg/ConfirmationMsg'


class Dates extends Component {

  state = {
    showAddDateForm: false,
    showAddSubjectForm: false,
    showAddLocationForm: false,
    showPastDates: false,
    showConfirmationModal: false,
    deleting: null,
    togglingLock: null,
    showEditDate: false,
    editingDate: null,
    searching: false,
    searchValue: '',
    dateId: null
  }

  componentDidMount() {
    this.props.onFetchDates(this.props.token)
    this.props.onInputChange()
  }

  toggleAddDateFormHandler = () => {
    this.setState(state => ({ showAddDateForm: !state.showAddDateForm, showAddSubjectForm: false, showAddLocationForm: false }))
  }

  toggleAddSubjectFormHandler = () => {
    this.setState(state => ({ showAddDateForm: !state.showAddDateForm, showAddSubjectForm: !state.showAddSubjectForm }))
  }

  toggleAddLocationFormHandler = () => {
    this.setState(state => ({ showAddDateForm: !state.showAddDateForm, showAddLocationForm: !state.showAddLocationForm }))
  }

  togglePastDatesHandler = () => {
    this.setState(state => ({ showPastDates: !state.showPastDates }))
  }

  deleteDateHandler = (dateId) => {
    this.setState({ deleting: dateId })
    this.props.onDeleteDate(dateId, this.props.token)
  }

  searchHandler = (e) => {

    let value = ''
    if (e.target.value) {
      value = e.target.value.toString()
      this.setState({ searching: true, searchValue: value })
    } else {
      this.setState({ searching: false, searchValue: '' })
    }
    this.props.onSearchDates(value)
  }

  toggleEditDateHandler = (date) => {
    if (date && date.id) {
      this.setState(state => ({ showEditDate: !state.showEditDate, editingDate: date.id }))
    } else {
      this.setState(state => ({ showEditDate: !state.showEditDate, editingDate: null }))
    }
  }

  toggleLockedHandler = (dateId) => {
    this.setState({ togglingLock: dateId })
    let dateToToggle = { ...this.props.dates[dateId] }
    dateToToggle = {
      ...dateToToggle,
      rules: {
        ...dateToToggle.rules,
        locked: !dateToToggle.rules.locked
      }
    }

    this.props.onToggleLockDate(dateToToggle, dateId, this.props.token)
  }

  toggleConfirmationModalHandler = (dateId) => {
    this.props.onResetDateMsg()
    if (dateId === 'cancel') {
      this.setState({
        showConfirmationModal: false,
        dateId: null
      })
    } else {
      this.setState({
        showConfirmationModal: true,
        dateId: dateId
      })
    }
  }

  dateSubmitHandler = () => {
    const dateId = this.state.dateId
    this.deleteDateHandler(dateId)

  }

  render() {

    const dates = this.props.dates
    const pastDates = { ...this.props.pastDates }
    const filledDate = (this.state.editingDate && dates[this.state.editingDate].registered && Object.keys(dates[this.state.editingDate].registered).length > 0)

    const modalDate = this.props.dates || this.props.pastDate ? this.props.dates[this.state.dateId] ? this.props.dates[this.state.dateId] : this.props.pastDates[this.state.dateId] : null

    let datesList = <Spinner />
    let pastDatesList = <Spinner />

    setTimeout(() => {
      if (!dates) {
        datesList = (
          <Col className="text-center pt-5">
            {this.state.searching
              ?
              <p>No results found</p>
              :
              <>
                <p>No future dates</p>
                <Button variant="primary" size="sm" onClick={this.toggleAddDateFormHandler}>Add Date</Button>
              </>
            }
          </Col>
        )
      }
    }, 1500)

    if (dates) {
      if (Object.values(dates).length <= 0) {
        datesList = (
          <Col className="text-center pt-5">
            {this.state.searching
              ?
              <p>No results found</p>
              :
              <>
                <p>No future dates</p>
                <Button variant="primary" size="sm" onClick={this.toggleAddDateFormHandler}>Add Date</Button>
              </>
            }
          </Col>
        )
      } else {
        let lastSubjectName = ''
        datesList = Object.values(dates).sort((a, b) => a.subjectName.localeCompare(b.subjectName)).map(date => {
          let subjectGroup = null
          if (!lastSubjectName || Math.abs(lastSubjectName.localeCompare(date.subjectName))) {
            lastSubjectName = date.subjectName
            subjectGroup = (
              <Col xs={12} key={date.subjectName}>
                <h4 className="mb-3 mt-4">{date.subjectName}</h4>
              </Col>
            )
          }

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
                  onDelete={() => this.toggleConfirmationModalHandler(date.id)}
                  deleting={this.state.deleting}
                  onToggleLocked={() => this.toggleLockedHandler(date.id)}
                  togglingLock={this.state.togglingLock}
                  onEdit={() => this.toggleEditDateHandler(date)}

                  // Date info
                  dateId={date.id}
                  admin

                  // Date states
                  loading={this.props.loading}
                  locked={date.rules.locked} />
              </Col>
            </React.Fragment>
          )
        })

      }
    }

    if (pastDates && Object.values(pastDates).length > 0) {
      let lastSubjectName = ''
      pastDatesList = Object.values(pastDates).sort((a, b) => a.subjectName.localeCompare(b.subjectName)).map(date => {
        let subjectGroup = null
        if (!lastSubjectName || Math.abs(lastSubjectName.localeCompare(date.subjectName))) {
          lastSubjectName = date.subjectName
          subjectGroup = (
            <Col xs={12} key={date.subjectName}>
              <h4 className="mb-3 mt-4">{date.subjectName}</h4>
            </Col>
          )
        }

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
                onDelete={() => this.toggleConfirmationModalHandler(date.id)}
                deleting={this.state.deleting}

                // Date info
                dateId={date.id}
                admin
                pastDate

                // Date states
                loading={this.props.loading}
                locked={date.rules.locked} />
            </Col>
          </React.Fragment>
        )
      })
    }
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <PageHeading>
                <h1>Dates List</h1>
                <p>You can add, edit, delete, view, or lock a date</p>
              </PageHeading>
            </Col>
          </Row>

          <Row>
            <Col sm={10} className="mb-5">
              <Button variant="primary" size="sm" onClick={this.toggleAddDateFormHandler} className="mb-3">Add Date</Button>
              {this.state.showAddDateForm
                ?
                <AddDateForm toggleFormHandler={this.toggleAddDateFormHandler} toggleAddSubjectFormHandler={this.toggleAddSubjectFormHandler} toggleAddLocationFormHandler={this.toggleAddLocationFormHandler} />
                : null
              }
              {this.state.showAddSubjectForm
                ?
                <AddSubjectForm toggleFormHandler={this.toggleAddSubjectFormHandler} />
                : null
              }
              {this.state.showAddLocationForm
                ?
                <AddLocationForm toggleFormHandler={this.toggleAddLocationFormHandler} />
                : null
              }
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mr-auto">
              <FormControl type="text" className="mb-3" placeholder="Search with subject name, hall name, or day" title="Search with subject name, hall name, or day" onChange={this.searchHandler} value={this.state.searchValue} />
            </Col>
          </Row>
          <Row>
            {datesList}
          </Row>
          {pastDates
            ?
            Object.values(pastDates).length > 0
              ?
              <React.Fragment>
                <Row className="mt-5">
                  <Col>
                    <h4 className="mb-3">Past Dates <Button variant="link" size="sm" onClick={this.togglePastDatesHandler}>{this.state.showPastDates ? 'Hide' : 'Show'}</Button></h4>
                    <hr className="w-25 mr-0 mb-4" />
                  </Col>
                </Row>
                {this.state.showPastDates
                  ?
                  <Row>
                    {pastDatesList}
                  </Row>
                  : null}
              </React.Fragment>
              : null
            : <Spinner />
          }
        </Container>
        {dates
          ?
          <>
            <Modal
              show={this.state.showEditDate}
              animation
              centered
              onHide={this.toggleEditDateHandler}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <h4>{filledDate ? 'Edit hall and maximum limit' : 'Edit Date'}</h4>
                <AddDateForm
                  toggleFormHandler={this.toggleEditDateHandler}
                  date={this.state.editingDate && dates[this.state.editingDate]}
                  filledDate={filledDate} />
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
                      Date Deleted
                    </ConfirmationMsg>
                  </Modal.Body>
                  :
                  this.props.error
                    ?
                    <Modal.Body>
                      <ConfirmationMsg failed>
                        Failed to delete the date, please try again later
                    </ConfirmationMsg>
                    </Modal.Body>
                    :
                    modalDate
                      ?
                      <>
                        <Modal.Body>
                          <p>Do you want to delete the following date?</p>
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
                          <Button variant="primary" size="sm" onClick={this.dateSubmitHandler}>Delete Date</Button>
                          <Button variant="link" size="sm" onClick={() => this.toggleConfirmationModalHandler('cancel')}>Back</Button>
                        </Modal.Footer>
                      </>
                      :
                      null
                :
                <Spinner />
              }
            </Modal>
          </>
          : null}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    loading: state.dates.loading,
    success: state.dates.success,
    error: state.dates.error,
    dates: state.dates.dates,
    pastDates: state.dates.pastDates
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInputChange: () => dispatch(actions.resetAddDateMsg()),
    onFetchDates: (token) => dispatch(actions.fetchDates(token)),
    onDeleteDate: (dateId, token) => dispatch(actions.deleteDate(dateId, token)),
    onToggleLockDate: (dateData, dateId, token) => dispatch(actions.editDate(dateData, dateId, token)),
    onSearchDates: (value) => dispatch(actions.searchDates(value)),
    onResetDateMsg: () => dispatch(actions.resetAddDateMsg())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dates);