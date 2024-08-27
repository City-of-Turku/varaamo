
import camelCase from 'lodash/camelCase';
import clone from 'lodash/clone';
import find from 'lodash/find';
import last from 'lodash/last';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import tail from 'lodash/tail';
import get from 'lodash/get';
import moment from 'moment';

import constants from 'constants/AppConstants';
import { FIELDS } from 'constants/ReservationConstants';
import { buildAPIUrl, getHeadersCreator } from './apiUtils';
import { getLocalizedFieldValue } from './languageUtils';

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

  // blocked type reservations don't require any fields. In this case
  // don't assume reservation is staff event.
  if (reservation && reservation.type === constants.RESERVATION_TYPE.BLOCKED_VALUE) {
    return false;
  }

  return some(resource.requiredReservationExtraFields, (field) => {
    // billing fields can be left empty when no payment is made
    if (constants.RESERVATION_BILLING_FIELDS.includes(field)) {
      return false;
    }
    return !reservation[camelCase(field)];
  });
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

/**
 * Changes given product's quantity with given value and returns a new updated
 * product object
 * @param {object} product
 * @param {number} quantity
 * @returns {object} new updated product
 */
function changeProductQuantity(product, quantity) {
  return { ...product, quantity };
}

/**
 * Filters and returns only type extra products from given resource products
 * @param {array} products resource's products
 * @returns {array} resource's products which are type extra
 */
function getExtraProducts(products) {
  return products.filter(product => product.type === constants.PRODUCT_TYPES.EXTRA);
}

/**
 * Filters and returns only type rent (mandatory) products from given resource products
 * @param {array} products resource's products
 * @returns {array} resource's products which are type rent i.e. mandatory
 */
function getMandatoryProducts(products) {
  return products.filter(product => product.type === 'rent');
}

/**
 * Filters and returns only products with more than 0 quantity
 * @param {array} products
 * @returns {array} products with more than 0 quantity
 */
function getNonZeroQuantityProducts(products) {
  return products.filter(product => product.quantity > 0);
}

/**
 * Returns products of given type and sets their initial quantity value.
 * @param {object} resource with products info
 * @param {string} type i.e. mandatory or extra
 * @returns {array} products of given type with initial quantity set to 1 for
 * mandatory products and 0 for extra products
 */
function getInitialProducts(resource, type) {
  if (hasProducts(resource)) {
    if (type === constants.PRODUCT_TYPES.MANDATORY) {
      return getMandatoryProducts(resource.products)
        .map(product => changeProductQuantity(product, 1));
    }
    if (type === constants.PRODUCT_TYPES.EXTRA) {
      return getExtraProducts(resource.products)
        .map(product => changeProductQuantity(product, 0));
    }
  }
  return [];
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
 * Checks if given order's price is over 0
 * @param {object} order containing price info
 * @returns {boolean} true when order exists and has price over 0, false otherwise
 */
function hasPayment(order) {
  if (order) {
    return 'price' in order && (Number(order.price) > 0);
  }
  return false;
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
    return products.map(product => ({ product: product.id, quantity: product.quantity || 0 }));
  }

  return null;
}

/**
 * Creates an order object with order lines and return url.
 * @param {Array} products array
 * @param {string} [customerGroup] customer group's id
 * @param {string} [paymentMethod] payment method e.g. cash or online
 * @returns {object} order object e.g.
 * {order_lines: {...}, returnUrl: 'mysite/reservation-payment-return'}
 * or null if given products is empty
 */
