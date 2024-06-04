import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../i18n/injectT';
import { getPrettifiedPeriodUnits } from '../../utils/timeUtils';


function OvernightEditSummary({
  startDatetime, endDatetime, selected, onCancel, onConfirm, t,
  duration, minDuration, isDurationBelowMin, datesSameAsInitial,
  maxDuration, isDurationOverMax
}) {
  const timeRange = startDatetime && endDatetime ? `${startDatetime} - ${endDatetime}` : `${selected[0]} - ${selected[1]}`;
  const durationText = getPrettifiedPeriodUnits(duration, t('common.unit.time.day.short'));
  const minDurationText = getPrettifiedPeriodUnits(minDuration, t('common.unit.time.day.short'));
  const maxDurationText = getPrettifiedPeriodUnits(maxDuration, t('common.unit.time.day.short'));
  const hasMinDurationError = !datesSameAsInitial && isDurationBelowMin;
  const hasMaxDurationError = !datesSameAsInitial && isDurationOverMax;
  const validRange = startDatetime && endDatetime;

  return (
    <div className="overnight-edit-summary">
      <div className="overnight-edit-time-range">
        <div role="status">
          {validRange && (
            <React.Fragment>
              <strong>
                {`${t('TimeSlots.selectedDate')} `}
              </strong>
              {`${timeRange} (${durationText})`}
            </React.Fragment>
          )}
        </div>
        {hasMinDurationError && (
          <p className="overnight-error">{`${t('Overnight.belowMinAlert')} (${minDurationText})`}</p>
        )}
        {hasMaxDurationError && (
          <p className="overnight-error">{`${t('Overnight.overMaxAlert')} (${maxDurationText})`}</p>
        )}
      </div>
      <div className="app-ReservationTime__controls">
        <Button bsStyle="warning" className="cancel_Button" onClick={onCancel}>
          {t('ReservationInformationForm.cancelEdit')}
        </Button>
        <Button
          bsStyle="primary"
          className="next_Button"
          disabled={!startDatetime || !endDatetime || hasMinDurationError || hasMaxDurationError}
          onClick={onConfirm}
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
}

OvernightEditSummary.propTypes = {
  t: PropTypes.func.isRequired,
  selected: PropTypes.array.isRequired,
  endDatetime: PropTypes.string.isRequired,
  startDatetime: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
  isDurationBelowMin: PropTypes.bool.isRequired,
  minDuration: PropTypes.string.isRequired,
  datesSameAsInitial: PropTypes.bool.isRequired,
  maxDuration: PropTypes.string.isRequired,
  isDurationOverMax: PropTypes.bool.isRequired,
};

export default injectT(OvernightEditSummary);
