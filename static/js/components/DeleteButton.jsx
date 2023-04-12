import React from 'react';
import PropTypes from 'prop-types';

const DeleteButton = (props) => {
  const { readOnly, onClick, className } = props;

  return (
    <button
      // className="btn btn-link delete-button"
      className={className}
      type="button"
      onClick={readOnly ? () => {} : () => onClick()}
      disabled={readOnly}
    >
      <span
        className="fa fa-times-circle delete-icon"
        style={readOnly ? { color: 'gray' } : { color: 'red' }}
      />
    </button>
  );
};

DeleteButton.defaultProps = {
  readOnly: false,
  onClick: () => {},
  className: '',
};

DeleteButton.propTypes = {
  readOnly: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default DeleteButton;
