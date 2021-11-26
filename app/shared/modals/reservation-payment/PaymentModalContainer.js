import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectT from '../../../i18n/injectT';
import { closeReservationPaymentModal } from 'actions/uiActions';
import ModalWrapper from '../ModalWrapper';
import paymentModalSelector from './PaymentModalSelector';
import { putReservation } from 'actions/reservationActions';
import { getPaymentReturnUrl } from 'utils/reservationUtils';

function UnconnectedPaymentModalContainer({
  actions, reservation, show, t
}) {
  const handleUpdateReservation = () => {
    const returnUrl = getPaymentReturnUrl();
    const order = { id: reservation.order.id, returnUrl };
    const updatedResevation = { ...reservation, order };

    actions.putReservation(updatedResevation);
  };

  // redirect to payment url when order has it defined
  const { order } = reservation;
  if (order && 'paymentUrl' in order) {
    window.location = order.paymentUrl;
  }

  return (
    <ModalWrapper
      className="payment-modal"
      onClose={actions.closeReservationPaymentModal}
      show={show}
      title={t('ReservationPaymentModal.title')}
    >
      <div>
        <p>
          {`maksa tämä varaus: ${reservation.id}?`}
        </p>
        <button
          onClick={() => handleUpdateReservation()}
          type="button"
        >
          {t('common.proceedToPayment')}
        </button>
      </div>
    </ModalWrapper>
  );
}

UnconnectedPaymentModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  reservation: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedPaymentModalContainer = injectT(UnconnectedPaymentModalContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationPaymentModal,
    putReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedPaymentModalContainer };
export default connect(paymentModalSelector, mapDispatchToProps)(UnconnectedPaymentModalContainer);
