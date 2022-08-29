import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

import constants from '../../constants/AppConstants';
import { injectT } from 'i18n';

class ReservationControls extends Component {
  constructor(props) {
    super(props);
    this.buttons = {
      cancel: (
        <Button
          bsStyle="danger"
          key="cancelButton"
          onClick={props.onCancelClick}
        >
          {props.t('ReservationControls.cancel')}
        </Button>
      ),
      confirm: (
        <Button
          bsStyle="success"
          key="confirmButton"
          onClick={props.onConfirmClick}
        >
          {props.t('ReservationControls.confirm')}
        </Button>
      ),
      deny: (
        <Button
          bsStyle="danger"
          key="denyButton"
          onClick={this.props.onDenyClick}
        >
          {props.t('ReservationControls.deny')}
        </Button>
      ),
      edit: (
        <Button
          bsStyle="primary"
          key="editButton"
          onClick={props.onEditClick}
        >
          {props.t('ReservationControls.edit')}
        </Button>
      ),
      info: (
        <Button
          bsStyle="default"
          key="infoButton"
          onClick={props.onInfoClick}
        >
          {props.t('ReservationControls.info')}
        </Button>
      ),
      pay: (
        <Button
          bsStyle="success"
          key="payButton"
          onClick={props.onPayClick}
        >
          {props.t('ReservationControls.pay')}
        </Button>
      )
    };
  }

  renderButtons(buttons, isAdmin, reservation, canModify, canDelete, paymentUrlData) {
    if (!reservation.needManualConfirmation) {
      if (reservation.state === 'cancelled') {
        return null;
      }
      const givenButtons = [];
      if (canModify) {
        givenButtons.push(buttons.edit);
      }
      if (canDelete) {
        givenButtons.push(buttons.cancel);
      }
      return givenButtons;
    }

    switch (reservation.state) {
      case 'cancelled': {
        return isAdmin
          ? []
          : [];
      }

      case 'confirmed': {
        if (isAdmin) {
          return canModify
            ? [buttons.cancel, buttons.edit]
            : [buttons.cancel];
        }
        return [buttons.cancel];
      }

      case 'denied': {
        return isAdmin
          ? []
          : [];
      }

      case constants.RESERVATION_STATE.READY_FOR_PAYMENT: {
        return [buttons.pay, buttons.cancel];
      }

      case constants.RESERVATION_STATE.WAITING_FOR_PAYMENT: {
        if (paymentUrlData) {
          if (paymentUrlData.paymentUrl && paymentUrlData.reservationId === reservation.id) {
            return [buttons.pay];
          }
        }

        return [];
      }

      case constants.RESERVATION_STATE.WAITING_FOR_CASH_PAYMENT: {
        if (canModify) {
          return [buttons.edit, buttons.cancel];
        }
        return [buttons.cancel];
      }

      case 'requested': {
        if (isAdmin) {
          return [buttons.edit];
        }
        return [buttons.edit, buttons.cancel];
      }

      default: {
        return null;
      }
    }
  }

  render() {
    const {
      isAdmin, paymentUrlData, reservation
    } = this.props;

    /*
      Reservation permissions can be used to determine what user can do.
      For example reservations with paid products cannot be modified without
      correct staff permissions.
     */
    const userPermissions = 'userPermissions' in reservation ? reservation.userPermissions : {};
    const canModify = 'canModify' in userPermissions ? userPermissions.canModify : false;
    const canDelete = 'canDelete' in userPermissions ? userPermissions.canDelete : false;

    if (!reservation || moment() > moment(reservation.end)) {
      return null;
    }

    return (
      <div className="buttons">
        {this.buttons.info}
        {this.renderButtons(
          this.buttons, isAdmin, reservation, canModify, canDelete, paymentUrlData
        )}
      </div>
    );
  }
}

ReservationControls.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  onCancelClick: PropTypes.func.isRequired,
  onConfirmClick: PropTypes.func.isRequired,
  onDenyClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onInfoClick: PropTypes.func.isRequired,
  onPayClick: PropTypes.func.isRequired,
  paymentUrlData: PropTypes.object,
  reservation: PropTypes.object,
  t: PropTypes.func.isRequired,
};

export default injectT(ReservationControls);
