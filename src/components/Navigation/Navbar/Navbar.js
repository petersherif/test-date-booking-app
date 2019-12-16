import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavigationItems from '../NavigationItems/NavigationItems'
import Logo from '../../UI/Logo/Logo'

const navbar = props => {

  return (
    <Navbar bg="primary" variant="dark" fixed="top" expand={props.expand.name}>
      <Navbar.Brand as="div" className={props.window.width > props.expand.size ? "lg" : null}>
        <Logo link="/" alt="Test Date Booking App" />
      </Navbar.Brand>
      <Navbar.Toggle onClick={props.sidebarToggleHandler} />
      {props.window.width > props.expand.size
        ? <Nav className="ml-auto">
          <NavigationItems />
        </Nav>
        : null
      }
    </Navbar>
  );
}

export default navbar;