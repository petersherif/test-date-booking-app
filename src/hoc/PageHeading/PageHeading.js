import React from 'react';
import styles from './PageHeading.module.scss'

const PageHeading = props => (
  <div className={styles.PageHeading}>
    {props.children}
  </div>
);

export default PageHeading;