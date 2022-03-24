import React from 'react';
import { Button } from 'react-bootstrap';

import { shallowWithIntl } from 'utils/testUtils';
import constants from '../../../../constants/AppConstants';
import PaymentButton from '../PaymentButton';

describe('shared/modals/reservation-payment/PaymentButton', () => {
  const defaultProps = {
    fontSize: 'some-style',
    handleUpdateReservation: () => {},
    isSaving: false,
    paymentUrl: '',
    reservationExists: false,
    reservationState: '',
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<PaymentButton {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    describe('when reservationExists is true', () => {
      const reservationExists = true;

      test('correct button when paymentUrl is defined', () => {
        const paymentUrl = 'https://google.fi';
        const button = getWrapper({ reservationExists, paymentUrl }).find(Button);
        expect(button).toHaveLength(1);
        expect(button.prop('bsStyle')).toBe('success');
        expect(button.prop('className')).toBe(defaultProps.fontSize);
        expect(button.prop('href')).toBe(paymentUrl);
        expect(button.prop('children')).toBe('common.resumePayment');
      });

      describe('when paymentUrl is not defined and reservation state is waiting for payment', () => {
        const reservationState = constants.RESERVATION_STATE.READY_FOR_PAYMENT;
        test('correct button', () => {
          const button = getWrapper({ reservationExists, reservationState }).find(Button);
          expect(button).toHaveLength(1);
          expect(button.prop('bsStyle')).toBe('success');
          expect(button.prop('className')).toBe(defaultProps.fontSize);
          expect(button.prop('disabled')).toBe(defaultProps.isSaving);
          expect(button.prop('onClick')).toBe(defaultProps.handleUpdateReservation);
        });

        test('correct button text when isSaving is true', () => {
          const isSaving = true;
          const button = getWrapper({ reservationExists, reservationState, isSaving }).find(Button);
          expect(button).toHaveLength(1);
          expect(button.prop('children')).toBe('common.proceedingToPayment');
        });

        test('correct button text when isSaving is false', () => {
          const isSaving = false;
          const button = getWrapper({ reservationExists, reservationState, isSaving }).find(Button);
          expect(button).toHaveLength(1);
          expect(button.prop('children')).toBe('common.proceedToPayment');
        });
      });

      test('null when paymentUrl is not defined and reservation state is not ready for payment', () => {
        const reservationState = 'some-state';
        const wrapper = getWrapper({ reservationExists, reservationState });
        expect(wrapper.isEmptyRender()).toBe(true);
      });
    });

    test('null when reservationExists is false', () => {
      const reservationExists = false;
      const wrapper = getWrapper({ reservationExists });
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });
});
