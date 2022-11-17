import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel } from 'react-bootstrap';
import Toggle from 'react-toggle';

function ToggleField({
  id, label, onChange, value
}) {
  return (
    <div className="app-ToggleField">
      <Toggle
        checked={value}
        id={id}
        onChange={onChange}
      />
      <ControlLabel className="app-ToggleFieldLabel" htmlFor={id}>{label}</ControlLabel>
    </div>
  );
}

ToggleField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired
};

export default ToggleField;
