
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Row from 'react-bootstrap/lib/Row';
import NumericInput from 'react-numeric-input';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';
import DatePicker from 'shared/date-picker';
import SelectControl from 'pages/search/controls/SelectControl';


/**
 * Handles converting untranslated option labels into translated labels.
 * @param {Object[]} options, contains objects which have properties label and value
 * @param {function} t
 * @returns a new array of options with translated labels.
 */
function translateOptions(options, t) {
  const translatedOptions = options.map(option => (
    {
      label: t(option.label),
      value: option.value
    }
  ));
  return translatedOptions;
}

function RecurringReservationControls({
  changeFrequency,
  changeLastTime,
  changeNumberOfOccurrences,
  frequency,
  frequencyOptions,
  isVisible,
  numberOfOccurrences,
  lastTime,
  t,
}) {
  if (!isVisible) {
    return <span />;
  }
  return (
    <div className="recurring-reservation-controls">
      <Row>
        <Col sm={6} xs={12}>
          <div className="recurring-reservation-frequency-control">
            <label htmlFor="recurrence-frequency-select">
              {t('RecurringReservationControls.frequencyLabel')}
            </label>
            <SelectControl
              className="recurrence-frequency-select"
              getOptionLabel={({ label }) => t(label)}
              id="recurrence-frequency-select"
              isClearable={false}
              name="recurrence-frequency-select"
              onChange={changeFrequency}
              options={translateOptions(frequencyOptions, t)}
              value={frequency}
            />
          </div>
        </Col>
        {frequency !== '' && (
          <Col sm={6} xs={12}>
            <FormGroup controlId="numberOfOccurrencesGroup">
              <ControlLabel>
                {t('RecurringReservationControls.numberOfOccurrencesLabel')}
              </ControlLabel>
              <NumericInput
                className="form-control"
                max={constants.RECURRING_RESERVATIONS.maxRecurringReservations}
                min={1}
                onChange={changeNumberOfOccurrences}
                value={numberOfOccurrences}
              />
            </FormGroup>
          </Col>
        )}
        {frequency !== '' && (
          <Col sm={12} xs={12}>
            <FormGroup controlId="LastTimeGroup">
              <ControlLabel>{t('RecurringReservationControls.lastTimeLabel')}</ControlLabel>
              <DatePicker
                dateFormat="D.M.YYYY"
                onChange={changeLastTime}
                value={lastTime}
              />
            </FormGroup>
          </Col>
        )}
      </Row>
    </div>
  );
}

RecurringReservationControls.propTypes = {
  changeFrequency: PropTypes.func.isRequired,
  changeLastTime: PropTypes.func.isRequired,
  changeNumberOfOccurrences: PropTypes.func.isRequired,
  frequency: PropTypes.string.isRequired,
  frequencyOptions: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  numberOfOccurrences: PropTypes.number.isRequired,
  lastTime: PropTypes.string,
  t: PropTypes.func.isRequired,
};

export default injectT(RecurringReservationControls);
