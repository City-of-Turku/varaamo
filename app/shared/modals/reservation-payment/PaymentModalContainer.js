import React, { useEffect } from 'react';
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
import { handleSigninRefresh } from '../../../utils/authUtils';

function UnconnectedPaymentModalContainer({
  actions, contrast, fontSize, isLoggedIn, isSaving, loginExpiresAt, reservation, resource, show, t
}) {
  useEffect(() => {
    const { order } = reservation;
    if (order && 'paymentUrl' in order) {
      actions.closeReservationPaymentModal();
      window.location = order.paymentUrl;
    }
  }, [reservation]);

  // handle sign in refresh only when modal is open
  if (show) {
    handleSigninRefresh(isLoggedIn, loginExpiresAt);
  }

  const handleUpdateReservation = () => {
    const returnUrl = getPaymentReturnUrl();
    const order = { id: reservation.order.id, returnUrl };
    const updatedResevation = { ...reservation, order };
    const omitSuccessNotification = true;
    actions.putReservation(updatedResevation, omitSuccessNotification);
  };

  const reservationExists = reservation && reservation.order;

  return (
    <Modal
      // animation={false}
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
        {reservationExists ? (
          <React.Fragment>
            <p className="reservation-name">{resource.name}</p>
            <div className="reservation-time">
              <TimeRange begin={reservation.begin} end={reservation.end} />
            </div>
            <p className="reservation-price">{`${t('common.priceTotalLabel')}: ${reservation.order.price}€`}</p>
            <p className="reservation-payment-notice">
              {t('ReservationPaymentModal.onlinePaymentNotice')}
            </p>
          </React.Fragment>
        )
          : <p>{t('Notifications.errorMessage')}</p>
      }
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
          disabled={!reservationExists || isSaving}
          onClick={() => handleUpdateReservation()}
        >
          {isSaving ? t('common.proceedingToPayment') : t('common.proceedToPayment')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

UnconnectedPaymentModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  contrast: PropTypes.string.isRequired,
  fontSize: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  loginExpiresAt: PropTypes.number.isRequired,
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
