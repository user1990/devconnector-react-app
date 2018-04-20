import React from 'react';

import PropTypes from 'prop-types';

const TextFieldGroup = ({
  name,
  placeholder,
  className,
  value,
  error,
  info,
  type,
  onChange,
  disabled,
}) => (
  <div className="form-group">
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />
    {info && <small className="form-text text-muted">{info}</small>}
    {error && <div className="invalid-feedback">{error}</div>}
  </div>
);

TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string,
};

export default TextFieldGroup;
