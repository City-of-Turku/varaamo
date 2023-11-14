import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { HelpBlock } from 'react-bootstrap';


function RadioGroup({ legend, legendHint, radioOptions }) {
  const radioOptionsElements = radioOptions.map((option) => {
    const radioOptionElement = (
      <React.Fragment key={`radio-${option.value}`}>
        <label htmlFor={`radio-${option.value}`}>
          <Field
            aria-describedby={option.hint ? `radio-hint-${option.value}` : null}
            component="input"
            id={`radio-${option.value}`}
            name={option.name}
            type="radio"
            value={option.value}
          />
          {option.label}
        </label>
        {option.hint && (
          <HelpBlock id={`radio-hint-${option.value}`}>{option.hint}</HelpBlock>
        )}
      </React.Fragment>
    );
    return radioOptionElement;
  });

  return (
    <fieldset className="form-radio-group">
      <legend>{legend}</legend>
      {legendHint && (
        <p>{legendHint}</p>
      )}
      {radioOptionsElements}
    </fieldset>
  );
}

RadioGroup.propTypes = {
  legend: PropTypes.string.isRequired,
  legendHint: PropTypes.string,
  radioOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    hint: PropTypes.string
  })).isRequired
};

export default RadioGroup;
