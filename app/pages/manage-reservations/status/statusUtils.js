import constants from 'constants/AppConstants';

import { getStatusOptions } from '../filters/filterUtils';

/**
 * Gets bootstrap style for given status
 * @param {string} status
 * @returns {string} style keyword
 */
export function getLabelStyle(status) {
  switch (status) {
    case constants.RESERVATION_STATE.CANCELLED:
      return 'default';
    case constants.RESERVATION_STATE.CONFIRMED:
      return 'success';
    case constants.RESERVATION_STATE.DENIED:
      return 'danger';
    case constants.RESERVATION_STATE.REQUESTED:
      return 'warning';
    default:
      return '';
  }
}

/**
 * Gets translated label text for given status
 * @param {string} status
 * @param {function} t
 * @returns {string|undefined} translated label text or undefined if status is not found
 */
export function getLabelText(status, t) {
  const options = getStatusOptions(t);
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    if (option.value === status) {
      return option.label;
    }
  }
  return undefined;
}