function createOrder(products, customerGroup = '', paymentMethod = '') {
  if (products && products.length > 0) {
    const orderLines = createOrderLines(products);

    const returnUrl = getPaymentReturnUrl();
    const order = { order_lines: orderLines, return_url: returnUrl };
    if (customerGroup) {
      order.customer_group = customerGroup;
    }
    if (paymentMethod) {
      order.payment_method = paymentMethod;
    }
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
 * @param {string} [customerGroup] customer group's id
 * @returns {object} response price data
 */
async function checkOrderPrice(begin, end, orderLines, state, customerGroup = '') {
  const apiUrl = buildAPIUrl('order/check_price');
  const payload = {
    begin,
    end,
    order_lines: orderLines,
  };

  if (customerGroup) {
    payload.customer_group = customerGroup;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: getHeadersCreator()(state),
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error('order_price_fetch_error');
  }
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
 * Returns the url where Varaamo expects completed payments to be redirected to
 * @returns {string} return url
 */
function getPaymentReturnUrl() {
  return `${window.location.origin}/reservation-payment-return`;
}

/**
 * Returns localized customer group name from the given reservation.
 * If reservation has no customer group name or correct translation for it,
 * null is returned.
 * @param {object} reservation
 * @param {string} locale current locale e.g. fi, en, sv
 * @returns {string|null} localized customer group name
 */
function getReservationCustomerGroupName(reservation, locale) {
  const { order } = reservation;
  if (order) {
    return getLocalizedFieldValue(order.customerGroupName, locale);
  }

  return null;
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

/**
 * Checks whether cancelling manually confirmed paid reservation is allowed or not
 * @param {object} reservation
 * @returns {boolean} true when allowed, false if not
 */
function isManuallyConfirmedWithOrderAllowed(reservation) {
  const { needManualConfirmation, state } = reservation;
  if (needManualConfirmation && hasOrder(reservation)) {
    const states = constants.RESERVATION_STATE;
    if (state === states.REQUESTED || state === states.READY_FOR_PAYMENT) {
      return true;
    }
  }
  return false;
}

/**
 * Returns array with obj values for each option.
 * @param {Object[]} universalField
 * @param {Object} resource
 */
function normalizeUniversalFieldOptions(universalField, resource) {
  return universalField.reduce((acc, curr) => {
    // what sort of element, select? radio?
    const fieldType = curr.fieldType ? curr.fieldType.toLowerCase() : '';
    const currentOptions = curr.options;
    // normalize options
    const options = currentOptions.reduce((allOpts, option) => {
      allOpts.push({ id: option.id, name: option.text, value: option.id });
      return allOpts;
    }, []);
    // the key name that redux-form uses, currently only works for 1 universal field per resource.
    const nameValue = resource.universalField.length > 1 ? `universalData-${curr.id}` : 'universalData';
    const universalProps = {
      id: curr.id,
      description: curr.description,
      label: curr.label,
      options: currentOptions,
    };
    acc.push(
      {
        name: nameValue,
        fieldName: `componenttype-${curr.id}`,
        type: fieldType,
        label: curr.label,
        controlProps: { options },
        universalProps
      }
    );
    return acc;
  }, []);
}

/**
 * Returns mapped and sorted reservation form errors from the given errors array.
 * @param {Object[]} errors reservation form errors
 * @param {Object[]} universalFields universal fields in this form
 * @returns {Object[]} mapped and sorted reservation form errors
 */
function mapReservationErrors(errors, universalFields) {
  const mappedErrors = errors.map((error, index) => {
    // Note: only one universal field per resource is supported currently.
    if (error === 'universalData') {
      return {
        id: error, label: universalFields[0].label, forBilling: false, order: 100 + index
      };
    }
    const errorField = Object.values(FIELDS).find(field => field.id === error);
    if (errorField) {
      return errorField;
    }
    return {
      id: error, label: error, forBilling: false, order: 100 + index
    };
  });

  return mappedErrors.sort((a, b) => a.order - b.order);
}

/**
 * Formats given phone number by removing all whitespace characters
 * @param {string} phoneNum
 * @returns {string} formatted phone number
 */
function formatPhone(phoneNum) {
  if (!phoneNum) return phoneNum;
  return phoneNum.replace(/\s/g, '');
}

export {
  combine,
  isStaffEvent,
  getCurrentReservation,
  getEditReservationUrl,
  getMissingValues,
  getNextAvailableTime,
  getNextReservation,
  changeProductQuantity,
  getExtraProducts,
  getMandatoryProducts,
  getNonZeroQuantityProducts,
  getInitialProducts,
  hasOrder,
  hasPayment,
  hasProducts,
  createOrderLines,
  createOrder,
  checkOrderPrice,
  getFormattedProductPrice,
  getPaymentReturnUrl,
  getReservationCustomerGroupName,
  isManuallyConfirmedWithOrderAllowed,
  normalizeUniversalFieldOptions,
  mapReservationErrors,
  formatPhone,
};
