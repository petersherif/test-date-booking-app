import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

const NavigationItems = props => {

  let navLinks = (
    <React.Fragment>
      <NavLink
        className={props.className ? `${props.className} nav-link` : 'nav-link'}
        activeClassName={props.onActive}
        to="/date-booking/"
        onClick={props.sidebarToggleHandler}>Date Booking</NavLink>
      <NavLink
        className={props.className ? `${props.className} nav-link` : 'nav-link'}
        activeClassName={props.onActive}
        to="/my-dates/"
        onClick={props.sidebarToggleHandler}>Booked Dates</NavLink>
      <NavLink
        className={props.className ? `${props.className} nav-link` : 'nav-link'}
        activeClassName={props.onActive}
        to="/logout/"
        onClick={props.sidebarToggleHandler}>Logout</NavLink>
    </React.Fragment>
  )

  if (props.isAdmin) {
    navLinks = (
      <React.Fragment>
        <NavLink
          className={props.className ? `${props.className} nav-link` : 'nav-link'}
          activeClassName={props.onActive}
          to="/all-dates/"
          exact
          onClick={props.sidebarToggleHandler}>Dates</NavLink>
        <NavLink
          className={props.className ? `${props.className} nav-link` : 'nav-link'}
          activeClassName={props.onActive}
          to="/all-subjects/"
          onClick={props.sidebarToggleHandler}>Subjects</NavLink>
        <NavLink
          className={props.className ? `${props.className} nav-link` : 'nav-link'}
          activeClassName={props.onActive}
          to="/all-students/"
          onClick={props.sidebarToggleHandler}>Students</NavLink>
        <NavLink
          className={props.className ? `${props.className} nav-link` : 'nav-link'}
          activeClassName={props.onActive}
          to="/logout/"
          onClick={props.sidebarToggleHandler}>Logout</NavLink>
      </React.Fragment>
    )
  }

  return navLinks
}

const mapStateToProps = state => {
  return {
    isAdmin: state.auth.isAdmin
  }
}

export default connect(mapStateToProps)(NavigationItems);