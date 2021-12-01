import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal } from 'react-bootstrap';
import classNames from 'classnames';

import injectT from '../../../i18n/injectT';
import { closeReservationPaymentModal } from 'actions/uiActions';
import paymentModalSelector from './PaymentModalSelector';
import { putReservation } from 'actions/reservationActions';
import { getPaymentReturnUrl } from 'utils/reservationUtils';
import TimeRange from '../../time-range/TimeRange';

function UnconnectedPaymentModalContainer({
  actions, contrast, fontSize, reservation, resource, show, t
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

  if (!reservation || !reservation.order) {
    return null;
  }

  return (
    <Modal
      className={classNames('reservation-payment-modal', fontSize, contrast)}
      onHide={actions.closeReservationPaymentModal}
      show={show}
    >
      <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
        <Modal.Title componentClass="h3">
          {t('ReservationPaymentModal.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="reservation-name">{resource.name}</p>
        <div className="reservation-time">
          <TimeRange begin={reservation.begin} end={reservation.end} />
        </div>
        <p className="reservation-price">{`${t('common.priceTotalLabel')}: ${reservation.order.price}€`}</p>
        <p className="reservation-payment-notice">
          {t('ReservationPaymentModal.onlinePaymentNotice')}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="default"
          className={fontSize}
          onClick={actions.closeReservationPaymentModal}
        >
          {t('common.back')}
        </Button>

        <Button
          bsStyle="success"
          className={fontSize}
          onClick={() => handleUpdateReservation()}
        >
          {t('common.proceedToPayment')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

UnconnectedPaymentModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  contrast: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
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
