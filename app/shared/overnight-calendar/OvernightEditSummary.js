import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../i18n/injectT';


function OvernightEditSummary({
  startDatetime, endDatetime, selected, onCancel, onConfirm, t
}) {
  const timeRange = startDatetime && endDatetime ? `${startDatetime} - ${endDatetime}` : `${selected[0]} - ${selected[1]}`;

  return (
    <div className="overnight-edit-summary">
      {(startDatetime && endDatetime) && (
      <div className="overnight-edit-time-range">
        <strong>
          {`${t('TimeSlots.selectedDate')} `}
        </strong>
        {timeRange}
      </div>
      )}
      <div className="app-ReservationTime__controls">
        <Button bsStyle="warning" className="cancel_Button" onClick={onCancel}>
          {t('ReservationInformationForm.cancelEdit')}
        </Button>
        <Button
          bsStyle="primary"
          className="next_Button"
          disabled={!startDatetime || !endDatetime}
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
};

export default injectT(OvernightEditSummary);
