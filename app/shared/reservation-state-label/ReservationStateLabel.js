
import PropTypes from 'prop-types';
import React from 'react';

import constants from 'constants/AppConstants';
import Label from 'shared/label';
import { injectT } from 'i18n';

function ReservationStateLabel({ reservation, t }) {
  const states = constants.RESERVATION_STATE;
  const statesToExclude = [states.CANCELLED, states.WAITING_FOR_PAYMENT];

  if (!reservation.needManualConfirmation && !statesToExclude.includes(reservation.state)) {
    return <span />;
  }
  const { labelBsStyle, labelTextId } = constants.RESERVATION_STATE_LABELS[reservation.state];

  return (
    <div className="reservation-state-label-container">
      <Label bsStyle={labelBsStyle}>{t(labelTextId)}</Label>
    </div>
  );
}

ReservationStateLabel.propTypes = {
  reservation: PropTypes.shape({
    needManualConfirmation: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationStateLabel);
