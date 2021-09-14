import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeResourceTermsModal, closeResourcePaymentTermsModal } from 'actions/uiActions';
import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import reservationTermsModalSelector from './reservationTermsModalSelector';
import { getPaymentTermsAndConditions, getTermsAndConditions } from 'utils/resourceUtils';

class UnconnectedReservationTermsModal extends Component {
  render() {
    const {
      actions,
      resource,
      showGeneric,
      showPayment,
      t,
      termsType,
    } = this.props;

    const { name } = resource;
    const isPayment = termsType === 'payment';
    const termsText = isPayment ? getPaymentTermsAndConditions(resource)
      : getTermsAndConditions(resource);

    return (
      <Modal
        className="app-ReservationTermsModal"
        onHide={isPayment
          ? actions.closeResourcePaymentTermsModal : actions.closeResourceTermsModal}
        show={(isPayment && showPayment) || (!isPayment && showGeneric)}
      >
        <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
          <Modal.Title>
            {isPayment ? t('ReservationTermsModal.resourcePaymentTermsTitle')
              : t('ReservationTermsModal.resourceTermsTitle')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="app-ReservationTermsModal-body">
            {isPayment ? t('ReservationTermsModal.resourcePaymentTermsSubTitle', { name })
              : t('ReservationTermsModal.resourceTermsSubTitle', { name })}
            <span>
              <WrappedText
                allowNamedLinks
                openLinksInNewTab
                text={termsText}
              />
            </span>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            className="pull-right"
            onClick={isPayment
              ? actions.closeResourcePaymentTermsModal : actions.closeResourceTermsModal}
          >
            {t('common.continue')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationTermsModal.propTypes = {
  actions: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  showGeneric: PropTypes.bool.isRequired,
  showPayment: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  termsType: PropTypes.string,
};

UnconnectedReservationTermsModal = injectT(UnconnectedReservationTermsModal);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeResourceTermsModal,
    closeResourcePaymentTermsModal,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationTermsModal };
export default connect(reservationTermsModalSelector, mapDispatchToProps)(
  UnconnectedReservationTermsModal
);
