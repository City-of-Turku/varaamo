
import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { injectT } from 'i18n';
import AppConstants from 'constants/AppConstants';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';

const defaultDateFormat = 'YYYY-MM-DD';
const localizedDateFormat = 'D.M.YYYY';

function UnconnectedDatePicker({
  dateFormat, onChange, currentLocale, value, rest, t
}) {
  const pickerDateFormat = dateFormat || localizedDateFormat;

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
        todayButton: t('common.today'),
      }}
      format={pickerDateFormat}
      formatDate={formatDate}
      inputProps={{
        'aria-label': t('DatePickerControl.buttonLabel')
      }}
      keepFocus={false}
      onDayChange={date => onChange(formatDate(date, defaultDateFormat))}
      parseDate={parseDate}
      value={new Date(value)}
      {...rest}
    >
      <span className="glyphicon glyphicon-calendar" />
    </DayPickerInput>
  );
}

UnconnectedDatePicker.propTypes = {
  dateFormat: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  currentLocale: PropTypes.string,
  rest: PropTypes.object,
  t: PropTypes.func.isRequired,
};

UnconnectedDatePicker.defaultProps = {
  currentLocale: AppConstants.DEFAULT_LOCALE
};

const languageSelector = createStructuredSelector({
  currentLocale: currentLanguageSelector
});

UnconnectedDatePicker = injectT(UnconnectedDatePicker);  // eslint-disable-line
export { UnconnectedDatePicker };
export default connect(languageSelector)(injectT(UnconnectedDatePicker));
