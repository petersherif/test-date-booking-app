import React from 'react'
import successIcon from '../../../assets/images/success.png'
import failedIcon from '../../../assets/images/failed.png'

const ConfirmationMsg = props => (
  <div>
    <p>{props.children}</p>
    <img src={props.failed ? failedIcon : successIcon} alt={props.failed ? 'Failed' : 'Succeeded'} draggable="false" />
  </div>
);

export default ConfirmationMsg;