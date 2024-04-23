import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import injectT from '../../i18n/injectT';
import { getPrettifiedPeriodUnits } from '../../utils/timeUtils';

function OvernightSummary({
  t, selected, endDatetime, startDatetime, handleSelectDatetimes,
  duration, isDurationBelowMin, minDuration
}) {
  const timeRange = startDatetime && endDatetime ? `${startDatetime} - ${endDatetime}` : `${selected[0]} - ${selected[1]}`;
  const durationText = getPrettifiedPeriodUnits(duration, t('common.unit.time.day.short'));
  const minDurationText = getPrettifiedPeriodUnits(minDuration, t('common.unit.time.day.short'));
  const validRange = startDatetime && endDatetime;

  return (
    <div className={classNames('overnight-summary', !validRange && 'sr-only')}>
      <h3 className="visually-hidden" id="timetable-summary">{t('ReservationCalendar.Confirmation.header')}</h3>
      <div>
        <div className="summary-time-range" role="status">
          {validRange && (
            <React.Fragment>
              <strong>
                {`${t('TimeSlots.selectedDate')} `}
              </strong>
              {`${timeRange} (${durationText})`}
            </React.Fragment>
          )}
        </div>
        {isDurationBelowMin && (
          <p className="overnight-error">{`${t('Overnight.belowMinAlert')} (${minDurationText})`}</p>
        )}
      </div>
      <div>
        <Button
          bsStyle="primary"
          disabled={isDurationBelowMin || !validRange}
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
  duration: PropTypes.object.isRequired,
  isDurationBelowMin: PropTypes.bool.isRequired,
  minDuration: PropTypes.string.isRequired,
};

export default injectT(OvernightSummary);
