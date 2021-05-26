import constants from 'constants/AppConstants';

import { isEmpty } from 'lodash';

import { canUserModifyReservation } from 'utils/reservationUtils';

/**
 * Filter list of reservations based on selected SHOW_ONLY filters.
 * By default return all fetched reservations.
 * @param {array} filters e.g. ["can_modify", "favorite"]
 * @param {array} reservations reservations to be filtered
 * @param {array} userFavoriteResources id strings of fav resources
 * @returns {array} filtered reservations.
 */
export function getFilteredReservations(filters, reservations, userFavoriteResources) {
  const favoriteResourceFilter = reservation => userFavoriteResources
    && userFavoriteResources.includes(reservation.resource.id);

  const canModifyFilter = reservation => canUserModifyReservation(reservation);

  if (isEmpty(filters) || !Array.isArray(filters)) {
    return reservations;
  }

  // Both options (favorite and can_modify) selected
  if (filters.length > 1) {
    return reservations.filter(
      reservation => canModifyFilter(reservation) && favoriteResourceFilter(reservation)
    );
  }

  if (filters.includes(constants.RESERVATION_SHOWONLY_FILTERS.FAVORITE)) {
    return reservations.filter(favoriteResourceFilter);
  }

  if (filters.includes(constants.RESERVATION_SHOWONLY_FILTERS.CAN_MODIFY)) {
    return reservations.filter(canModifyFilter);
  }

  return reservations;
}
