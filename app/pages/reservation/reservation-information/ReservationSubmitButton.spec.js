import React from 'react';

import ReservationSubmitButton from './ReservationSubmitButton';
import { shallowWithIntl } from 'utils/testUtils';

describe('pages/reservation/reservation-information/ReservationSubmitButton', () => {
  const defaultProps = {
    isMakingReservations: false,
    handleFormSubmit: () => {},
    hasPayment: false,
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
      expect(button.prop('onClick')).toBe(defaultProps.handleFormSubmit);
      expect(button.prop('type')).toBe('submit');
    });

    describe('with correct text', () => {
      describe('when hasPayment is true', () => {
        const hasPayment = true;

        test('and isMakingReservations is true', () => {
          const props = { hasPayment, isMakingReservations: true };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.proceedingToPayment');
        });

        test('and isMakingReservations is false', () => {
          const props = { hasPayment, isMakingReservations: false };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.proceedToPayment');
        });

        test('and making a manually confirmed reservation', () => {
          const props = { hasPayment, isMakingReservations: true, needManualConfirmation: true };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.saving');
        });

        test('and not making a manually confirmed reservation', () => {
          const props = { hasPayment, isMakingReservations: false, needManualConfirmation: true };
          const button = getWrapper(props);
          expect(button.props().children).toBe('common.save');
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
