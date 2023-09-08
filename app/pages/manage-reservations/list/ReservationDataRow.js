import get from 'lodash/get';
import React from 'react';
import PropTypes from 'prop-types';

import { getLocalizedFieldValue } from '../../../utils/languageUtils';
import { getDateAndTime, getNormalizedReservation } from './listUtils';
import ManageReservationsPincode from '../pincode/ManageReservationsPincode';
import ManageReservationsComment from '../comment/ManageReservationsComment';
import ManageReservationsStatus from '../status/ManageReservationsStatus';
import ManageReservationsDropdown from '../dropdown-action/ManageReservationsDropdown';
import { canUserCancelReservation, canUserModifyReservation } from 'utils/reservationUtils';

function ReservationDataRow({
  reservation, locale, onInfoClick, onEditClick, onEditReservation
}) {
  return (
    <tr>
      <td>{get(reservation, 'reserverName') || '-'}</td>
      <td>{get(reservation, 'reserverEmailAddress') || '-'}</td>
      <td>
        {getLocalizedFieldValue(
          get(reservation, 'resource.name'), locale
        ) || '-'}
      </td>
      <td>
        {getLocalizedFieldValue(
          get(reservation, 'resource.unit.name'), locale,
        ) || '-'}
      </td>
      <td>{getDateAndTime(reservation)}</td>

      <td><ManageReservationsPincode reservation={reservation} /></td>

      <td><ManageReservationsComment comments={reservation.comments} /></td>

      <td><ManageReservationsStatus reservation={reservation} /></td>

      <td>
        <ManageReservationsDropdown
          onEditClick={() => onEditClick(reservation)}
          onEditReservation={onEditReservation}
          onInfoClick={() => onInfoClick(getNormalizedReservation(reservation))}
          reservation={getNormalizedReservation(reservation)}
          userCanCancel={canUserCancelReservation(reservation)}
          userCanModify={canUserModifyReservation(reservation)}
        />
      </td>
    </tr>
  );
}

ReservationDataRow.propTypes = {
  locale: PropTypes.string.isRequired,
  reservation: PropTypes.object.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onEditReservation: PropTypes.func.isRequired,
};

export default ReservationDataRow;
