import simple from 'simple-mock';

import * as apiUtils from 'utils/apiUtils';
import * as reservationActions from 'actions/reservationActions';

describe('Actions: reservationActions', () => {
  const reservation = {
    url: 'http://reservation.url',
    resource: '1234qwert',
  };

  let getRequestTypeDescriptorMock;
  let getSuccessTypeDescriptorMock;
  beforeEach(() => {
    getRequestTypeDescriptorMock = simple.mock(apiUtils, 'getRequestTypeDescriptor');
    getSuccessTypeDescriptorMock = simple.mock(apiUtils, 'getSuccessTypeDescriptor');
  });

  describe('deleteReservation', () => {
    test('includes correct track in meta', () => {
      reservationActions.deleteReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).toEqual({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-cancel',
          reservation.resource,
        ],
      });
    });
  });

  describe('postRecurringReservations', () => {
    test('includes correct track in meta', () => {
      reservationActions.postRecurringReservations(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).toEqual({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-add',
          reservation.resource,
        ],
      });
    });
  });

  describe('postReservation', () => {
    test('includes correct track in meta', () => {
      reservationActions.postReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).toEqual({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-add',
          reservation.resource,
        ],
      });
    });
  });
  describe('putReservation', () => {
    test('includes correct track in meta', () => {
      reservationActions.putReservation(reservation);
      expect(getRequestTypeDescriptorMock.lastCall.args[1].meta.track).toEqual({
        event: 'trackEvent',
        args: [
          'Reservation',
          'reservation-edit',
          reservation.resource,
        ],
      });
    });

    describe('includes correct omitNotification boolean in meta', () => {
      test('by default when value not given', () => {
        reservationActions.putReservation(reservation);
        expect(getSuccessTypeDescriptorMock.lastCall.args[1].meta.omitNotification).toBe(false);
      });

      test('when omitNotification is given', () => {
        const omitSuccessNotification = true;
        reservationActions.putReservation(reservation, omitSuccessNotification);
        expect(getSuccessTypeDescriptorMock.lastCall.args[1].meta.omitNotification)
          .toBe(omitSuccessNotification);
      });
    });
  });
});
