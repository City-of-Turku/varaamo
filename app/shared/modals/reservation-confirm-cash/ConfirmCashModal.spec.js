import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedConfirmCashModal as ConfirmCashModal,
} from './ConfirmCashModal';

describe('shared/modals/reservation-confirm-cash/ConfirmCashModal', () => {
  const defaultProps = {
    onClose: () => {},
    onSubmit: () => {},
    fontSize: 'test-large',
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ConfirmCashModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).toBe(1);
      expect(modalComponent.prop('animation')).toBe(false);
      expect(modalComponent.prop('className')).toBe(defaultProps.fontSize);
      expect(modalComponent.prop('onHide')).toBeDefined();
      expect(modalComponent.prop('show')).toBe(defaultProps.show);
    });

    describe('Modal header', () => {
      function getModalHeaderWrapper(props) {
        return getWrapper(props).find(Modal.Header);
      }

      test('is rendered', () => {
        expect(getModalHeaderWrapper()).toHaveLength(1);
      });

      test('contains a close button', () => {
        expect(getModalHeaderWrapper().props().closeButton).toBe(true);
        expect(getModalHeaderWrapper().props().closeLabel).toBe('ModalHeader.closeButtonText');
      });

      test('title is correct', () => {
        const modalTitle = getModalHeaderWrapper().find(Modal.Title);
        expect(modalTitle.length).toBe(1);
        expect(modalTitle.prop('children')).toBe('ConfirmCashPaymentModal.title');
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      test('is rendered', () => {
        const body = getModalBodyWrapper();
        expect(body).toHaveLength(1);
        expect(body.prop('children')).toBe('ConfirmCashPaymentModal.body');
      });
    });

    describe('Modal footer', () => {
      test('is rendered', () => {
        const footer = getWrapper().find(Modal.Footer);
        expect(footer).toHaveLength(1);
      });

      test('buttons are rendered', () => {
        const footer = getWrapper().find(Modal.Footer);
        const buttons = footer.find(Button);
        expect(buttons).toHaveLength(2);
        expect(buttons.at(0).prop('bsStyle')).toBe('primary');
        expect(buttons.at(0).prop('className')).toBe(defaultProps.fontSize);
        expect(buttons.at(0).prop('onClick')).toBeDefined();
        expect(buttons.at(0).prop('children')).toBe('common.back');

        expect(buttons.at(1).prop('bsStyle')).toBe('success');
        expect(buttons.at(1).prop('className')).toBe(defaultProps.fontSize);
        expect(buttons.at(1).prop('onClick')).toBeDefined();
        expect(buttons.at(1).prop('children')).toBe('common.confirmCashPayment');
      });
    });
  });
});
