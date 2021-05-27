import React from 'react';
import PropTypes from 'prop-types';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';

function ButtonGroupField({
  onChange,
  label,
  options,
  value,
  type,
  id,
}) {
  return (
    <div className="app-ButtonGroupField">
      <fieldset>
        {label && <legend className="app-ButtonGroupField__label">{label}</legend>}
        <ToggleButtonGroup
          className="app-ButtonGroupField__buttons"
          onChange={onChange}
          type={type}
          value={value}
        >
          {options.map(option => (
            <ToggleButton
              className="app-ButtonGroupField__button"
              key={`${id}-button-${option.value}`}
              value={option.value}
            >
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </fieldset>
    </div>
  );
}


const OptionShape = PropTypes.shape({
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  label: PropTypes.string.isRequired,
});

ButtonGroupField.propTypes = {
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array,
  ]),
  type: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(OptionShape),
};

export default ButtonGroupField;
