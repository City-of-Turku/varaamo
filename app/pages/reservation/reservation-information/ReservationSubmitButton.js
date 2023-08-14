import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import injectT from '../../../i18n/injectT';

function ReservationSubmitButton({
  isMakingReservations, handleFormSubmit, hasPayment, needManualConfirmation, t
}) {
  let buttonText = isMakingReservations ? t('common.saving') : t('common.save');
  if (hasPayment && !needManualConfirmation) {
    buttonText = isMakingReservations ? t('common.proceedingToPayment') : t('common.proceedToPayment');
  }

  return (
    <Button
      bsStyle="primary"
      disabled={isMakingReservations}
      onClick={handleFormSubmit}
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
  handleFormSubmit: PropTypes.func.isRequired,
  hasPayment: PropTypes.bool.isRequired,
  needManualConfirmation: PropTypes.bool,
  t: PropTypes.func.isRequired
};

export default injectT(ReservationSubmitButton);
