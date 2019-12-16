import React from 'react';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ProgressBar from '../UI/ProgressBar/ProgressBar'
import styles from './DateCard.module.scss'
import Spinner from '../UI/Spinner/Spinner'
import BSSpinner from 'react-bootstrap/Spinner'
import lockedIcon from '../../assets/images/Lock.png'
import { Link } from 'react-router-dom'

const DateCard = props => {

  const {
    // Date data
    filled,
    limit,

    // Date actions (Admin)
    onDelete,
    deleting,
    onToggleLocked,
    togglingLock,
    onEdit,

    // Date actions (Student)
    onBookDate,
    booking,
    onCancelDate,

    // Date info
    dateId,
    subjectCode,
    modal,

    // Date info (Admin)
    admin,
    pastDate,

    // Date info (Student)
    booked,
    bookedPage,
    anotherBooked,

    // Date states
    loading,
    locked,
    changeable,
    exporting
    // date
  } = props
  // const nowDate = new Date()
  const filledPercentage = filled / limit * 100
  const maxed = filled * 100 / limit === 100

  return (
    <React.Fragment>
      <div className={`${(locked && styles.DateCardLocked) || ''} ${(maxed && styles.DateCardFull) || ''} ${styles.DateCard}`} style={props.style}>
        {loading && deleting === dateId
          ?
          <div className={styles.DeletingSpinner}>
            <Spinner style={{ margin: '20.5px auto' }} />
          </div>
          : exporting
            ?
            <div className={styles.Exporting}>
              <Row>
                <Col sm={7}>
                  <Row>
                    <Col xs={4}>
                      <p>Subject:</p>
                    </Col>
                    <Col xs={8}>
                      <p><span>{props.subjectName}</span></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      <p>Date:</p>
                    </Col>
                    <Col xs={8}>
                      <p><span>{props.weekDay.slice(0, 3)} {props.dayDate} {props.time}</span></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      <p>Hall:</p>
                    </Col>
                    <Col xs={8}>
                      <p><span>{props.location}</span></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      <p>Year:</p>
                    </Col>
                    <Col xs={8}>
                      <p><span>{props.year}</span></p>
                    </Col>
                  </Row>
                </Col>
                <Col sm={5}>
                  <Row>
                    <Col xs={6}>
                      <p>Registered:</p>
                    </Col>
                    <Col xs={6}>
                      <p><span>{props.filled}</span></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <p>Max Limit:</p>
                    </Col>
                    <Col xs={6}>
                      <p><span>{props.limit}</span></p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className={styles.ProgressBarWrapper}>
                        <ProgressBar filled={filled || 0} limit={limit || 30} />
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            :
            <React.Fragment>
              {locked && <div className={styles.StateIcon} style={{ background: `url(${lockedIcon})` }}></div>}
              <div className={styles.HeaderBody}>
                <div className={styles.Header}>
                  <h4>{props.subjectName}</h4>
                </div>
                <div className={styles.Body}>
                  <div className={styles.Date}>
                    <div className={styles.Day}>
                      <span>{props.weekDay.slice(0, 3)}</span>
                    </div>
                    <div className={styles.Time}>
                      <p>{props.dayDate}</p>
                      <p>{props.time}</p>
                    </div>
                  </div>
                  <div className={styles.Place}>
                    <span>{props.location}</span>
                  </div>
                </div>
              </div>
              {!modal
                ?
                <div className={styles.Footer}>
                  {
                    (
                      admin &&
                      <React.Fragment>
                        <div className={styles.Actions}>
                          {
                            (!maxed && !pastDate &&
                              <Button variant="link" onClick={onToggleLocked}>
                                {loading && togglingLock === dateId ? <BSSpinner variant="primary" animation="border" size="sm" /> : locked ? 'Unlock' : 'Lock'}
                              </Button>)
                          }
                          {
                            (!(filledPercentage > 0) || pastDate) &&
                            <Button variant="link" className="text-danger" onClick={onDelete}>Delete</Button>
                          }
                        </div>
                        <div className={styles.Confirm}>
                          {
                            (filledPercentage > 0 && !pastDate &&
                              <Row>
                                <Col xs={6} className="pr-1">
                                  <Link className="btn btn-primary btn-sm btn-block" to={'/all-dates/' + dateId}>View</Link>
                                </Col>
                                <Col xs={6} className="pl-1">
                                  <Button variant="primary" block size="sm" onClick={onEdit}>Edit</Button>
                                </Col>
                              </Row>
                            )
                            || (!pastDate &&
                              <Button variant="primary" block size="sm" onClick={onEdit}>Edit</Button>)
                            ||
                            <Link className="btn btn-primary btn-sm btn-block" to={'/all-dates/' + dateId}>View</Link>
                          }
                        </div>
                        <div className={styles.ProgressBarWrapper}>
                          <ProgressBar filled={filled || 0} limit={limit || 30} />
                        </div>
                      </React.Fragment>
                    ) ||
                    (
                      bookedPage &&
                      <React.Fragment>
                        <div className={styles.Actions}>
                          {
                            (changeable &&
                              <Button variant="link" className="text-danger">Cancel</Button>)
                            ||
                            <p className={styles.UnavailableText}>Can't change or cancel</p>
                          }
                        </div>
                        <div className={styles.Confirm}>
                          <Button variant="primary" block size="sm" disabled={!changeable}>Change</Button>
                        </div>
                        <div className={styles.ProgressBarWrapper}>
                          <ProgressBar filled={filled || 0} limit={limit || 30} />
                        </div>
                      </React.Fragment>
                    ) ||
                    (
                      <React.Fragment>
                        <div className={styles.Actions}>
                          {
                            (booked && changeable && !locked &&
                              <Button variant="link" className="text-danger" onClick={onCancelDate}>Cancel Reservation</Button>)
                            || <p className={styles.UnavailableText}>
                              {
                                (booked && (!changeable || locked) &&
                                  'Can\'t cancel reservation')
                                || (!booked && !changeable &&
                                  'Availability ended')
                                || (maxed && 'Complete')
                                || (locked && 'Unavailable to reserve')
                                || (anotherBooked && 'Same subject reserved')
                              }
                            </p>
                          }
                        </div>
                        <div className={styles.Confirm}>
                          <Button variant="primary" block size="sm" onClick={!(loading) ? onBookDate : () => null} disabled={booked || maxed || locked || !changeable || anotherBooked}>
                            {loading && (booking === subjectCode || booking === dateId) ? <BSSpinner variant="light" animation="border" size="sm" /> : booked ? 'Reserved' : 'Reserve'}
                          </Button>
                        </div>
                        <div className={styles.ProgressBarWrapper}>
                          {!locked && <ProgressBar filled={filled || 0} limit={limit || 30} />}
                        </div>
                      </React.Fragment>
                    )
                  }
                </div>
                : null
              }
            </React.Fragment>
        }
      </div>
    </React.Fragment>
  )
}

export default DateCard;