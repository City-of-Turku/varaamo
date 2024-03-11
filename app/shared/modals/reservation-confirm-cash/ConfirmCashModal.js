import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import { connect } from 'react-redux';

import injectT from '../../../i18n/injectT';
import { currentLanguageSelector } from '../../../state/selectors/translationSelectors';
import { fontSizeSelector } from '../../../state/selectors/accessibilitySelectors';

function ConfirmCashModal({
  show, onClose, t, onSubmit, fontSize
}) {
  return (
    <Modal
      animation={false}
      className={fontSize}
      onHide={() => onClose()}
      show={show}
    >
      <Modal.Header closeButton closeLabel={t('ModalHeader.closeButtonText')}>
        <Modal.Title componentClass="h2">{t('ConfirmCashPaymentModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('ConfirmCashPaymentModal.body')}
      </Modal.Body>
      <Modal.Footer>
        <Button
          bsStyle="primary"
          className={fontSize}
          onClick={() => onClose()}
        >
          {t('common.back')}
        </Button>
        <Button
          bsStyle="success"
          className={fontSize}
          onClick={() => onSubmit()}
        >
          {t('common.confirmCashPayment')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmCashModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  fontSize: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    currentLanguage: currentLanguageSelector(state),
    fontSize: fontSizeSelector(state),
  };
}

const UnconnectedConfirmCashModal = injectT(ConfirmCashModal);
export { UnconnectedConfirmCashModal };
export default connect(mapStateToProps, null)(injectT(ConfirmCashModal));
