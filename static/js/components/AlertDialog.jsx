import React from 'react';
import PropTypes from 'prop-types';

import '../../css/AlertDialog.css';

const AlertDialog = ({ errorText, id, onClose }) => (
  <div className="alert-overlay">
    <div className="alert-dialog">
      <span className="alert-msg">{errorText}</span>
    </div>
    <button className="close-alert" onClick={() => onClose(id)} type="button">x</button>
  </div>
);

AlertDialog.defaultProps = {
  errorText: 'An unexpected error occurred',
  id: '',
  onClose: () => {},
};

AlertDialog.propTypes = {
  errorText: PropTypes.string,
  id: PropTypes.string,
  onClose: PropTypes.func,
};

export default AlertDialog;
