import constants from 'constants/AppConstants';

import { getFilteredReservations } from '../manageReservationsPageUtils';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';

describe('pages/manage-reservations/manageReservationsPageUtils', () => {
  describe('getFilteredReservations', () => {
    const resourceFav = Resource.build({ isFavorite: true });
    const resourceNotFav = Resource.build({ isFavorite: false });

    const reservationA = Reservation.build({
      resource: resourceNotFav,
      userPermissions: { canModify: false }
    });

    const reservationB = Reservation.build({
      resource: resourceNotFav,
      userPermissions: { canModify: true }
    });

    const reservationC = Reservation.build({
      resource: resourceFav,
      userPermissions: { canModify: false }
    });

    const reservationD = Reservation.build({
      resource: resourceFav,
      userPermissions: { canModify: true }
    });

    const reservations = [reservationA, reservationB, reservationC, reservationD];
    const userFavoriteResources = [resourceFav.id];

    test('returns all reservations by default', () => {
      const filters = [];

      expect(getFilteredReservations(
        filters, reservations, userFavoriteResources
      )).toBe(reservations);
    });

    test('returns correct reservations with filter: favorite', () => {
      const filters = [constants.RESERVATION_SHOWONLY_FILTERS.FAVORITE];

      expect(getFilteredReservations(
        filters, reservations, userFavoriteResources
      )).toStrictEqual([reservationC, reservationD]);
    });

    test('returns correct reservations with filter: can_modify', () => {
      const filters = [constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY];

      expect(getFilteredReservations(
        filters, reservations, userFavoriteResources
      )).toStrictEqual([reservationB, reservationD]);
    });

    test('returns correct reservations with filters: can_modify and favorite', () => {
      const filters = [
        constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY,
        constants.RESERVATION_SHOWONLY_FILTERS.FAVORITE
      ];

      expect(getFilteredReservations(
        filters, reservations, userFavoriteResources
      )).toStrictEqual([reservationD]);
    });
  });
});
