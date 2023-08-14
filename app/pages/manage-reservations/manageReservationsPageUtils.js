import { isEmpty } from 'lodash';

import constants from 'constants/AppConstants';
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

/**
 * Gets amount of reservations which are filtered out and hidden from original reservation count
 * @param {array} reservations unfiltered reservation set
 * @param {array} filteredReservations set of already filtered reservations
 * @returns {number} amount of reservations filtered out of given reservations
 */
export function getHiddenReservationCount(reservations, filteredReservations) {
  return reservations.length - filteredReservations.length;
}

/**
 * Gets formatted current page result numbers text
 * @param {number} currentPage where page numbering starts from 0
 * @param {number} resultsPerPage max number of results shown per page
 * @param {number} currentPageResults how many results are in the current page
 * @param {number} totalResults number of results in all the pages
 * @returns {string} results text in the following format: "from - to / total"
 */
export function getPageResultsText(currentPage, resultsPerPage, currentPageResults, totalResults) {
  const from = resultsPerPage * currentPage + 1;
  const to = resultsPerPage * currentPage + currentPageResults;
  return `${from} - ${to} / ${totalResults}`;
}
