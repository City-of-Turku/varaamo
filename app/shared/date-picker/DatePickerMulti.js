import AppConstants from 'constants/AppConstants';

import React, { useState, useReducer } from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';


import { currentLanguageSelector } from 'state/selectors/translationSelectors';

const defaultDateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';

function reduceri(state, action) {
  switch (action.type) {
    case 'update':
      if (action.value) {
        const fooa = state.reduce((acc, curr, index) => {
          console.log('datee');
          console.log(curr);
          if (index === 0 || curr.toISOString() !== action.test.toISOString()) {
            acc.push(curr);
          }
          return acc;
        }, []);
        console.log('fooo');
        console.log(fooa);
        return fooa;
        // return state.filter(val => val !== action.test);
      }
      console.log(action);
      console.log([...state, action.test]);
      return [...state, action.test];
    default:
      return state;
  }
}

export function UnconnectedDatePickerMulti({
  dateFormat, onChange, currentLocale, value, rest, daysInAdvance, selectedValues
}) {
  const initti = [new Date(value)];
  const [state, dispatch] = useReducer(reduceri, initti);
  const pickerDateFormat = dateFormat || localizedDateFormat;
  const normalizedValues = selectedValues.map(dateVal => new Date(dateVal.start));
  const foo = (day, { selected }) => dispatch({ type: 'update', value: selected, test: day });
  const pastDates = {
    disabled: {
      before: new Date(value),
      after: new Date(daysInAdvance)
    }
  };
  return (
    <DayPickerInput
      classNames={{
        container: 'date-picker',
        overlay: 'date-picker-overlay',
      }}
      dayPickerProps={{
        showOutsideDays: true,
        localeUtils: MomentLocaleUtils,
        locale: currentLocale,
        selectedDays: normalizedValues.length ? normalizedValues : new Date(value),
        onDayClick: foo,
        modifiers: pastDates
      }}
      format={pickerDateFormat}
      formatDate={formatDate}
      keepFocus={false}
      onDayChange={date => onChange(formatDate(date, defaultDateFormat))}
      parseDate={parseDate}
      value={new Date(value)}
      {...rest}
    />
  );
}

UnconnectedDatePickerMulti.propTypes = {
  dateFormat: PropTypes.string,
  daysInAdvance: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  currentLocale: PropTypes.string,
  rest: PropTypes.object,
  selectedValues: PropTypes.array,
};

UnconnectedDatePickerMulti.defaultProps = {
  currentLocale: AppConstants.DEFAULT_LOCALE,
  selectedValues: []
};

const languageSelector = createStructuredSelector({
  currentLocale: currentLanguageSelector
});

export default connect(languageSelector)(UnconnectedDatePickerMulti);
