import ActionTypes from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

import { getState } from 'utils/testUtils';
import reservationCancelModalSelector from './reservationCancelModalSelector';

describe('shared/modals/reservation-cancel/reservationCancelModalSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return reservationCancelModalSelector(state);
  }

  describe('cancelAllowed', () => {
    test('returns true if user is an admin', () => {
      const selected = getSelected({
        auth: { userId: 'u-1' },
        'data.users': { 'u-1': { isStaff: true } },
      });
      expect(selected.cancelAllowed).toBe(true);
    });

    test('returns true if reservation is not preliminary', () => {
      const reservation = { id: 'reservation-1', needManualConfirmation: false };
      const selected = getSelected({
        'ui.reservations.toCancel': [reservation],
      });
      expect(selected.cancelAllowed).toBe(true);
    });

    test('returns true if reservation state is not confirmed', () => {
      const reservation = { id: 'reservation-1', state: 'requested' };
      const selected = getSelected({
        'ui.reservations.toCancel': [reservation],
      });
      expect(selected.cancelAllowed).toBe(true);
    });

    describe('returns true when reservation is preliminary, its state is requested and it has an order', () => {
      const order = { id: 'test-id', price: 3.50 };
      const reservation = {
        id: 'reservation-1',
        needManualConfirmation: true,
        order,
        state: 'requested',
      };
      const selected = getSelected({
        'ui.reservations.toCancel': [reservation],
      });
      expect(selected.cancelAllowed).toBe(true);
    });

    test(
      'returns false if user is not admin and reservation is confirmed and preliminary',
      () => {
        const reservation = {
          id: 'reservation-1',
          needManualConfirmation: true,
          state: 'confirmed',
        };
        const selected = getSelected({
          'ui.reservations.toCancel': [reservation],
        });
        expect(selected.cancelAllowed).toBe(false);
      }
    );

    test('returns false if user is not admin and reservation has an order', () => {
      const reservationA = {
        id: 'reservation-A',
        needManualConfirmation: true,
        state: 'confirmed',
        order: { id: 'abc123' }
      };
      const reservationB = {
        id: 'reservation-B',
        needManualConfirmation: false,
        state: 'requested',
        order: { id: 'fgh456' }
      };
      const selectedA = getSelected({
        'ui.reservations.toCancel': [reservationA],
      });
      const selectedB = getSelected({
        'ui.reservations.toCancel': [reservationB],
      });
      expect(selectedA.cancelAllowed).toBe(false);
      expect(selectedB.cancelAllowed).toBe(false);
    });
  });

  test('returns fontSize', () => {
    expect(getSelected().fontSize).toBeDefined();
  });

  describe('isCancellingReservations', () => {
    test('returns true if RESERVATION_DELETE_REQUEST is active', () => {
      const activeRequests = { [ActionTypes.API.RESERVATION_DELETE_REQUEST]: 1 };
      const selected = getSelected({
        'api.activeRequests': activeRequests,
      });
      expect(selected.isCancellingReservations).toBe(true);
    });

    test('returns false if RESERVATION_DELETE_REQUEST is not active', () => {
      expect(getSelected().isCancellingReservations).toBe(false);
    });
  });

  test('returns correct reservation from the state', () => {
    const reservation = { id: 'reservation-1' };
    const selected = getSelected({
      'ui.reservations.toCancel': [reservation],
    });
    expect(selected.reservation).toEqual(reservation);
  });

  test('returns correct resource from the state', () => {
    const resource = { id: 'resource-1' };
    const reservation = { id: 'reservation-1', resource: resource.id };
    const selected = getSelected({
      'data.resources': { [resource.id]: resource },
      'ui.reservations.toCancel': [reservation],
    });

    expect(selected.resource).toEqual(resource);
  });

  describe('show', () => {
    test('returns true if modals.open contain RESERVATION_CANCEL', () => {
      const selected = getSelected({
        'ui.modals.open': [ModalTypes.RESERVATION_CANCEL],
      });
      expect(selected.show).toBe(true);
    });

    test(
      'returns false if modals.open does not contain RESERVATION_CANCEL',
      () => {
        const selected = getSelected({
          'ui.modals.open': [],
        });
        expect(selected.show).toBe(false);
      }
    );
  });
});
