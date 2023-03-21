import constants from 'constants/AppConstants';
import { getFilteredReservations, getHiddenReservationCount, getPageResultsText } from '../manageReservationsPageUtils';
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

  describe('getHiddenReservationCount', () => {
    test('returns given reservations length substracted from filtered reservations length', () => {
      const test1 = { id: 'test1' };
      const test2 = { id: 'test2' };
      const reservations = [test1, test2];
      const filteredReservations = [test1];
      expect(getHiddenReservationCount(reservations, filteredReservations))
        .toBe(reservations.length - filteredReservations.length);
    });
  });

  describe('getPageResultsText', () => {
    describe('returns correctly formatted string', () => {
      test('when total results is smaller than results per page', () => {
        const currentPage = 0;
        const resultsPerPage = 10;
        const currentPageResults = 4;
        const totalResults = 4;
        const expected = '1 - 4 / 4';
        expect(getPageResultsText(currentPage, resultsPerPage, currentPageResults, totalResults))
          .toBe(expected);
      });

      test('when total results is larger than results per page', () => {
        const currentPage = 0;
        const resultsPerPage = 10;
        const currentPageResults = 10;
        const totalResults = 16;
        const expected = '1 - 10 / 16';
        expect(getPageResultsText(currentPage, resultsPerPage, currentPageResults, totalResults))
          .toBe(expected);
      });

      test('when showing second page results', () => {
        const currentPage = 1;
        const resultsPerPage = 10;
        const currentPageResults = 6;
        const totalResults = 16;
        const expected = '11 - 16 / 16';
        expect(getPageResultsText(currentPage, resultsPerPage, currentPageResults, totalResults))
          .toBe(expected);
      });
    });
  });
});
