import React from 'react'
import styles from './ProgressBar.module.scss'

const progressBar = props => {
  const { filled, limit } = props
  return (
    <div className={styles.ProgressBar}>
      <div className={styles.Bar}></div>
      <div className={styles.Progress} style={{ width: (filled / limit * 100) + '%' }}></div>
      <span className={styles.Title}>
        {filled / limit * 100 === 100
          ? `${filled}/${limit} Complete`
          : `${filled}/${limit} Reserved`
        }
      </span>
    </div>
  )
};

export default progressBar;