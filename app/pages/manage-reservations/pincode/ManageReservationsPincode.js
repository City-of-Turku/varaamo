import React from 'react';
import PropTypes from 'prop-types';

import { isAccessCodeGenerated, isAccessCodePending } from '../../../shared/reservation-access-code/helpers';
import GeneratedAccessCode from './GeneratedAccessCode';
import PendingAccessCode from './PendingAccessCode';

function ManageReservationsPincode({ reservation }) {
  let pincodeField = '';

  if (isAccessCodePending(reservation, reservation.resource)) {
    /*
      TODO: handle this unreachable code.
      reservation.resource does not have access code info
    */
    pincodeField = <PendingAccessCode />;
  }
  if (isAccessCodeGenerated(reservation)) {
    pincodeField = <GeneratedAccessCode accessCode={reservation.accessCode} />;
  }

  return (
    <div className="app-ManageReservationPincode">
      {pincodeField}
    </div>
  );
}

ManageReservationsPincode.propTypes = {
  reservation: PropTypes.object.isRequired,
};

export default ManageReservationsPincode;
