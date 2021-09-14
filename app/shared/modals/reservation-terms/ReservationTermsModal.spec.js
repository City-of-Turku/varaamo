import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import WrappedText from 'shared/wrapped-text';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedReservationTermsModal as ReservationTermsModal,
} from './ReservationTermsModal';

describe('shared/modals/reservation-cancel/ReservationTermsModal', () => {
  const resource = Resource.build();
  const defaultProps = {
    actions: {
      closeResourceTermsModal: () => null,
      closeResourcePaymentTermsModal: () => null
    },
    resource,
    showGeneric: true,
    showPayment: false,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationTermsModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).toBe(1);
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

      test('contains correct title when terms type is not payment', () => {
        const modalTitle = getModalHeaderWrapper().find(Modal.Title);
        expect(modalTitle.length).toBe(1);
        expect(modalTitle.prop('children')).toBe('ReservationTermsModal.resourceTermsTitle');
      });

      test('contains corrent title when terms type is payment', () => {
        const modalTitle = getModalHeaderWrapper({ termsType: 'payment' }).find(Modal.Title);
        expect(modalTitle.length).toBe(1);
        expect(modalTitle.prop('children')).toBe('ReservationTermsModal.resourcePaymentTermsTitle');
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      test('is rendered', () => {
        expect(getModalBodyWrapper()).toHaveLength(1);
      });

      test('renders correct subtitle when terms type is not payment', () => {
        const text = getModalBodyWrapper().find('.app-ReservationTermsModal-body');
        expect(text).toHaveLength(1);
        expect(text.text()).toContain('ReservationTermsModal.resourceTermsSubTitle');
      });

      test('renders correct subtitle when terms type is payment', () => {
        const text = getModalBodyWrapper({ termsType: 'payment' }).find('.app-ReservationTermsModal-body');
        expect(text).toHaveLength(1);
        expect(text.text()).toContain('ReservationTermsModal.resourcePaymentTermsSubTitle');
      });

      test('renders correct WrappedText when terms type is not payment', () => {
        const resourceWithTerms = Resource.build({
          genericTerms: 'some generic terms',
        });
        const wrappedText = getModalBodyWrapper({ resource: resourceWithTerms }).find(WrappedText);
        expect(wrappedText).toHaveLength(1);
        expect(wrappedText.prop('text')).toBe(resourceWithTerms.genericTerms);
        expect(wrappedText.prop('allowNamedLinks')).toBe(true);
        expect(wrappedText.prop('openLinksInNewTab')).toBe(true);
      });

      test('renders correct WrappedText when terms type is payment', () => {
        const resourceWithTerms = Resource.build({
          paymentTerms: 'some payment terms',
        });
        const wrappedText = getModalBodyWrapper({ resource: resourceWithTerms, termsType: 'payment' }).find(WrappedText);
        expect(wrappedText).toHaveLength(1);
        expect(wrappedText.prop('text')).toBe(resourceWithTerms.paymentTerms);
        expect(wrappedText.prop('allowNamedLinks')).toBe(true);
        expect(wrappedText.prop('openLinksInNewTab')).toBe(true);
      });
    });

    describe('Modal Footer', () => {
      function getModalFooterWrapper(props) {
        return getWrapper(props).find(Modal.Footer);
      }

      test('is rendered', () => {
        expect(getModalFooterWrapper).toHaveLength(1);
      });

      describe('renders button', () => {
        const closeResourceTermsModal = simple.mock();
        const closeResourcePaymentTermsModal = simple.mock();
        const actions = { closeResourceTermsModal, closeResourcePaymentTermsModal };

        test('with correct props when terms type is not payment', () => {
          const button = getModalFooterWrapper({ actions }).find(Button);
          expect(button).toHaveLength(1);
          expect(button.prop('bsStyle')).toBe('primary');
          expect(button.prop('className')).toBe('pull-right');
          expect(button.prop('onClick')).toBe(closeResourceTermsModal);
          expect(button.prop('children')).toBe('common.continue');
        });

        test('with correct props when terms type is payment', () => {
          const button = getModalFooterWrapper({ actions, termsType: 'payment' }).find(Button);
          expect(button).toHaveLength(1);
          expect(button.prop('bsStyle')).toBe('primary');
          expect(button.prop('className')).toBe('pull-right');
          expect(button.prop('onClick')).toBe(closeResourcePaymentTermsModal);
          expect(button.prop('children')).toBe('common.continue');
        });
      });
    });
  });
});
