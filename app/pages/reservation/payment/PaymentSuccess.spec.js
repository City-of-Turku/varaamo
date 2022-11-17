import { shallow } from 'enzyme';
import React from 'react';

import ReservationConfirmation from '../reservation-confirmation/ReservationConfirmation';
import { UnconnectedPaymentSuccess as PaymentSuccess } from './PaymentSuccess';


describe('pages/reservation/payment/PaymentFailed', () => {
  const defaultProps = {
    currentLanguage: 'fi',
    reservation: { id: 'test-reservation' },
    resource: { id: 'test-resource' },
    user: { name: 'test-user' },
    isLoggedIn: false,
    history: {}
  };

  function getWrapper(extraProps) {
    return shallow(<PaymentSuccess {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('wrapping div', () => {
      const div = getWrapper();
      expect(div).toHaveLength(1);
      expect(div.prop('className')).toBe('reservation-payment-success');
    });

    test('ReservationConfirmation with correct props', () => {
      const reservationConf = getWrapper().find(ReservationConfirmation);
      expect(reservationConf).toHaveLength(1);
      expect(reservationConf.prop('currentLanguage')).toBe(defaultProps.currentLanguage);
      expect(reservationConf.prop('history')).toBe(defaultProps.history);
      expect(reservationConf.prop('isLoggedIn')).toBe(defaultProps.isLoggedIn);
      expect(reservationConf.prop('reservation')).toBe(defaultProps.reservation);
      expect(reservationConf.prop('resource')).toBe(defaultProps.resource);
      expect(reservationConf.prop('user')).toBe(defaultProps.user);
    });

    describe('ReservationConfirmation with correct isEdited prop', () => {
      test('when resource needManualConfirmation is true', () => {
        const resource = { id: 'test-resource', needManualConfirmation: true };
        const reservationConf = getWrapper({ resource }).find(ReservationConfirmation);
        expect(reservationConf.prop('isEdited')).toBe(true);
      });

      test('when resource needManualConfirmation is false', () => {
        const resource = { id: 'test-resource', needManualConfirmation: false };
        const reservationConf = getWrapper({ resource }).find(ReservationConfirmation);
        expect(reservationConf.prop('isEdited')).toBe(false);
      });
    });
  });
});
