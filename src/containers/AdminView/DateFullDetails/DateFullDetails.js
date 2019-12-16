import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import PageHeading from '../../../hoc/PageHeading/PageHeading'
import Button from 'react-bootstrap/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import BSSpinner from 'react-bootstrap/Spinner'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import DateCard from '../../../components/DateCard/DateCard'
import XLSX from 'xlsx'


class DateFullDetails extends Component {

  componentDidMount() {
    this.props.onFetchDates(this.props.token)
    this.props.onFetchStudents(this.props.token)
  }

  exportToExcelHandler = (dateData) => {
    if (this.props.students) {

      const registeredStudents = Object.values(this.props.students).filter(student => {
        return Object.keys(dateData.registered).indexOf("" + student.barcode) !== -1
      })
      let sheetData = registeredStudents.map(student => {
        return [student.barcode]
      })

      sheetData = [
        ["Subject", dateData.subjectName],
        ["Date", `${dateData.date.weekDay} ${dateData.date.dayDate} ${dateData.date.time}`],
        ["Hall", dateData.location],
        ["Year", dateData.year],
        ["Max Limit", dateData.maxLimit],
        ["", ""],
        ["Reserved List", `Total ${dateData.registered && dateData.registered !== 0 ? Object.keys(dateData.registered).length : '0'}`],
        ...sheetData
      ]

      const ws = XLSX.utils.json_to_sheet(sheetData, { skipHeader: true })
      const wscols = [{ wpx: 100 }, { wpx: 150 }];
      ws['!cols'] = wscols;
      const wb = XLSX.utils.book_new()
      if (!wb.Workbook) wb.Workbook = {};
      if (!wb.Workbook.Views) wb.Workbook.Views = [];
      if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
      wb.Workbook.Views[0].RTL = false;
      XLSX.utils.book_append_sheet(wb, ws)
      XLSX.writeFile(wb, `${dateData.subjectName} ${dateData.date.dayDate} ${dateData.date.time} data.xlsx`)
    }
  }

  render() {
    const dateId = this.props.match.params.dateId

    const date = { ...this.props.dates[dateId] }

    let students = (
      <tr>
        <td colSpan="4" ><Spinner /></td>
      </tr>
    )

    if (this.props.students) {
      const registeredStudents = Object.values(this.props.students).filter(student => {
        return Object.keys(date.registered).indexOf("" + student.barcode) !== -1
      })

      students = registeredStudents.map(student => {
        return (
          this.props.deleting === student.barcode
            ?
            <tr key={student.barcode}>
              <td></td>
              <td colSpan="2" className="text-center">
                <div style={{ minHeight: "31px", paddingTop: "7px" }}>
                  <BSSpinner animation="border" variant="primary" size="sm" />
                </div>
              </td>
              <td></td>
            </tr>
            :
            <tr key={student.barcode}>
              <td>{student.barcode}</td>
              <td>{student.name}</td>
              <td>{student.year}</td>
              <td className="text-center">
                {/* {this.props.deleting
                  ?
                  <BSSpinner animation="border" variant="primary" size="sm" />
                  :
                  <React.Fragment>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => this.toggleEditStudentHandler(student.barcode, student.name, student.year)}>تعديل</Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger"
                      onClick={() => this.deleteStudentHandler(student.barcode)}>حذف</Button>
                  </React.Fragment>
                } */}
              </td>
            </tr>
        )
      })
    }

    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col>
              <PageHeading>
                <h1>Date Details</h1>
                <p>You can view the date details or export it into an excel file</p>
              </PageHeading>
            </Col>
          </Row>

          {date
            ?
            <React.Fragment>
              <Row>
                <Col>
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

                    // Date info
                    dateId={date.id}
                    year={date.year}

                    // Date states
                    loading={this.props.loading}
                    exporting />
                </Col>
              </Row>
              <Row>
                <Col className="mb-4">
                  <Button variant="primary" size="sm" onClick={() => this.exportToExcelHandler(date)}>Export to excel</Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table striped bordered hover responsive size="sm" className="custom-data-table">
                    <thead>
                      <tr>
                        <th>Student Code</th>
                        <th>Student Name</th>
                        <th>Student Year</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {students}
                    </tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col className="mb-4">
                  <Button variant="primary" size="sm" onClick={() => this.exportToExcelHandler(date)}>Export to excel</Button>
                </Col>
              </Row>
            </React.Fragment>
            : <Spinner />
          }
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    dates: { ...state.dates.dates, ...state.dates.pastDates },
    students: state.allStudents.students
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onFetchDates: (token) => dispatch(actions.fetchDates(token)),
    onFetchStudents: (token) => dispatch(actions.fetchStudents(token)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateFullDetails);