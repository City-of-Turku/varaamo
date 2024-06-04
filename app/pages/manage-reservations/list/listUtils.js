import moment from 'moment';

import { isMultiday } from '../../../utils/timeUtils';

/**
 * Returns formatted reservation begin datetime to end time string.
 * @param {object} reservation
 * @returns {string} formatted reservation time range "datetime - time"
 */
export function getDateAndTime(reservation) {
  const isReservationMultiday = isMultiday(reservation.begin, reservation.end);
  const begin = moment(reservation.begin);
  const end = moment(reservation.end);

  if (isReservationMultiday) {
    return `${begin.format('D.M.YYYY')} - ${end.format('D.M.YYYY')}`;
  }
  return `${begin.format('ddd L HH:mm')} - ${end.format('HH:mm')}`;
}

/**
 * Returns reservation with its resource without details i.e. with only id.
 * Detailess resource in reservation is useful in API calls where only id needs to exist.
 * @param {object} reservation with resource and its details
 * @returns {object} reservation with detailess resource
 */
export function getNormalizedReservation(reservation) {
  return Object.assign(
    {}, reservation, { resource: reservation.resource.id }
  );
}
