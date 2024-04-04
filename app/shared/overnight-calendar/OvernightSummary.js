import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';

import injectT from '../../i18n/injectT';

function OvernightSummary({
  t, selected, endDatetime, startDatetime, handleSelectDatetimes
}) {
  const timeRange = startDatetime && endDatetime ? `${startDatetime} - ${endDatetime}` : `${selected[0]} - ${selected[1]}`;

  return (
    <div className="reservation-calendar-reserve-info2">
      <h3 className="visually-hidden" id="timetable-summary">{t('ReservationCalendar.Confirmation.header')}</h3>
      <div>
        <strong>
          {t('TimeSlots.selectedDate')}
          {' '}
        </strong>
        {timeRange}
      </div>
      <div>
        <Button
          bsStyle="primary"
          className="reservation-calendar__reserve-button2"
          onClick={handleSelectDatetimes}
        >
          {t('TimeSlots.reserveButton')}
        </Button>
      </div>
    </div>
  );
}

OvernightSummary.propTypes = {
  t: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  endDatetime: PropTypes.string.isRequired,
  startDatetime: PropTypes.string.isRequired,
  handleSelectDatetimes: PropTypes.func.isRequired,
};

export default injectT(OvernightSummary);
