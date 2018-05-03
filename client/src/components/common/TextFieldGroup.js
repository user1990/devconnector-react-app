import React from 'react';

import PropTypes from 'prop-types';

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  error,
  info,
  type,
  onChange,
  disabled,
  autoComplete,
}) => (
  <div className="form-group">
    <input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      autoComplete={autoComplete}
      onChange={onChange}
      disabled={disabled}
      className={
        error
          ? 'form-control form-control-lg is-invalid'
          : 'form-control form-control-lg'
      }
    />
    {info && <small className="form-text text-muted">{info}</small>}
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string,
  autoComplete: PropTypes.string,
};

TextFieldGroup.defaultProptyes = {
  autoComplete: 'off',
};

export default TextFieldGroup;
