import constants from 'constants/AppConstants';

import camelCase from 'lodash/camelCase';
import clone from 'lodash/clone';
import find from 'lodash/find';
import last from 'lodash/last';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tail from 'lodash/tail';
import get from 'lodash/get';
import moment from 'moment';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { buildAPIUrl, getHeadersCreator } from './apiUtils';

function combine(reservations) {
  if (!reservations || !reservations.length) {
    return [];
  }

  const sorted = sortBy(reservations, 'begin');
  const initialValue = [clone(sorted[0])];

  return tail(sorted).reduce((previous, current) => {
    if (current.begin === last(previous).end) {
      last(previous).end = current.end;
    } else {
      previous.push(clone(current));
    }
    return previous;
  }, initialValue);
}

function isStaffEvent(reservation, resource) {
  if (!resource || !resource.requiredReservationExtraFields) {
    return false;
  }
  return some(resource.requiredReservationExtraFields, field => (
    !reservation[camelCase(field)]
  ));
}

function getCurrentReservation(reservations) {
  const now = moment();
  return find(
    reservations, reservation => moment(reservation.begin) < now && now < moment(reservation.end)
  );
}

function getMissingValues(reservation) {
  const missingValues = {};
  constants.REQUIRED_STAFF_EVENT_FIELDS.forEach((field) => {
    if (!reservation[field]) {
      missingValues[field] = '-';
    }
  });
  return missingValues;
}

function getNextAvailableTime(reservations, fromMoment = moment()) {
  const combinedReservations = combine(reservations);
  if (!combinedReservations.length || fromMoment < moment(combinedReservations[0].begin)) {
    return fromMoment;
  }
  const ongoingReservation = find(combinedReservations, reservation => (
    moment(reservation.begin) <= fromMoment && fromMoment < moment(reservation.end)
  ));
  return ongoingReservation ? moment(ongoingReservation.end) : fromMoment;
}

function getNextReservation(reservations) {
  const now = moment();
  const orderedReservations = sortBy(reservations, reservation => moment(reservation.begin));
  return find(orderedReservations, reservation => now < moment(reservation.begin));
}

function getEditReservationUrl(reservation) {
  const {
    begin, end, id, resource
  } = reservation;
  const date = moment(begin).format('YYYY-MM-DD');
  const beginStr = moment(begin).format('HH:mm');
  const endStr = moment(end).format('HH:mm');

  return `/reservation?begin=${beginStr}&date=${date}&end=${endStr}&id=${id || ''}&resource=${resource}`;
}

function isValidPhoneNumber(number) {
  // only allow numbers and + if its the first char
  const regex = /^([+]\d*|\d*)$/;
  if (regex.test(number) === false) {
    return false;
  }

  const phoneUtil = PhoneNumberUtil.getInstance();
  // if number starts with +, try to parse with any country code
  if (number && number[0] === '+') {
    try {
      const parsedNumber = phoneUtil.parse(number, '');
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
      return false;
    }
  } else {
    // if number doesnt start with +, assume country code is FI
    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(number, 'FI');
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
      return false;
    }
  }
}

/**
 * Checks if given reservation has an order.
 * @param {object} reservation
 * @returns {boolean} true if reservation has order, and false if not
 */
function hasOrder(reservation) {
  return 'order' in reservation && !!reservation.order;
}

/**
 * Checks if given resource has products.
 * @param {object} resource
 * @returns {boolean} true or false
 */
function hasProducts(resource) {
  return 'products' in resource && !!resource.products && resource.products.length > 0;
}

/**
 * Creates an array of product objects with product id and quantity.
 * @param {Array} products array
 * @returns {Array} product objects e.g. [{product: id-1, quantity: 1}, ...]
 * or null if given products is empty
 */
function createOrderLines(products) {
  if (products && products.length > 0) {
    return products.map(product => ({ product: product.id, quantity: 1 }));
  }

  return null;
}

/**
 * Creates an order object with order lines and return url.
 * @param {Array} products array
 * @returns {object} order object e.g.
 * {order_lines: {...}, returnUrl: 'mysite/reservation-payment-return'}
 * or null if given products is empty
 */
function createOrder(products) {
  if (products && products.length > 0) {
    const orderLines = createOrderLines(products);

    const returnUrl = `${window.location.origin}/reservation-payment-return`;
    const order = { order_lines: orderLines, return_url: returnUrl };
    return order;
  }
  return null;
}

/**
 * Makes a POST request to check price of given order.
 * @param {string} begin time
 * @param {string} end time
 * @param {Array} orderLines products of this order
 * @param {object} state current redux state
 * @returns {object} response price data
 */
async function checkOrderPrice(begin, end, orderLines, state) {
  const apiUrl = buildAPIUrl('order/check_price');
  const payload = {
    begin,
    end,
    order_lines: orderLines
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: getHeadersCreator()(state),
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return data;
}

/**
 * Creates and returns a formatted price string.
 * @param {object} product which has price data
 * @returns {string} formatted price
 */
function getFormattedProductPrice(product) {
  const price = product.price.amount;
  const pricePeriod = product.price.period;
  const priceType = product.price.type;
  const duration = moment.duration(pricePeriod);
  const hours = duration.asHours();
  const period = hours >= 1
    ? `${hours} h`
    : `${duration.asMinutes()} min`;
  const priceEnding = priceType === 'fixed' ? '' : ` / ${period}`;

  return `${price}€${priceEnding}`;
}

/**
 * Check if current user (logged in user) has
 * permission to modify selected reservation.
 *
 * Reservation which is in canceled state can not be changed to something else.
 *
 * @param {Object} reservation
 * @returns {Boolean} False by default
 */
export const canUserModifyReservation = (reservation) => {
  if (get(reservation, 'userPermissions.canModify', false)
      && reservation.state !== constants.RESERVATION_STATE.CANCELLED) {
    return true;
  }

  return false;
};

/**
 * Check if current user (logged in user) has
 * permission to cancel (delete) selected reservation.
 *
 * Reservation which is in canceled state can not be changed to something else.
 *
 * @param {Object} reservation
 * @returns {Boolean} False by default
 */
export const canUserCancelReservation = (reservation) => {
  if (get(reservation, 'userPermissions.canDelete', false)
      && reservation.state !== constants.RESERVATION_STATE.CANCELLED) {
    return true;
  }

  return false;
};

export {
  combine,
  isStaffEvent,
  getCurrentReservation,
  getEditReservationUrl,
  getMissingValues,
  getNextAvailableTime,
  getNextReservation,
  isValidPhoneNumber,
  hasOrder,
  hasProducts,
  createOrderLines,
  createOrder,
  checkOrderPrice,
  getFormattedProductPrice
};
