import React from 'react';

import ReservationSubmitButton from './ReservationSubmitButton';
import { shallowWithIntl } from 'utils/testUtils';

describe('pages/reservation/reservation-information/ReservationSubmitButton', () => {
  const defaultProps = {
    isMakingReservations: false,
    handleSubmit: () => {},
    hasPayment: false,
    onConfirm: () => {}
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationSubmitButton {...defaultProps} {...extraProps} />);
  }

  describe('renders', () => {
    test('with correct props', () => {
      const button = getWrapper();
      expect(button).toHaveLength(1);
      expect(button.prop('bsStyle')).toBe('primary');
      expect(button.prop('disabled')).toBe(defaultProps.isMakingReservations);
      expect(button.prop('onClick')).toBe(defaultProps.handleSubmit(defaultProps.onConfirm));
      expect(button.prop('type')).toBe('submit');
    });

    describe('with correct text', () => {
      describe('when hasPayment is true', () => {
        test('and isMakingReservations is true', () => {
          const props = { hasPayment: true, isMakingReservations: true };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.proceedingToPayment');
        });

        test('and isMakingReservations is false', () => {
          const props = { hasPayment: true, isMakingReservations: false };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.proceedToPayment');
        });
      });

      describe('when hasPayment is false', () => {
        test('and isMakingReservations is true', () => {
          const props = { hasPayment: false, isMakingReservations: true };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.saving');
        });

        test('and isMakingReservations is false', () => {
          const props = { hasPayment: false, isMakingReservations: false };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.save');
        });
      });
    });
  });
});
