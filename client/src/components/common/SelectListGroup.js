import React from 'react';

import PropTypes from 'prop-types';

const SelectListGroup = ({
  placeholder,
  name,
  value,
  error,
  info,
  onChange,
  options,
}) => {
  const selectOptions = options.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ));

  return (
    <div className="form-group">
      <select
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        className={
          error
            ? 'form-control form-control-lg is-invalid'
            : 'form-control form-control-lg'
        }
      >
        {selectOptions}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default SelectListGroup;
