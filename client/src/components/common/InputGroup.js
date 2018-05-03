import React from 'react';

import PropTypes from 'prop-types';

const InputGroup = ({
  name,
  placeholder,
  value,
  error,
  icon,
  onChange,
  autoComplete,
}) => (
  <div className="input-group mb-3">
    <div className="input-group-prepend">
      <span className="input-group-text">
        <i className={icon} />
      </span>
    </div>
    <input
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={
        error
          ? 'form-control form-control-lg is-invalid'
          : 'form-control form-control-lg'
      }
    />
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

InputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  autoComplete: PropTypes.string,
};

InputGroup.defaultProps = {
  autoComplete: 'off',
};

export default InputGroup;
