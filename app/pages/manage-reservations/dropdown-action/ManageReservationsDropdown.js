

import React from 'react';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import PropTypes from 'prop-types';

import constants from 'constants/AppConstants';
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
  const isWaitingForCashPayment = reservation.state === reservationStates.WAITING_FOR_CASH_PAYMENT;

  return (
    <div className="app-ManageReservationDropdown">
      <DropdownButton
        id={`ManageReservationDropdown-${reservation.id}`}
        pullRight
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
        {userCanModify && isWaitingForCashPayment && (
          <MenuItem
            onClick={() => onEditReservation(reservation, reservationStates.CONFIRMED)}
          >
            {t('common.confirmCashPayment')}
          </MenuItem>
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
