import React from 'react';
import PropTypes from 'prop-types';

type Props = {
  value: string;
  onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const Button: React.FC<Props> = ({ value, onClick, disabled=false }) => (
  <button
    type="submit"
    onClick={onClick}
    className="btn btn-primary"
    style={{ margin: '2px' }}
    disabled={disabled}
  >
    {value}
  </button>
);

Button.defaultProps = {
  value: '',
  onClick: () => {},
};

Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
