import moment from 'moment';

import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { getDateAndTime, getNormalizedReservation } from '../listUtils';

describe('manage-reservations/list/listUtils', () => {
  describe('getDateAndTime', () => {
    test('returns correct string with given reservation', () => {
      const begin = moment('2021-02-08 09:30');
      const end = moment('2021-02-08 10:30');
      const reservation = Reservation.build({ begin, end });
      const expectedResult = `${begin.format('ddd L HH:mm')} - ${end.format('HH:mm')}`;
      expect(getDateAndTime(reservation)).toBe(expectedResult);
    });
    test('returns correct string with given multiday reservation', () => {
      const begin = moment('2021-02-08 09:30');
      const end = moment('2021-02-09 10:30');
      const reservation = Reservation.build({ begin, end });
      const expectedResult = `${begin.format('D.M.YYYY')} - ${end.format('D.M.YYYY')}`;
      expect(getDateAndTime(reservation)).toBe(expectedResult);
    });
  });

  describe('getNormalizedReservation', () => {
    test('returns reservation and its resource with id only', () => {
      const resource = Resource.build();
      const reservation = Reservation.build({ resource });
      const expectedResult = { ...reservation, resource: resource.id };
      expect(getNormalizedReservation(reservation)).toStrictEqual(expectedResult);
    });
  });
});
