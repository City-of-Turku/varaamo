import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';

function PaymentButton({
  fontSize, handleUpdateReservation, isSaving, paymentUrl, reservationExists, reservationState, t
}) {
  if (reservationExists) {
    if (paymentUrl) {
      return (
        <Button
          bsStyle="success"
          className={fontSize}
          href={paymentUrl}
        >
          {t('common.resumePayment')}
        </Button>
      );
    }
    if (reservationState === constants.RESERVATION_STATE.READY_FOR_PAYMENT) {
      return (
        <Button
          bsStyle="success"
          className={fontSize}
          disabled={isSaving}
          onClick={() => handleUpdateReservation()}
        >
          {isSaving ? t('common.proceedingToPayment') : t('common.proceedToPayment')}
        </Button>
      );
    }
  }

  return null;
}

PaymentButton.propTypes = {
  fontSize: PropTypes.string.isRequired,
  handleUpdateReservation: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  paymentUrl: PropTypes.string.isRequired,
  reservationExists: PropTypes.bool.isRequired,
  reservationState: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(PaymentButton);
