import moment from 'moment';

const persistedPaymentUrlKey = 'reservation.paymentUrlData';
const maxPaymentUrlAge = 10;
const enablePersistPaymentUrl = true; // toggle localStorage use on/off

/**
 * Tells whether paymentUrl data has expired or not
 * @param {number} timestamp unix timestamp
 * @returns {boolean} true or false
 */
export function isPaymentUrlExpired(timestamp) {
  const createdAt = moment(timestamp);
  const expiresAt = createdAt.add(maxPaymentUrlAge, 'minutes');
  const minutesLeft = expiresAt.diff(moment(), 'minutes');

  if (minutesLeft < 0) {
    return true;
  }
  return false;
}

/**
 * Loads and returns formatted persisted payment url from browser localStorage
 * @returns {object|undefined} persisted payment url data e.g.
 * {reservationId: 'id-123', paymentUrl: 'https://..', timestamp: 163..}
 * or undefined if data does not exist or is faulty
 */
export function loadPersistedPaymentUrl() {
  if (!enablePersistPaymentUrl) {
    return undefined;
  }

  try {
    const data = localStorage.getItem(persistedPaymentUrlKey);
    if (data === null) {
      return undefined;
    }

    const formattedData = JSON.parse(data);
    const { reservationId, paymentUrl, timestamp } = formattedData;
    if (!reservationId || !paymentUrl || !timestamp) {
      deletePersistedPaymentUrl();
      return undefined;
    }

    if (isPaymentUrlExpired(formattedData.timestamp)) {
      deletePersistedPaymentUrl();
      return undefined;
    }

    return formattedData;
  } catch (err) {
    return undefined;
  }
}

/**
 * Saves paymentUrl data to browser localStorage
 * @param {string} paymentUrl
 * @param {string} reservationId
 * @returns {undefined|null} void
 */
export function savePersistedPaymentUrl(paymentUrl, reservationId) {
  if (!enablePersistPaymentUrl) {
    return undefined;
  }

  const timestamp = Date.now();
  const formattedData = JSON.stringify({ reservationId, paymentUrl, timestamp });
  try {
    return localStorage.setItem(persistedPaymentUrlKey, formattedData);
  } catch (err) {
    return undefined;
  }
}

/**
 * Removes paymentUrl data from browser localStorage
 * @returns {undefined|null} void
 */
export function deletePersistedPaymentUrl() {
  if (!enablePersistPaymentUrl) {
    return undefined;
  }

  try {
    return localStorage.removeItem(persistedPaymentUrlKey);
  } catch (err) {
    return undefined;
  }
}
