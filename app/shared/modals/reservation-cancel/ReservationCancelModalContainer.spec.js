import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import CompactReservationList from 'shared/compact-reservation-list';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedReservationCancelModalContainer as ReservationCancelModalContainer,
} from './ReservationCancelModalContainer';

describe('shared/modals/reservation-cancel/ReservationCancelModalContainer', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({ resource: resource.id });
  const defaultProps = {
    actions: {
      closeReservationCancelModal: () => null,
      deleteReservation: () => null,
    },
    cancelAllowed: false,
    fontSize: 'test-large',
    isCancellingReservations: false,
    reservation,
    resource,
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationCancelModalContainer {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).toBe(1);
      expect(modalComponent.prop('className')).toBe(defaultProps.fontSize);
      expect(modalComponent.prop('onHide')).toBe(defaultProps.actions.closeReservationCancelModal);
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

      describe('title', () => {
        test('is correct if cancel is allowed', () => {
          const modalTitle = getModalHeaderWrapper({ cancelAllowed: true }).find(Modal.Title);
          expect(modalTitle.length).toBe(1);
          expect(modalTitle.prop('children')).toBe('ReservationCancelModal.cancelAllowedTitle');
        });

        test('is correct if cancel is not allowed', () => {
          const modalTitle = getModalHeaderWrapper({ cancelAllowed: false }).find(Modal.Title);
          expect(modalTitle.length).toBe(1);
          expect(modalTitle.prop('children')).toBe('ReservationCancelModal.cancelNotAllowedTitle');
          expect(modalTitle.prop('componentClass')).toBe('h3');
        });
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      test('is rendered', () => {
        expect(getModalBodyWrapper).toHaveLength(1);
      });

      describe('if cancel is allowed', () => {
        const cancelAllowed = true;

        test('renders CompactReservationList', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find(CompactReservationList)
          ).toHaveLength(1);
        });

        test('does not render responsibleContactInfo', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find('.responsible-contact-info')
          ).toHaveLength(0);
        });
      });

      describe('if cancel is not allowed', () => {
        const cancelAllowed = false;

        test('renders responsibleContactInfo', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find('.responsible-contact-info')
          ).toHaveLength(1);
        });

        test('does not render CompactReservationList', () => {
          expect(
            getModalBodyWrapper({ cancelAllowed }).find(CompactReservationList)
          ).toHaveLength(0);
        });
      });
    });

    describe('Footer buttons', () => {
      function getFooterButtonsWrapper(props) {
        return getWrapper(props).find(Modal.Footer).find(Button);
      }

      describe('if cancel is allowed', () => {
        const cancelAllowed = true;
        const buttons = getFooterButtonsWrapper({ cancelAllowed });

        test('renders cancel button', () => {
          expect(buttons.at(0).prop('bsStyle')).toBe('default');
          expect(buttons.at(0).prop('className')).toBe(defaultProps.fontSize);
          expect(buttons.at(0).props().children).toBe('ReservationCancelModal.cancelAllowedCancel');
        });

        test('renders confirm button', () => {
          expect(buttons.at(1).prop('bsStyle')).toBe('danger');
          expect(buttons.at(1).prop('className')).toBe(defaultProps.fontSize);
          expect(buttons.at(1).prop('disabled')).toBe(defaultProps.isCancellingReservations);
          expect(buttons.at(1).props().children).toBe('ReservationCancelModal.cancelAllowedConfirm');
        });
      });

      describe('if cancel is not allowed', () => {
        const cancelAllowed = false;
        const buttons = getFooterButtonsWrapper({ cancelAllowed });

        test('renders back button', () => {
          expect(buttons.at(0).props().children).toBe('common.back');
        });
      });
    });
  });

  describe('handleCancel', () => {
    const closeReservationCancelModal = simple.mock();
    const deleteReservation = simple.mock();
    const actions = { closeReservationCancelModal, deleteReservation };

    beforeAll(() => {
      const instance = getWrapper({ actions }).instance();
      instance.handleCancel();
    });

    test('calls deleteReservation with the reservation', () => {
      expect(deleteReservation.callCount).toBe(1);
      expect(deleteReservation.lastCall.arg).toEqual(defaultProps.reservation);
    });

    test('closes the ReservationCancelModal', () => {
      expect(closeReservationCancelModal.callCount).toBe(1);
    });
  });
});
