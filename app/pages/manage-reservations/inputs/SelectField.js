import React from 'react';
import PropTypes from 'prop-types';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Select from 'react-select';

import injectT from '../../../i18n/injectT';

export const getOption = (value, options) => {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value.map(item => options.find(option => option.value === item));
  }

  return options.find(option => option.value === value);
};

function SelectField({
  t,
  id,
  label,
  isClearable,
  isMulti,
  isSearchable,
  onChange,
  placeholder = t('common.select'),
  options,
  value,
  isRequired,
  error,
}) {
  return (
    <div className="app-SelectField">
      <FormGroup controlId={id}>
        {label && (
        <ControlLabel>
          {label}
          {isRequired && <span aria-hidden>*</span>}
        </ControlLabel>
        )}
        <Select
          className="app-Select"
          classNamePrefix="app-Select"
          inputId={id}
          isClearable={isClearable}
          isMulti={isMulti}
          isSearchable={isSearchable}
          noOptionsMessage={() => t('SelectControl.noOptions')}
          onChange={(selected, { action }) => {
            if (action === 'clear') {
              onChange(isMulti ? [] : {}, action);
              return;
            }

            onChange(selected, action);
          }}
          options={options}
          placeholder={placeholder}
          value={getOption(value, options)}
        />
        {error && (
          <HelpBlock
            className="has-error"
            id={`${id}-error`}
            role="alert"
          >
            {t(error)}
          </HelpBlock>
        )}
      </FormGroup>
    </div>
  );
}

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]),
  isRequired: PropTypes.bool,
  error: PropTypes.string,
};

export default injectT(SelectField);
