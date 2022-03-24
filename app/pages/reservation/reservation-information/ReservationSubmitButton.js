import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import injectT from '../../../i18n/injectT';

function ReservationSubmitButton({
  isMakingReservations, handleSubmit, hasPayment, needManualConfirmation, onConfirm, t
}) {
  let buttonText = isMakingReservations ? t('common.saving') : t('common.save');
  if (hasPayment && !needManualConfirmation) {
    buttonText = isMakingReservations ? t('common.proceedingToPayment') : t('common.proceedToPayment');
  }

  return (
    <Button
      bsStyle="primary"
      disabled={isMakingReservations}
      onClick={handleSubmit(onConfirm)}
      type="submit"
    >
      {buttonText}
    </Button>
  );
}

ReservationSubmitButton.defaultProps = {
  needManualConfirmation: false,
};

ReservationSubmitButton.propTypes = {
  isMakingReservations: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasPayment: PropTypes.bool.isRequired,
  needManualConfirmation: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default injectT(ReservationSubmitButton);
