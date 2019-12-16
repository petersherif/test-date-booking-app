import React from 'react'
import Button from '../Button/Button'
import styles from './DismissBtn.module.scss'

const DismissX = props => (
  <Button className={props.className === 'left' ? styles.Left : styles.DismissBtn} onClick={props.click}>&times;</Button>
);

export default DismissX;