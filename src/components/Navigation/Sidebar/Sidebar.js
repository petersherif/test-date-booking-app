import React from 'react'
import NavigationItems from '../NavigationItems/NavigationItems'
import Logo from '../../../components/UI/Logo/Logo'
import DismissBtn from '../../UI/DismissBtn/DismissBtn'
import Backdrop from '../../UI/Backdrop/Backdrop'
import styles from './Sidebar.module.scss'

const sidebar = props => (
  <React.Fragment>
    <Backdrop click={props.sidebarToggleHandler} show={props.sidebarToggle} />
    <div className={props.sidebarToggle ? styles.Show : styles.Sidebar}>
      <DismissBtn click={props.sidebarToggleHandler} className="left">&times;</DismissBtn>
      <Logo
        className={styles.Logo}
        link="/date-booking" alt="Test Date Booking App"
        sidebarToggleHandler={props.sidebarToggleHandler} />
      <NavigationItems
        className={styles.NavLink}
        onActive={styles.Active}
        sidebarToggleHandler={props.sidebarToggleHandler} />
    </div>
  </React.Fragment>
);

export default sidebar;