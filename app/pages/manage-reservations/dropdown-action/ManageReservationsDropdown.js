
import constants from 'constants/AppConstants';

import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';

import injectT from 'i18n/injectT';

function ManageReservationsDropdown({
  t, onInfoClick, reservation,
  onEditClick,
  onEditReservation,
  userCanModify,
  userCanCancel,
}) {
  const reservationStates = constants.RESERVATION_STATE;
  const isRequestedReservation = reservation.state === reservationStates.REQUESTED;

  return (
    <div className="app-ManageReservationDropdown">
      <DropdownButton
        title={t('ManageReservationsList.actionsHeader')}
      >
        <MenuItem onClick={onInfoClick}>
          {t('ManageReservationsList.actionLabel.information')}
        </MenuItem>

        {userCanModify && isRequestedReservation && (
          <React.Fragment>
            <MenuItem
              onClick={() => onEditReservation(reservation, reservationStates.CONFIRMED)}
            >
              {t('ManageReservationsList.actionLabel.approve')}
            </MenuItem>
            <MenuItem
              onClick={() => onEditReservation(reservation, reservationStates.DENIED)}
            >
              {t('ManageReservationsList.actionLabel.deny')}
            </MenuItem>
          </React.Fragment>
        )}
        {userCanModify && (
          <MenuItem
            onClick={onEditClick}
          >
            {t('ManageReservationsList.actionLabel.edit')}
          </MenuItem>
        )}
        {userCanCancel && (
          <MenuItem
            onClick={() => onEditReservation(reservation, reservationStates.CANCELLED, true)}
          >
            {t('ManageReservationsList.actionLabel.cancel')}
          </MenuItem>
        )}
      </DropdownButton>
    </div>
  );
}

ManageReservationsDropdown.propTypes = {
  t: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func,
  reservation: PropTypes.object.isRequired,
  onEditClick: PropTypes.func,
  onEditReservation: PropTypes.func,
  userCanCancel: PropTypes.bool,
  userCanModify: PropTypes.bool,
};

export default injectT(ManageReservationsDropdown);
