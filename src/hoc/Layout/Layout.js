import React, { Component } from 'react'
import Navbar from '../../components/Navigation/Navbar/Navbar'
import Sidebar from '../../components/Navigation/Sidebar/Sidebar'
import styles from './Layout.module.scss'

class Layout extends Component {

  state = {
    window: {
      width: 0,
      height: 0
    },
    sidebarToggle: false
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
  }

  updateWindowDimensions() {
    this.setState({
      window: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  sidebarToggleHandler = () => {
    this.setState(state => ({ sidebarToggle: !state.sidebarToggle }))
  }

  render() {

    const window = this.state.window
    const breakpoints = {
      sm: { name: 'sm', size: 576 },
      md: { name: 'md', size: 768 },
      lg: { name: 'lg', size: 992 }
    }

    return (
      <div className={styles.Layout}>
        <Navbar window={window} expand={breakpoints.sm} sidebarToggleHandler={this.sidebarToggleHandler} />
        {window.width < breakpoints.sm.size
          ? <Sidebar sidebarToggle={this.state.sidebarToggle} sidebarToggleHandler={this.sidebarToggleHandler} />
          : null}
        {this.props.children}
      </div>
    );
  }
}

export default Layout;