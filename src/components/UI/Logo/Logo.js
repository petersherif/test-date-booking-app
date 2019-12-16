import React from 'react';
import logo from '../../../assets/images/logo192.jpg'
import styles from './Logo.module.scss'
import { NavLink } from 'react-router-dom'

const Logo = props => (
  <NavLink to={props.link ? props.link : '/login'} onClick={props.sidebarToggleHandler ? props.sidebarToggleHandler : null} >
    <img src={logo} alt={props.alt} className={props.className ? `${props.className} ${styles.Logo}` : styles.Logo} />
  </NavLink>
);

export default Logo;