import React from 'react';
import styles from './Spinner.module.css';

const Spinner = props => (
  <div className={styles.LdsRoller} {...props}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
);

export default Spinner;