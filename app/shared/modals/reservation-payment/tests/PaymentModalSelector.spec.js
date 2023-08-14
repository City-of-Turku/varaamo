
import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';
import { getState } from 'utils/testUtils';
import PaymentModalSelector from '../PaymentModalSelector';

describe('shared/modals/reservation-payment/PaymentModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return PaymentModalSelector(state);
  }

  describe('contrast', () => {
    test('is returned', () => {
      const selected = getSelected();
      expect(selected.contrast).toBeDefined();
    });
  });

  describe('fontSize', () => {
    test('is returned', () => {
      const selected = getSelected();
      expect(selected.fontSize).toBeDefined();
    });
  });

  describe('isLoggedIn', () => {
    test('is returned', () => {
      const selected = getSelected();
      expect(selected.isLoggedIn).toBeDefined();
    });
  });

  describe('isSaving', () => {
    test('returns true if RESERVATION_PUT_REQUEST is active', () => {
      const activeRequests = { [ActionTypes.API.RESERVATION_PUT_REQUEST]: 1 };
      const selected = getSelected({
        'api.activeRequests': activeRequests,
      });
      expect(selected.isSaving).toBe(true);
    });

    test('returns false if RESERVATION_PUT_REQUEST is not active', () => {
      expect(getSelected().isSaving).toBe(false);
    });
  });

  describe('loginExpiresAt', () => {
    test('is returned', () => {
      const selected = getSelected();
      expect(selected.loginExpiresAt).toBeDefined();
    });
  });

  describe('returns correct reservation from the state', () => {
    test('when reservations.toShow has a reservation', () => {
      const reservation = { id: 'reservation-1' };
      const selected = getSelected({
        'ui.reservations.toShow': [reservation],
      });
      expect(selected.reservation).toEqual(reservation);
    });

    test('when reservations.toShow does not have reservations but reservations.toShowEdited has', () => {
      const reservation = { id: 'reservation-1' };
      const selected = getSelected({
        'ui.reservations.toShow': [],
        'ui.reservations.toShowEdited': [reservation],
      });
      expect(selected.reservation).toEqual(reservation);
    });

    test('when toShow and toShowEdited do not have reservations', () => {
      const selected = getSelected({
        'ui.reservations.toShow': [],
        'ui.reservations.toShowEdited': [],
      });
      expect(selected.reservation).toEqual({});
    });
  });


  test('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservations.toShow': [reservation],
    });

    expect(selected.resource).toEqual(resource);
  });

  describe('show', () => {
    test('returns true if modals.open contain RESERVATION_PAYMENT', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_PAYMENT],
      });
      expect(selected.show).toBe(true);
    });

    test(
      'returns false if modals.open does not contain RESERVATION_PAYMENT',
      () => {
        const selected = getSelected({
          'ui.modals.open': [],
        });
        expect(selected.show).toBe(false);
      }
    );
  });
});
